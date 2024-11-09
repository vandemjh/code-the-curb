import pandas as pd
import numpy as np
import pickle
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from scipy.stats import randint

# Read and prepare data
data = pd.read_json("./parking-fixed.json")
print(f"Read {data.shape[0]} rows")

# Set correct column names based on your data format
data.columns = ["id", "avg", "day", "hour"]

# Add cyclical features for time components
data["hour_sin"] = np.sin(2 * np.pi * data["hour"] / 24)
data["hour_cos"] = np.cos(2 * np.pi * data["hour"] / 24)
data["day_sin"] = np.sin(2 * np.pi * data["day"] / 7)
data["day_cos"] = np.cos(2 * np.pi * data["day"] / 7)

# Add time-based features
data["is_weekend"] = (data["day"] >= 5).astype(int)
data["is_business_hours"] = ((data["hour"] >= 9) & (data["hour"] <= 17)).astype(int)
data["is_evening"] = ((data["hour"] >= 18) & (data["hour"] <= 23)).astype(int)
data["is_morning"] = ((data["hour"] >= 5) & (data["hour"] <= 8)).astype(int)

# Create interaction features
data["weekend_evening"] = data["is_weekend"] * data["is_evening"]
data["weekend_morning"] = data["is_weekend"] * data["is_morning"]
data["weekend_business"] = data["is_weekend"] * data["is_business_hours"]

# Set up the features for one-hot encoding and numerical processing
categorical_features = ["id"]
numerical_features = [
    "hour_sin", "hour_cos", "day_sin", "day_cos",
    "is_weekend", "is_business_hours", "is_evening", "is_morning",
    "weekend_evening", "weekend_morning", "weekend_business"
]

# Create the preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("num", "passthrough", numerical_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
    ]
)

# Prepare X and y
X = data[categorical_features + numerical_features]
y = data["avg"]

# Print some basic statistics about the target variable
print("\nTarget Variable Statistics:")
print(f"Mean occupancy: {y.mean():.4f}")
print(f"Std occupancy: {y.std():.4f}")
print(f"Min occupancy: {y.min():.4f}")
print(f"Max occupancy: {y.max():.4f}")

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Fit and transform the preprocessor on training data
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Random Forest Regressor parameters
param_dist = {
    "n_estimators": randint(200, 1000),
    "max_depth": randint(10, 100),
    "min_samples_split": randint(2, 20),
    "min_samples_leaf": randint(1, 10),
    "max_features": ["sqrt", "log2"],
    "bootstrap": [True, False],
}

# Initialize and train Random Forest Regressor
rf = RandomForestRegressor(random_state=42)

random_search = RandomizedSearchCV(
    estimator=rf,
    param_distributions=param_dist,
    n_iter=30,
    verbose=10,
    random_state=42,
    n_jobs=-1,
    scoring="neg_mean_squared_error",
)

print("\nStarting model training...")
random_search.fit(X_train_processed, y_train)
best_model = random_search.best_estimator_

print("\nBest parameters found: ", random_search.best_params_)
print(f"Best CV score: {-random_search.best_score_:.4f} MSE")

# Save both the model and preprocessor
with open("model.pkl", "wb") as f:
    pickle.dump((best_model, preprocessor), f)
    print("\nSaved best_model and preprocessor")

# Make predictions on test data
y_pred = best_model.predict(X_test_processed)

# Evaluate the model using regression metrics
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\nModel Performance Metrics:")
print(f"Mean Squared Error: {mse:.4f}")
print(f"Root Mean Squared Error: {rmse:.4f}")
print(f"Mean Absolute Error: {mae:.4f}")
print(f"R-squared Score: {r2:.4f}")

# Feature importance analysis
feature_names = preprocessor.get_feature_names_out()
feature_importance = pd.DataFrame(
    {"feature": feature_names, "importance": best_model.feature_importances_}
)
feature_importance = feature_importance.sort_values("importance", ascending=False)

print("\nTop 10 Most Important Features:")
print(feature_importance.head(10).to_string())

# Analysis by time period
print("\nPrediction Analysis by Time Period:")
data['predictions'] = np.nan
data.loc[y_test.index, 'predictions'] = y_pred
data['abs_error'] = abs(data['avg'] - data['predictions'])

print("\nMean Absolute Error by Day Type:")
print(data.groupby('is_weekend')['abs_error'].mean())

print("\nMean Absolute Error by Time of Day:")
for period in ['is_morning', 'is_business_hours', 'is_evening']:
    print(f"\n{period}:")
    print(data.groupby(period)['abs_error'].mean())
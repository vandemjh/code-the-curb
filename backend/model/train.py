import pandas as pd
import numpy as np
import pickle
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from sklearn.model_selection import RepeatedKFold, train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from scipy.stats import randint

# Read and prepare data
data = pd.read_json("./parking-fixed.json")
print(f"Read {data.shape[0]} rows")

# Set correct column names based on your data format
data.columns = ["id", "avg", "day", "hour"]

# Set up the features for one-hot encoding and numerical processing
categorical_features = ["id"]
numerical_features = ["day", "hour"]

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

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Fit and transform the preprocessor on training data
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Random Forest Regressor parameters
param_dist = {
    "n_estimators": randint(100, 500),
    "max_depth": randint(5, 50),
    "min_samples_split": randint(2, 20),
    "min_samples_leaf": randint(1, 10),
    "max_features": ["auto", "sqrt"],
    "bootstrap": [True, False],
}

# Initialize and train Random Forest Regressor with RandomizedSearchCV
rf = RandomForestRegressor(random_state=42)

cv = RepeatedKFold(n_splits=5, n_repeats=3, random_state=42)

random_search = RandomizedSearchCV(
    estimator=rf,
    param_distributions=param_dist,
    n_iter=20,  # Increased from 10 to 20 for better parameter search
    cv=cv,
    verbose=10,
    random_state=42,
    n_jobs=-1,
    scoring="neg_mean_squared_error",  # Added explicit scoring metric
)

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

print("\nFeature Importances:")
for _, row in feature_importance.iterrows():
    print(f"Feature: {row['feature']:<20} Importance: {row['importance']:.4f}")

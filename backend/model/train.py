import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from scipy.stats import randint, uniform
import matplotlib.pyplot as plt
from sklearn.model_selection import learning_curve
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

# Read and prepare data
data = pd.read_json("./parking-fixed.json")
print(f"Read {data.shape[0]} rows")

data.columns = ["stall_id", "is_vacant", "hour", "minute", "day_of_week"]
data["is_vacant"] = data["is_vacant"].astype(bool)
data["time"] = data["hour"] * 60 + data["minute"]

# Create cyclical features
data["time_sin"] = np.sin(2 * np.pi * data["time"] / (24 * 60))
data["time_cos"] = np.cos(2 * np.pi * data["time"] / (24 * 60))
data["day_sin"] = np.sin(2 * np.pi * data["day_of_week"] / 7)
data["day_cos"] = np.cos(2 * np.pi * data["day_of_week"] / 7)

# Prepare features for one-hot encoding and numerical processing
categorical_features = ["stall_id"]  # We'll one-hot encode stall_id
numerical_features = [
    # "hour",
    # "minute",
    # "time",
    "time_sin",
    "time_cos",
    "day_sin",
    "day_cos"
]

# Create preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Prepare X and y
X = data[categorical_features + numerical_features]
y = data["is_vacant"]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Fit and transform the preprocessor on training data
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Random Forest parameters
param_dist = {
    "n_estimators": randint(100, 500),
    "max_depth": randint(5, 50),
    "min_samples_split": randint(2, 20),
    "min_samples_leaf": randint(1, 10),
    "bootstrap": [True, False],
}

# Initialize and train Random Forest with RandomizedSearchCV
rf = RandomForestClassifier(random_state=42, n_jobs=-1, verbose=10)

random_search = RandomizedSearchCV(
    estimator=rf,
    param_distributions=param_dist,
    verbose=10,
    random_state=42,
    n_jobs=-1,
)


best_model = rf.fit(X_train_processed, y_train)

# print("Best parameters found: ", random_search.best_params_)

# Save both the model and preprocessor
with open("model.pkl", "wb") as f:
    pickle.dump((best_model, preprocessor), f)
    print("Saved best_model and preprocessor")

# Make predictions
y_pred = best_model.predict(X_test_processed)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")
print(classification_report(y_test, y_pred))

# Function for making predictions on new data
def predict_parking(new_data):
    """
    Make predictions on new data using the saved model and preprocessor
    
    Args:
        new_data (pd.DataFrame): DataFrame with the same columns as training data
    
    Returns:
        np.array: Predictions (True for vacant, False for occupied)
    """
    # Load model and preprocessor
    with open("model.pkl", "rb") as f:
        best_model, preprocessor = pickle.load(f)
    
    # Process features
    X_new = new_data[categorical_features + numerical_features]
    X_new_processed = preprocessor.transform(X_new)
    
    # Make predictions
    return best_model.predict(X_new_processed)

import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from scipy.stats import randint, uniform
import matplotlib.pyplot as plt
from sklearn.model_selection import learning_curve

data = pd.read_json("./parking-fixed.json")
print(f"Read {data.shape[0]} rows")

data.columns = ["stall_id", "is_vacant", "hour", "minute", "day_of_week"]

data["is_vacant"] = data["is_vacant"].astype(bool)

data["time"] = data["hour"] * 60 + data["minute"]

data["time_sin"] = np.sin(2 * np.pi * data["time"] / (24 * 60))
data["time_cos"] = np.cos(2 * np.pi * data["time"] / (24 * 60))
data["day_sin"] = np.sin(2 * np.pi * data["day_of_week"] / 7)
data["day_cos"] = np.cos(2 * np.pi * data["day_of_week"] / 7)

from sklearn.ensemble import RandomForestClassifier

X = data[
    [
        "stall_id",
        "hour",
        "minute",
        "day_of_week",
        "time",
        "time_sin",
        "time_cos",
        "day_sin",
        "day_cos",
    ]
]
y = data["is_vacant"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

param_dist = {
    "n_estimators": randint(100, 500),
    "max_depth": randint(5, 50),
    "min_samples_split": randint(2, 20),
    "min_samples_leaf": randint(1, 10),
    "bootstrap": [True, False],
}

# Best parameters found:  {'bootstrap': True, 'max_depth': 39, 'max_features': np.float64(0.9093204020787821), 'min_samples_leaf': 4, 'min_samples_split': 19, 'n_estimators': 459}

rf = RandomForestClassifier(random_state=42)

random_search = RandomizedSearchCV(
    estimator=rf,
    param_distributions=param_dist,
    verbose=2,
    random_state=42,
)

random_search.fit(X_train, y_train)

best_model = random_search.best_estimator_

print("Best parameters found: ", random_search.best_params_)

with open("model.pkl", "wb") as f:
    pickle.dump(best_model, f)
    print("Saved best_model")

y_pred = best_model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")

print(classification_report(y_test, y_pred))

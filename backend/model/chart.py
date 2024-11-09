import pandas as pd
import pickle
import numpy as np
import matplotlib.pyplot as plt


def predict_parking_day(stall_id, day):
    categorical_features = ["stall_id"]
    numerical_features = ["time_sin", "time_cos", "day_sin", "day_cos"]

    with open("model.pkl", "rb") as f:
        best_model, preprocessor = pickle.load(f)

    hours = range(24)
    probabilities = []

    for hour in hours:
        time_sin = np.sin(2 * np.pi * hour / 24)
        time_cos = np.cos(2 * np.pi * hour / 24)
        day_sin = np.sin(2 * np.pi * day / 7)
        day_cos = np.cos(2 * np.pi * day / 7)

        sample_data = pd.DataFrame(
            {
                "stall_id": [stall_id],
                "time_sin": [time_sin],
                "time_cos": [time_cos],
                "day_sin": [day_sin],
                "day_cos": [day_cos],
            }
        )

        X_new = sample_data[categorical_features + numerical_features]
        X_new_processed = preprocessor.transform(X_new)
        prob = best_model.predict_proba(X_new_processed)[0][0]
        probabilities.append(prob)

    return probabilities


def plot_parking_probabilities(stall_id, day, probabilities):
    hours = range(24)
    plt.figure(figsize=(12, 6))
    plt.plot(hours, probabilities, marker="o")
    plt.title(f"Parking Occupancy Probability for {stall_id} on Day {day}")
    plt.xlabel("Hour of the Day")
    plt.ylabel("Probability of Occupancy")
    plt.xticks(range(0, 24, 2))
    plt.ylim(0, 1)
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.savefig(
        "./figure.png",
        transparent=True
    )


stall_id = "N10HIIRS"
day = 3


probabilities = predict_parking_day(stall_id, day)
print(f"Probabilities for each hour: {probabilities}")


plot_parking_probabilities(stall_id, day, probabilities)

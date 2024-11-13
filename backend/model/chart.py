import pandas as pd
import pickle
import numpy as np
import matplotlib.pyplot as plt


def predict_parking_day(block_id, day):
    categorical_features = ["block_id"]
    numerical_features = ["time_sin", "time_cos", "day_sin", "day_cos"]

    with open("model.pkl", "rb") as f:
        best_model, preprocessor = pickle.load(f)
        print(best_model)

    hours = range(24)
    probabilities = []

    for hour in hours:
        time_sin = np.sin(2 * np.pi * hour / 24)
        time_cos = np.cos(2 * np.pi * hour / 24)
        day_sin = np.sin(2 * np.pi * day / 7)
        day_cos = np.cos(2 * np.pi * day / 7)

        data = pd.DataFrame(
            {
                "block_id": [block_id],
                "time_sin": [time_sin],
                "time_cos": [time_cos],
                "day_sin": [day_sin],
                "day_cos": [day_cos],
            }
        )

        X_new = data[categorical_features + numerical_features]
        X_new_processed = preprocessor.transform(X_new)
        prob = best_model.predict_proba(X_new_processed)[0][0]
        probabilities.append(prob)

    return probabilities


def plot_parking_probabilities(block_id, day, probabilities):
    hours = range(24)
    plt.figure(figsize=(12, 6))
    plt.plot(hours, probabilities, marker="o", color="#1f77b4", markeredgecolor="white")
    plt.title(f"Parking Occupancy Probability for {block_id} on Day {day}", color="white")
    plt.xlabel("Hour of the Day", color="white")
    plt.ylabel("Probability of Occupancy", color="white")
    plt.xticks(range(0, 24, 2), color="white")
    plt.yticks(color="white")
    plt.ylim(0, 1)
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.savefig(
        "./figure.png",
        transparent=True
    )


block_id = "N10HIIRS"
day = 3


probabilities = predict_parking_day(block_id, day)
print(f"Probabilities for each hour: {probabilities}")


plot_parking_probabilities(block_id, day, probabilities)

from fastapi import FastAPI
import uvicorn
from routes.predict import router as predict_router

app = FastAPI(
    title="Parking Prediction API",
    description="API for predicting parking probabilities throughout the day",
)

app.include_router(predict_router)

@app.get("/")
async def root():
    """
    Root endpoint providing basic API information.
    """
    return {
        "message": "Parking Prediction API",
        "endpoints": {
            "predict": "/predict - POST request with block_id and day",
            "docs": "/docs - API documentation",
        },
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

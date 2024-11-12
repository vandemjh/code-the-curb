FROM python:3.10-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.10-slim

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY ./routes/* ./routes/
COPY ./main.py .
COPY ./model.pkl .

ENV PATH=/root/.local/bin:$PATH

ENV PYTHONUNBUFFERED=1
ENV HOST=0.0.0.0
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

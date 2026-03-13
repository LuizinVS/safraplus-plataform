# API-webScraping/safra-scraper/Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY ./requirements.txt .
# CORRECTION: Remove --prefix="/install"
RUN pip install --no-cache-dir -r requirements.txt
COPY ./app ./app
COPY ./run.py .
COPY ./.env .
CMD ["python", "run.py"]
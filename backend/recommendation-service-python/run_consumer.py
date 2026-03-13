# recommendation-service-python/run_consumer.py

from app.consumers import price_consumer
import logging

if __name__ == "__main__":
    # Configura o logging para vermos o que está acontecendo
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    price_consumer.start_consuming()
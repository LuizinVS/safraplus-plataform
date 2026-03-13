import pika
import logging
import json
import time
import requests
from app.core.config import settings
from app.services import recommendation_logic
from app.db import mongodb_service

# --- Constantes do Novo Fluxo ---
ANALYSIS_EXCHANGE = 'analysis_request_exchange'
ANALYSIS_QUEUE = 'analysis_request_queue'
ANALYSIS_ROUTING_KEY = 'analysis.request'
SCRAPER_API_URL = "http://scraper-api:8000/market-prices" # URL interna do Docker

# --- Constantes para Retentativa de Conexão ---
MAX_CONNECTION_RETRIES = 12 # Tentar por até 1 minuto (12 * 5 segundos)
RETRY_DELAY = 5             # Esperar 5 segundos entre tentativas

def get_market_price(crop_type: str) -> dict | None:
    try:
        commodity = crop_type.lower()
        url = f"{SCRAPER_API_URL}/{commodity}"
        logging.info(f"Buscando preço de mercado em: {url}")
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logging.error(f"Erro ao buscar preço no scraper-api para {crop_type}: {e}")
        return None

def on_message_received(ch, method, properties, body):
    logging.info(f"Nova SOLICITAÇÃO DE ANÁLISE recebida da fila '{ANALYSIS_QUEUE}'")
    try:
        safra_data = json.loads(body.decode('utf-8'))
        logging.info(f"Dados da safra recebidos: {safra_data}")
        crop_type = safra_data.get('cropType')
        if not crop_type:
            logging.error("Mensagem de safra sem 'cropType'. Descartando.")
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
            return

        price_data = get_market_price(crop_type)
        if not price_data:
            logging.error(f"Não foi possível obter preço de mercado para {crop_type}. Descartando mensagem.")
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
            return

        analysis_data = {
            "safra_info": safra_data,
            "market_info": price_data
        }
        recommendation_logic.analyze_and_recommend(analysis_data)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    except json.JSONDecodeError:
        logging.error("Falha ao decodificar mensagem JSON da safra. Descartando.")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
    except Exception as e:
        logging.error(f"Erro inesperado no processamento da mensagem de safra: {e}. Descartando.")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

def start_consuming():
    logging.info("Iniciando motor de recomendações...")

    try:
        mongodb_service.connect_to_mongo()
    except Exception as e:
        logging.error(f"Falha CRÍTICA ao conectar no MongoDB: {e}")
        return

    connection = None
    while True:
        connection_retries = 0
        channel = None

        while connection_retries < MAX_CONNECTION_RETRIES:
            try:
                logging.info(f"Tentando conectar ao RabbitMQ (tentativa {connection_retries + 1}/{MAX_CONNECTION_RETRIES})...")
                connection = pika.BlockingConnection(pika.URLParameters(settings.RABBITMQ_URL))
                channel = connection.channel()
                logging.info("Conectado ao RabbitMQ com sucesso!")
                break
            except pika.exceptions.AMQPConnectionError as e:
                connection_retries += 1
                logging.error(f"Falha ao conectar ao RabbitMQ ({e}). Tentando novamente em {RETRY_DELAY} segundos...")
                if connection_retries >= MAX_CONNECTION_RETRIES:
                    logging.error("Número máximo de tentativas de conexão excedido. O serviço será encerrado.")
                    mongodb_service.close_mongo_connection()
                    return
                time.sleep(RETRY_DELAY)
            except Exception as e:
                 connection_retries += 1
                 logging.error(f"Erro inesperado ao conectar ao RabbitMQ ({e}). Tentando novamente em {RETRY_DELAY} segundos...")
                 if connection_retries >= MAX_CONNECTION_RETRIES:
                    logging.error("Número máximo de tentativas excedido após erro inesperado. O serviço será encerrado.")
                    mongodb_service.close_mongo_connection()
                    return
                 time.sleep(RETRY_DELAY)

        if not channel:
             logging.error("Não foi possível estabelecer conexão com RabbitMQ após múltiplas tentativas. Encerrando.")
             break

        try:
            channel.exchange_declare(exchange=ANALYSIS_EXCHANGE, exchange_type='topic', durable=True)
            channel.queue_declare(queue=ANALYSIS_QUEUE, durable=True)
            channel.queue_bind(exchange=ANALYSIS_EXCHANGE, queue=ANALYSIS_QUEUE, routing_key=ANALYSIS_ROUTING_KEY)

            logging.info(f"[*] Consumidor pronto. Aguardando mensagens na fila '{ANALYSIS_QUEUE}'.")
            channel.basic_consume(queue=ANALYSIS_QUEUE, on_message_callback=on_message_received, auto_ack=False)
            channel.start_consuming()

        except pika.exceptions.ConnectionClosedByBroker:
            logging.warning("Conexão fechada pelo Broker RabbitMQ. Tentando reconectar...")
        except pika.exceptions.AMQPChannelError as err:
            logging.error(f"Erro fatal no canal: {err}. Tentando reconectar...")
        except pika.exceptions.AMQPConnectionError:
             logging.warning("Conexão AMQP perdida durante o consumo. Tentando reconectar...")
        except Exception as e:
            logging.error(f"Erro inesperado durante o consumo: {e}. Tentando reconectar...")

        logging.info(f"Esperando {RETRY_DELAY} segundos antes de tentar reconectar ao RabbitMQ...")
        if connection and connection.is_open:
            try: connection.close()
            except: pass
        connection = None
        time.sleep(RETRY_DELAY)

    logging.info("Motor de recomendações encerrado.")
    mongodb_service.close_mongo_connection()

# Este bloco __name__ == "__main__" é o que o comando 'python -m' executa
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    start_consuming()
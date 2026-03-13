# app/services/rabbitmq_service.py

import pika
import logging
import json
from app.core.config import settings  # Importamos nossas configurações

PRICE_UPDATES_EXCHANGE = 'safra_price_updates'

def publish_message(exchange_name: str, message_body: dict):
    """
    Publica uma mensagem em um exchange do tipo fanout no RabbitMQ.
    """
    connection = None
    try:
        logging.info(f"Conectando ao RabbitMQ para publicar no exchange '{exchange_name}'...")

        # Conecta ao RabbitMQ usando a URL do arquivo .env
        connection = pika.BlockingConnection(pika.URLParameters(settings.RABBITMQ_URL))
        channel = connection.channel()

        # Declara o exchange. Se ele não existir, será criado.
        # durable=True garante que o exchange sobreviva a reinicializações do RabbitMQ.
        channel.exchange_declare(exchange=exchange_name, exchange_type='fanout', durable=True)

        # Converte o dicionário Python para uma string JSON e depois para bytes
        message_bytes = json.dumps(message_body, default=str).encode('utf-8')

        # Publica a mensagem no exchange especificado
        channel.basic_publish(
            exchange=exchange_name,
            routing_key='',  # routing_key não é usada em exchanges do tipo fanout
            body=message_bytes,
            properties=pika.BasicProperties(
                delivery_mode=2,  # Torna a mensagem persistente
            )
        )

        logging.info(f"Mensagem publicada com sucesso no exchange '{exchange_name}'.")

    except pika.exceptions.AMQPConnectionError as e:
        logging.error(f"Erro de conexão com o RabbitMQ: {e}")
        raise  # Re-lança a exceção para que o serviço que chamou saiba que falhou
    except Exception as e:
        logging.error(f"Um erro inesperado ocorreu ao publicar no RabbitMQ: {e}")
        raise
    finally:
        # Garante que a conexão seja sempre fechada, mesmo se ocorrer um erro.
        if connection and connection.is_open:
            connection.close()
            logging.info("Conexão com o RabbitMQ fechada.")
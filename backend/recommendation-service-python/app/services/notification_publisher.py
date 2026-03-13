import pika
import logging
import json
from app.core.config import settings

# Constantes do Java
NOTIFICATION_EXCHANGE = "notification_exchange"
NOTIFICATION_ROUTING_KEY = "notification.info"

def publish_notification(user_email: str, message: str, type: str):
    """
    Publica uma mensagem de notificação final para o notification-service.
    """
    connection = None
    try:
        logging.info(f"Publicando notificação para {user_email}...")
        connection = pika.BlockingConnection(pika.URLParameters(settings.RABBITMQ_URL))
        channel = connection.channel()

        channel.exchange_declare(exchange=NOTIFICATION_EXCHANGE, exchange_type='topic', durable=True)

        notification_payload = {
            "userEmail": user_email,
            "message": message,
            "type": type
        }

        message_bytes = json.dumps(notification_payload, default=str).encode('utf-8')

        channel.basic_publish(
            exchange=NOTIFICATION_EXCHANGE,
            routing_key=NOTIFICATION_ROUTING_KEY,
            body=message_bytes,
            properties=pika.BasicProperties(delivery_mode=2)
        )

        logging.info("Notificação publicada com sucesso!")

    except Exception as e:
        logging.error(f"Falha ao publicar notificação: {e}")
        # Não relançamos o erro, pois a recomendação já foi salva.
    finally:
        if connection and connection.is_open:
            connection.close()

# scraper-api/app/db/mongodb_service.py

import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId

from app.core.config import settings

mongo_client = None
db = None


def connect_to_mongo() -> None:
    """
    Cria a conexão com o banco de dados MongoDB na inicialização da aplicação.
    """
    global mongo_client, db
    try:
        logging.info("Tentando conectar ao MongoDB...")

        mongo_client = MongoClient(settings.MONGO_DB_URL, serverSelectionTimeoutMS=5000)
        mongo_client.admin.command('ping')

        db = mongo_client.get_database(settings.MONGO_DB_NAME)

        logging.info(f"Conexão com o MongoDB estabelecida com sucesso no banco '{settings.MONGO_DB_NAME}'!")

    except ConnectionFailure as e:
        logging.error(f"Não foi possível conectar ao MongoDB: {e}")
        raise


def close_mongo_connection() -> None:
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logging.info("Conexão com o MongoDB fechada.")


def save_price_history(data: dict) -> ObjectId | None:
    if db is None:
        logging.error("A conexão com o banco de dados não está disponível para salvar.")
        return None
    try:
        collection = db.get_collection("price_history")
        result = collection.insert_one(data)
        logging.info(f"Dado inserido no MongoDB com o ID: {result.inserted_id}")
        return result.inserted_id
    except Exception as e:
        logging.error(f"Erro ao tentar salvar dado no MongoDB: {e}")
        return None
from fastapi import FastAPI, BackgroundTasks, HTTPException
from contextlib import asynccontextmanager
import logging
from datetime import datetime, timezone
from bson import ObjectId # Importar ObjectId para conversão

from app.db import mongodb_service
from app.services import scraper_service
from app.services import rabbitmq_service

logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("API iniciando... Conectando ao banco de dados.")
    mongodb_service.connect_to_mongo()
    yield
    logging.info("API encerrando... Fechando conexão com o banco de dados.")
    mongodb_service.close_mongo_connection()

app = FastAPI(title="Safra+ Scraper API", version="1.0.0", lifespan=lifespan)

@app.get("/", summary="Verificação de Saúde")
def read_root():
    return {"Status": "API do Safra+ Scraper está no ar!"}

@app.post("/scrape/milho", status_code=202, summary="Dispara o Scraper Real de Milho")
def trigger_real_milho_scraper(background_tasks: BackgroundTasks):
    logging.info("Endpoint /scrape/milho (REAL) acionado.")
    background_tasks.add_task(scraper_service.run_milho_scraper_task)
    return {"message": "Tarefa de scraping REAL do milho foi iniciada em segundo plano."}

@app.post("/scrape/milho/mock", status_code=200, summary="Gera um Evento Falso (Mock) de Preço de Milho")
def trigger_mock_milho_scraper():
    logging.info("--- Endpoint /scrape/milho/mock acionado ---")
    mock_data = {
        # Vamos padronizar o nome do insumo do mock para ser igual ao da lógica
        "insumo": "milho_cepea_mock",
        "preco": 29.50,
        "unidade": "saca_60kg",
        "fonte": "DADO SIMULADO VIA ENDPOINT MOCK",
        "data_coleta": datetime.now(timezone.utc).isoformat()
    }
    
    inserted_id = mongodb_service.save_price_history(mock_data)
    if inserted_id:
        try:
            rabbitmq_service.publish_message(
                exchange_name=rabbitmq_service.PRICE_UPDATES_EXCHANGE,
                message_body=mock_data
            )
            return {"message": "Evento mock do preço do milho gerado e publicado com sucesso!", "mongo_id": str(inserted_id)}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Dado mock salvo no DB, mas falhou ao publicar no RabbitMQ: {e}")
    else:
        raise HTTPException(status_code=500, detail="Falha ao salvar o dado mock no MongoDB.")

# --- O NOVO ENDPOINT QUE ESTAVA FALTANDO ---
@app.get("/market-prices/{commodity}", summary="Busca o último preço salvo de uma commodity")
def get_market_price(commodity: str):
    """
    Busca o preço mais recente de uma commodity (ex: milho) 
    armazenado no banco de dados MongoDB.
    """
    logging.info(f"Buscando último preço para: {commodity}")
    
    # Padroniza o nome do insumo (ex: 'milho' -> 'milho_cepea_mock')
    # Esta é a lógica principal que o Vinicius precisa ajustar
    insumo_name = f"{commodity.lower()}_cepea_mock"
    if "milho" not in commodity.lower():
         insumo_name = f"{commodity.lower()}_cepea"

    latest_price_data = mongodb_service.get_latest_price_by_insumo(insumo_name)

    if latest_price_data:
        # Converte o ObjectId para string para ser serializável em JSON
        latest_price_data["_id"] = str(latest_price_data["_id"])
        return latest_price_data
    else:
        raise HTTPException(status_code=404, detail=f"Nenhum preço encontrado para o insumo: {insumo_name}")


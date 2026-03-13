import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime, timezone
from app.db import mongodb_service

logging.basicConfig(level=logging.INFO)
URL_MILHO_CEPEA = "https://www.cepea.esalq.usp.br/br/indicador/milho.aspx"


def scrape_milho_price() -> dict | None:
    """
    Busca o preço do milho.
    Se falhar, retorna um valor fixo para não quebrar o fluxo.
    """
    try:
        logging.info("Iniciando scraping da página do CEPEA para o Milho...")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(URL_MILHO_CEPEA, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'lxml')
        price_row = soup.select_one("#imagenet-indicador-tabela > tbody > tr:nth-of-type(1)")

        if not price_row:
            logging.warning("Não foi possível encontrar a linha da tabela. RETORNANDO DADO FALSO (MOCK).")
            return {
                "insumo": "milho_cepea_mock",
                "preco": 28.75,
                "unidade": "saca_60kg",
                "fonte": "DADO SIMULADO PARA TESTE",
                "data_coleta": datetime.now(timezone.utc).isoformat()
            }

        columns = price_row.find_all('td')
        price_str = columns[1].text.strip()
        price_cleaned = price_str.replace('R$', '').replace('.', '').replace(',', '.').strip()
        price_float = float(price_cleaned)
        logging.info(f"Preço do milho extraído com sucesso: R$ {price_float}")
        return {
            "insumo": "milho_cepea",
            "preco": price_float,
            "unidade": "saca_60kg",
            "fonte": URL_MILHO_CEPEA,
            "data_coleta": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logging.error(f"Uma exceção ocorreu durante o scraping: {e}. RETORNANDO DADO FALSO (MOCK).")
        return {
            "insumo": "milho_cepea_mock",
            "preco": 28.75,
            "unidade": "saca_60kg",
            "fonte": "DADO SIMULADO PARA TESTE",
            "data_coleta": datetime.now(timezone.utc).isoformat()
        }

def run_milho_scraper_task():
    """
    Orquestra a tarefa de scraping: busca o dado e salva no banco de dados.
    A publicação no RabbitMQ foi removida.
    """
    logging.info("--- Iniciando tarefa de scraping do milho ---")

    scraped_data = scrape_milho_price()

    if scraped_data:
        logging.info(f"Dado coletado com sucesso. Tentando salvar no banco de dados...")
        inserted_id = mongodb_service.save_price_history(scraped_data)

        if inserted_id:
            logging.info(f"Tarefa concluída! Dado salvo com ID: {inserted_id}")
            return inserted_id
        else:
            logging.error("Falha ao salvar o dado no banco de dados.")
            return None
    else:
        logging.error("Scraping falhou. A tarefa será encerrada.")
        return None

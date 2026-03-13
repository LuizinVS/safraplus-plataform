import logging
import pandas as pd
import requests
import json
from app.db import mongodb_service
from app.core.config import settings
from app.services import notification_publisher # <-- Importa o novo publicador

# Constantes para comunicação
CAPITAL_SERVICE_URL = "http://capital-service:8080"
TAXA_SELIC_ANUAL = 0.105 # Mock

def analyze_and_recommend(analysis_data: dict):
    """
    Lógica de negócio principal: analisa os dados e dispara ações.
    """
    try:
        # 1. Extrair dados
        safra_info = analysis_data.get("safra_info", {})
        market_info = analysis_data.get("market_info", {})

        safra_id = safra_info.get('safraId')
        crop_type = safra_info.get('cropType')
        user_email = safra_info.get('userEmail') # Agora recebemos o email!

        preco_atual = market_info.get('preco')

        if not all([safra_id, crop_type, user_email, preco_atual]):
            logging.warning("Dados de análise incompletos. Ignorando.")
            return

        logging.info(f"Analisando Safra ID {safra_id} ({crop_type}) com preço atual de R$ {preco_atual}")

        if mongodb_service.db is None:
            logging.error("Conexão com MongoDB não inicializada.")
            return

        # 2. Buscar Histórico
        insumo_name = f"{crop_type.lower()}_cepea_mock"
        collection = mongodb_service.db["price_history"]
        historico_cursor = collection.find({"insumo": insumo_name})
        historico_list = list(historico_cursor)

        if len(historico_list) < 2:
            logging.info(f"Dados históricos insuficientes para '{insumo_name}'.")
            # Vamos gerar uma recomendação padrão mesmo sem histórico
            recommendation_text = f"Primeira vez analisando '{crop_type}'. Recomendamos monitorar os preços."
            action = "MONITORAR"
        else:
            # 3. Lógica de Decisão (com Pandas)
            df = pd.DataFrame(historico_list)
            media_preco_historica = df['preco'].mean()
            logging.info(f"Média histórica: R$ {media_preco_historica:.2f}")

            limite_compra = media_preco_historica * 0.98

            if preco_atual <= limite_compra:
                recommendation_text = f"OPORTUNIDADE: Preço do '{crop_type}' (R$ {preco_atual}) está abaixo da média (R$ {media_preco_historica:.2f})."
                action = "COMPRAR_INSUMO"
            else:
                recommendation_text = f"ALERTA: Preço do '{crop_type}' (R$ {preco_atual}) está acima da média (R$ {media_preco_historica:.2f}). Sugerimos aguardar."
                action = "MANTER_CAPITAL"

        logging.info(f"--- RECOMENDAÇÃO GERADA PARA SAFRA {safra_id} ---")

        # 4. Salvar a recomendação no capital-service
        save_recommendation_url = f"{CAPITAL_SERVICE_URL}/safras/{safra_id}/recommendations"
        payload = {
            "recommendationText": recommendation_text,
            "action": action
        }

        try:
            response = requests.post(save_recommendation_url, json=payload)
            response.raise_for_status() # Lança erro se for 4xx ou 5xx
            logging.info(f"Recomendação salva com sucesso no capital-service para safra {safra_id}.")
        except requests.RequestException as e:
            logging.error(f"Falha ao salvar recomendação no capital-service: {e}")
            return # Se não salvar, não notifica

        # 5. Publicar a notificação para o usuário
        try:
            notification_publisher.publish_notification(
                user_email=user_email,
                message=recommendation_text, # Envia o texto da própria recomendação
                type="RECOMMENDATION_NEW"
            )
        except Exception as e:
            logging.error(f"Recomendação salva, mas falhou ao publicar notificação: {e}")

    except Exception as e:
        logging.error(f"Erro fatal ao analisar recomendação: {e}")


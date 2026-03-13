# recommendation-service-python/Dockerfile

# 1. Padroniza a versão do Python com a que funciona (a mesma do scraper)
FROM python:3.12-slim

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Copia o arquivo de dependências
COPY requirements.txt .

# 4. Instala as dependências (SEM o --prefix)
# Adiciona psycopg2-binary aqui, já que você precisa dele
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir psycopg2-binary

# 5. Copia todo o código-fonte da aplicação
COPY . .

# 6. Expõe a porta da API (para o futuro)
EXPOSE 8002

# 7. O comando de início (o seu comando, que está correto)
CMD ["python", "-m", "app.consumers.price_consumer"]
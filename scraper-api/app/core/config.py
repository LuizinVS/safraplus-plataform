from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # O Pydantic vai ler as variáveis do arquivo .env automaticamente
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    MONGO_DB_URL: str
    MONGO_DB_NAME: str
    RABBITMQ_URL: str

# Criamos uma instância única que será usada em todo o projeto
settings = Settings()
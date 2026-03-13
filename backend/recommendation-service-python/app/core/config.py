from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    MONGO_DB_URL: str
    MONGO_DB_NAME: str
    RABBITMQ_URL: str

settings = Settings()
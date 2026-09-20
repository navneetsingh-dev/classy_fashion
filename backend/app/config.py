import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ClassyTailors API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "classytailors_super_secure_jwt_secret_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./classytailors.db")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@classytailors.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin123")

settings = Settings()

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.core.logging import logger
from app.models.db_models import Base

# Transparent driver support: SQLite (local fallback) & PostgreSQL (psycopg2 / asyncpg)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    # SQLAlchemy 2.0 requires postgresql://
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(
    db_url,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True if not db_url.startswith("sqlite") else False,
    pool_size=10 if not db_url.startswith("sqlite") else 5,
    max_overflow=20 if not db_url.startswith("sqlite") else 10
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initializes the database schema for either PostgreSQL or SQLite."""
    dialect_name = engine.dialect.name
    logger.info(f"Initializing {dialect_name.upper()} relational database tables for RiskGuard & Razorpay...")
    Base.metadata.create_all(bind=engine)
    logger.info(f"{dialect_name.upper()} database initialized successfully.")

def get_session():
    """Dependency for obtaining database sessions with automatic cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

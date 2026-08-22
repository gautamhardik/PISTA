from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.database import init_db
from app.services.model_service import model_service
from app.api.routes import health, prediction, model, analytics, payments

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing PISTA Backend Service...")
    init_db()
    # Model artifacts loaded at module level in model_service
    yield
    # Shutdown
    logger.info("Shutting down PISTA Backend Service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade real-time fraud decisioning and risk routing API powered by Tuned LightGBM.",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, tags=["Health"])
app.include_router(prediction.router, prefix=settings.API_V1_PREFIX, tags=["Predictions"])
app.include_router(model.router, prefix=settings.API_V1_PREFIX, tags=["Model Governance"])
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX, tags=["Analytics & Queues"])
app.include_router(payments.router, prefix=settings.API_V1_PREFIX, tags=["Razorpay Test Integration"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

# Vercel / AWS Lambda ASGI handler (mangum adapts FastAPI for serverless)
try:
    from mangum import Mangum
    # Ensure DB tables exist on serverless cold start (lifespan won't fire)
    init_db()
    handler = Mangum(app, lifespan="off")
except ImportError:
    pass

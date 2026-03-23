from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Deal Aggregator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Only load routes if database is configured
try:
    from database import engine, Base
    from routes import search, products
    
    Base.metadata.create_all(bind=engine)
    app.include_router(search.router, prefix="/api/search", tags=["search"])
    app.include_router(products.router, prefix="/api/products", tags=["products"])
    logging.info("✓ Database and routes loaded")
except Exception as e:
    logging.warning(f"⚠ Database not available: {e}. Running in demo mode.")

@app.get("/")
async def root():
    return {
        "message": "Deal Aggregator API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

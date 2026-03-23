from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Deal Aggregator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Track loaded routes
loaded_routes = []
errors = []

# Only load routes if database is configured
try:
    from database import engine, Base
    from routes import search, products
    
    Base.metadata.create_all(bind=engine)
    app.include_router(search.router, prefix="/api/search", tags=["search"])
    app.include_router(products.router, prefix="/api/products", tags=["products"])
    
    loaded_routes = ["search", "products"]
    logger.info("✓ Database and routes loaded successfully")
except Exception as e:
    error_msg = f"⚠ Database/routes failed: {str(e)}"
    errors.append(error_msg)
    logger.error(error_msg)
    logger.info("✓ Running in demo mode (fallback)")

@app.get("/")
async def root():
    return {
        "message": "Deal Aggregator API",
        "version": "1.0.0",
        "status": "running",
        "loaded_routes": loaded_routes,
        "errors": errors if errors else None
    }

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "routes_loaded": len(loaded_routes) > 0,
        "available_routes": loaded_routes,
        "initialization_errors": errors if errors else None
    }

@app.get("/debug")
async def debug():
    """Debug endpoint to show what's loaded"""
    return {
        "status": "debug",
        "routes_loaded": loaded_routes,
        "errors": errors,
        "available_endpoints": [
            {"path": route.path, "methods": list(route.methods)} 
            for route in app.routes
        ]
    }

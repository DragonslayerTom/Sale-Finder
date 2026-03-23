from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Product, Price

router = APIRouter()

@router.get("/")
async def search(
    q: str,
    category: str = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Search for products"""
    query = db.query(Product)
    
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))
    
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    # Get best deal for each product
    results = []
    for product in products:
        best_price = db.query(Price).filter(
            Price.product_id == product.id
        ).order_by(Price.price.asc()).first()
        
        results.append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "best_deal": {
                "retailer": best_price.retailer if best_price else None,
                "price": best_price.price if best_price else None,
                "url": best_price.url if best_price else None,
            } if best_price else None
        })
    
    return {
        "query": q,
        "products": results,
        "total": total
    }

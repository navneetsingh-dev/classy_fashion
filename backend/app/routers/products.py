from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from backend.app.database import get_db
from backend.app.models import Product, Category, Review
from backend.app.schemas import ReviewCreate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("")
def list_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    fabric: Optional[str] = None,
    occasion: Optional[str] = None,
    sort_by: Optional[str] = "newest",  # newest, price_asc, price_desc, rating, popular
    page: int = Query(1, ge=1),
    limit: int = Query(24, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)

    if category:
        # Category can be slug or ID
        if category.isdigit():
            query = query.filter(Product.category_id == int(category))
        else:
            cat = db.query(Category).filter(Category.slug == category).first()
            if cat:
                query = query.filter(Product.category_id == cat.id)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Product.title.ilike(search_fmt),
                Product.description.ilike(search_fmt),
                Product.fabric.ilike(search_fmt),
                Product.occasion.ilike(search_fmt),
                Product.sku.ilike(search_fmt)
            )
        )

    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if fabric:
        query = query.filter(Product.fabric.ilike(f"%{fabric}%"))
    if occasion:
        query = query.filter(Product.occasion.ilike(f"%{occasion}%"))

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(asc(Product.price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Product.price))
    elif sort_by == "rating":
        query = query.order_by(desc(Product.rating))
    elif sort_by == "discount":
        query = query.order_by(desc(Product.discount_percent))
    else:  # newest
        query = query.order_by(desc(Product.id))

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "items": [p.to_dict() for p in items]
    }

@router.get("/featured")
def get_featured_products(limit: int = 8, db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.is_active == True,
        Product.is_featured == True
    ).limit(limit).all()
    return [p.to_dict() for p in products]

@router.get("/{slug_or_id}")
def get_product(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        product = db.query(Product).filter(Product.id == int(slug_or_id), Product.is_active == True).first()
    else:
        product = db.query(Product).filter(Product.slug == slug_or_id, Product.is_active == True).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Fetch similar products in same category
    similar = db.query(Product).filter(
        Product.category_id == product.category_id,
        Product.id != product.id,
        Product.is_active == True
    ).limit(4).all()

    data = product.to_dict()
    data["similar_products"] = [s.to_dict() for s in similar]
    return data

@router.get("/{product_id}/reviews")
def get_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(desc(Review.id)).all()
    return [r.to_dict() for r in reviews]

@router.post("/{product_id}/reviews")
def add_review(product_id: int, review_in: ReviewCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    new_review = Review(
        product_id=product_id,
        user_name=review_in.user_name,
        rating=review_in.rating,
        comment=review_in.comment,
        verified_purchase=True
    )
    db.add(new_review)

    # Recalculate product rating
    existing_reviews = db.query(Review).filter(Review.product_id == product_id).all()
    total_reviews = len(existing_reviews) + 1
    sum_ratings = sum(r.rating for r in existing_reviews) + review_in.rating
    product.rating = round(sum_ratings / total_reviews, 1)
    product.review_count = total_reviews

    db.commit()
    db.refresh(new_review)
    return new_review.to_dict()

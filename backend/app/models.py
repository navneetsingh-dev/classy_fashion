import datetime
import json
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="customer")  # "admin", "customer"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    orders = relationship("Order", back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False, index=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), index=True, nullable=False)
    
    description = Column(Text, nullable=False)
    fabric = Column(String(100), default="Pure Silk")  # e.g., Silk, Georgette, Chanderi, Cotton, Velvet
    occasion = Column(String(100), default="Festive")  # Wedding, Festive, Party, Casual
    pattern = Column(String(100), default="Embroidered")
    fit_type = Column(String(100), default="Tailored Fit")
    care_instructions = Column(String(255), default="Dry clean only")
    
    price = Column(Float, nullable=False, index=True)
    compare_at_price = Column(Float, nullable=True)  # MRP before discount
    discount_percent = Column(Integer, default=0)
    cost_price = Column(Float, nullable=True)  # Admin tracking
    
    rating = Column(Float, default=4.8, index=True)
    review_count = Column(Integer, default=12)
    stock = Column(Integer, default=50)
    is_featured = Column(Boolean, default=False, index=True)
    is_active = Column(Boolean, default=True, index=True)
    is_customizable = Column(Boolean, default=True)  # Whether custom measurements/tailoring can be requested
    
    # JSON encoded strings
    images = Column(Text, default="[]")  # list of URLs
    sizes = Column(Text, default='["XS","S","M","L","XL","XXL","Custom Tailored"]')
    colors = Column(Text, default="[]")  # list of {name, hex}
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "sku": self.sku,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else "",
            "description": self.description,
            "fabric": self.fabric,
            "occasion": self.occasion,
            "pattern": self.pattern,
            "fit_type": self.fit_type,
            "care_instructions": self.care_instructions,
            "price": self.price,
            "compare_at_price": self.compare_at_price,
            "discount_percent": self.discount_percent,
            "cost_price": self.cost_price,
            "rating": self.rating,
            "review_count": self.review_count,
            "stock": self.stock,
            "is_featured": self.is_featured,
            "is_active": self.is_active,
            "is_customizable": self.is_customizable,
            "images": json.loads(self.images) if self.images else [],
            "sizes": json.loads(self.sizes) if self.sizes else [],
            "colors": json.loads(self.colors) if self.colors else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    customer_name = Column(String(120), nullable=False)
    customer_email = Column(String(180), nullable=False)
    customer_phone = Column(String(30), nullable=False)
    
    shipping_address = Column(Text, nullable=False)  # JSON {street, city, state, pincode, landmark}
    items = Column(Text, nullable=False)  # JSON array of ordered items
    
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    coupon_code = Column(String(50), nullable=True)
    delivery_fee = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    payment_method = Column(String(30), default="cod")  # "cod", "upi", "card", "netbanking"
    payment_status = Column(String(30), default="pending")  # "pending", "paid", "failed"
    
    # Meesho/ClassyTailors Status timeline
    order_status = Column(String(30), default="placed", index=True)
    # Statuses: "placed", "tailoring", "quality_check", "shipped", "out_for_delivery", "delivered", "cancelled"
    
    tracking_number = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    custom_tailoring_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.order_number,
            "user_id": self.user_id,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "customer_phone": self.customer_phone,
            "shipping_address": json.loads(self.shipping_address) if self.shipping_address else {},
            "items": json.loads(self.items) if self.items else [],
            "subtotal": self.subtotal,
            "discount_amount": self.discount_amount,
            "coupon_code": self.coupon_code,
            "delivery_fee": self.delivery_fee,
            "total_amount": self.total_amount,
            "payment_method": self.payment_method,
            "payment_status": self.payment_status,
            "order_status": self.order_status,
            "tracking_number": self.tracking_number,
            "notes": self.notes,
            "custom_tailoring_notes": self.custom_tailoring_notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class CustomTailoringRequest(Base):
    __tablename__ = "custom_tailoring_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(120), nullable=False)
    customer_email = Column(String(180), nullable=False)
    customer_phone = Column(String(30), nullable=False)
    
    garment_type = Column(String(100), nullable=False)  # "Bridal Lehenga", "Sherwani", "Blouse", "Anarkali", "Western Suit"
    fabric_choice = Column(String(100), default="Choose from ClassyTailors Swatches")
    measurements = Column(Text, nullable=False)  # JSON: bust, waist, hips, shoulder, length, etc.
    inspiration_image_url = Column(String(500), nullable=True)
    estimated_quote = Column(Float, default=2999.0)
    
    # Statuses: "submitted", "consultation_scheduled", "fabric_cut", "in_stitching", "trial_ready", "delivered", "completed"
    status = Column(String(50), default="submitted", index=True)
    appointment_date = Column(String(100), nullable=True)
    tailor_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "request_number": self.request_number,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "customer_phone": self.customer_phone,
            "garment_type": self.garment_type,
            "fabric_choice": self.fabric_choice,
            "measurements": json.loads(self.measurements) if self.measurements else {},
            "inspiration_image_url": self.inspiration_image_url,
            "estimated_quote": self.estimated_quote,
            "status": self.status,
            "appointment_date": self.appointment_date,
            "tailor_notes": self.tailor_notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    discount_type = Column(String(20), default="percentage")  # "percentage", "flat"
    discount_value = Column(Float, nullable=False)  # e.g., 20 for 20%, 500 for flat 500 off
    min_order_amount = Column(Float, default=0.0)
    max_discount = Column(Float, nullable=True)  # Cap on percentage discount
    active = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    valid_until = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "description": self.description,
            "discount_type": self.discount_type,
            "discount_value": self.discount_value,
            "min_order_amount": self.min_order_amount,
            "max_discount": self.max_discount,
            "active": self.active,
            "usage_count": self.usage_count,
            "valid_until": self.valid_until,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    user_name = Column(String(100), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    verified_purchase = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "user_name": self.user_name,
            "rating": self.rating,
            "comment": self.comment,
            "verified_purchase": self.verified_purchase,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(300), nullable=True)
    image_url = Column(String(500), nullable=False)
    link_url = Column(String(300), default="/products")
    tag = Column(String(100), default="NEW ARRIVAL")
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "subtitle": self.subtitle,
            "image_url": self.image_url,
            "link_url": self.link_url,
            "tag": self.tag,
            "is_active": self.is_active,
            "display_order": self.display_order,
        }

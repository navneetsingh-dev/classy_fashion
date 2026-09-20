from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# User & Auth Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    display_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int

# Product Schemas
class ProductColor(BaseModel):
    name: str
    hex: str

class ProductBase(BaseModel):
    title: str
    slug: str
    sku: str
    category_id: int
    description: str
    fabric: str = "Pure Silk"
    occasion: str = "Festive"
    pattern: str = "Embroidered"
    fit_type: str = "Tailored Fit"
    care_instructions: str = "Dry clean only"
    price: float
    compare_at_price: Optional[float] = None
    discount_percent: int = 0
    cost_price: Optional[float] = None
    rating: float = 4.8
    review_count: int = 12
    stock: int = 50
    is_featured: bool = False
    is_active: bool = True
    is_customizable: bool = True
    images: List[str] = []
    sizes: List[str] = ["XS", "S", "M", "L", "XL", "XXL", "Custom Tailored"]
    colors: List[ProductColor] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    fabric: Optional[str] = None
    occasion: Optional[str] = None
    pattern: Optional[str] = None
    fit_type: Optional[str] = None
    care_instructions: Optional[str] = None
    price: Optional[float] = None
    compare_at_price: Optional[float] = None
    discount_percent: Optional[int] = None
    cost_price: Optional[float] = None
    stock: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    is_customizable: Optional[bool] = None
    images: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[ProductColor]] = None

class ProductOut(ProductBase):
    id: int
    category_name: Optional[str] = ""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# Order Schemas
class OrderAddress(BaseModel):
    street: str
    city: str
    state: str
    pincode: str
    landmark: Optional[str] = None

class OrderItem(BaseModel):
    product_id: int
    title: str
    image: str
    size: str
    color: Optional[str] = None
    quantity: int = 1
    price: float
    custom_measurements: Optional[Dict[str, Any]] = None

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: OrderAddress
    items: List[OrderItem]
    payment_method: str = "cod"  # "cod", "upi", "card", "netbanking"
    coupon_code: Optional[str] = None
    notes: Optional[str] = None
    custom_tailoring_notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    order_status: str
    tracking_number: Optional[str] = None
    notes: Optional[str] = None

# Custom Tailoring Schemas
class CustomTailoringCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    garment_type: str
    fabric_choice: Optional[str] = "Store Swatches"
    measurements: Dict[str, Any]
    inspiration_image_url: Optional[str] = None
    appointment_date: Optional[str] = None
    tailor_notes: Optional[str] = None

class CustomTailoringUpdate(BaseModel):
    status: Optional[str] = None
    estimated_quote: Optional[float] = None
    appointment_date: Optional[str] = None
    tailor_notes: Optional[str] = None

# Coupon Schemas
class CouponCreate(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: str = "percentage"  # "percentage", "flat"
    discount_value: float
    min_order_amount: float = 0.0
    max_discount: Optional[float] = None
    active: bool = True
    valid_until: Optional[str] = None

class CouponVerify(BaseModel):
    code: str
    cart_total: float

# Review Schemas
class ReviewCreate(BaseModel):
    product_id: int
    user_name: str
    rating: int = Field(..., ge=1, le=5)
    comment: str

# Banner Schemas
class BannerCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: str = "/products"
    tag: str = "NEW"
    is_active: bool = True
    display_order: int = 0

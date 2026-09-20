import json
from sqlalchemy.orm import Session
from backend.app.models import User, Category, Product, Order, CustomTailoringRequest, Coupon, Review, Banner
from backend.app.auth import hash_password
from backend.app.config import settings

def seed_database(db: Session):
    # Check if admin already exists
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            name="Master Tailor & Admin",
            email=settings.ADMIN_EMAIL,
            phone="+91 98765 43210",
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.commit()

    # Seed sample customer
    customer = db.query(User).filter(User.email == "priya.sharma@example.com").first()
    if not customer:
        customer = User(
            name="Priya Sharma",
            email="priya.sharma@example.com",
            phone="+91 91234 56789",
            password_hash=hash_password("customer123"),
            role="customer",
            is_active=True
        )
        db.add(customer)
        db.commit()

    # Seed Categories
    if db.query(Category).count() == 0:
        categories_data = [
            {
                "name": "Bridal & Lehengas",
                "slug": "bridal-lehengas",
                "description": "Exquisite handcrafted bridal lehengas, zari work, and royal silk ensembles tailored for modern royalty.",
                "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "display_order": 1
            },
            {
                "name": "Sarees & Silks",
                "slug": "sarees-silks",
                "description": "Pure Kanjeevaram, Banarasi brocade, organza tissue and designer cocktail sarees with bespoke blouse stitching.",
                "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "display_order": 2
            },
            {
                "name": "Suits & Anarkalis",
                "slug": "suits-anarkalis",
                "description": "Flowing floor-length Anarkalis, Pakistani silhouettes, and Chikankari couture suits.",
                "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "display_order": 3
            },
            {
                "name": "Men's Royal Ethnic",
                "slug": "mens-royal-ethnic",
                "description": "Hand-embroidered velvet sherwanis, silk bandhgalas, kurta-jacket sets, and bespoke wedding menswear.",
                "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "display_order": 4
            },
            {
                "name": "Indo-Western Couture",
                "slug": "indo-western-couture",
                "description": "Fusion drape gowns, cape sets, stylish co-ords, and evening cocktail dresses.",
                "image_url": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "display_order": 5
            },
            {
                "name": "Bespoke Blouses & Tailoring",
                "slug": "bespoke-blouses",
                "description": "Designer blouse back patterns, hand maggam work, latkan detailing, and custom fitting.",
                "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "display_order": 6
            }
        ]
        for cat in categories_data:
            db.add(Category(**cat))
        db.commit()

    # Seed Products
    if db.query(Product).count() == 0:
        cat_lehenga = db.query(Category).filter(Category.slug == "bridal-lehengas").first()
        cat_saree = db.query(Category).filter(Category.slug == "sarees-silks").first()
        cat_suit = db.query(Category).filter(Category.slug == "suits-anarkalis").first()
        cat_men = db.query(Category).filter(Category.slug == "mens-royal-ethnic").first()
        cat_indowestern = db.query(Category).filter(Category.slug == "indo-western-couture").first()
        cat_blouse = db.query(Category).filter(Category.slug == "bespoke-blouses").first()

        products_data = [
            {
                "title": "Royal Crimson Zardozi Velvet Bridal Lehenga",
                "slug": "royal-crimson-zardozi-velvet-bridal-lehenga",
                "sku": "CT-LH-001",
                "category_id": cat_lehenga.id,
                "description": "Opulent bridal lehenga handcrafted in micro-velvet with intricate antique gold zardozi, dabka, and sequin hand embroidery. Features a dramatic 4.5m flare, dual dupattas (one organza head-veil and one velvet shoulder drape), and a heavily embroidered blouse tailored to your precise measurements.",
                "fabric": "Micro Velvet & Silk Organza",
                "occasion": "Bridal / Wedding",
                "pattern": "Hand Embroidered Zardozi",
                "fit_type": "Bespoke Custom Fit",
                "care_instructions": "Professional Dry Clean Only",
                "price": 14999.0,
                "compare_at_price": 28999.0,
                "discount_percent": 48,
                "cost_price": 7500.0,
                "rating": 4.9,
                "review_count": 34,
                "stock": 18,
                "is_featured": True,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["XS", "S", "M", "L", "XL", "XXL", "Custom Tailored"]),
                "colors": json.dumps([
                    {"name": "Royal Crimson", "hex": "#8B0000"},
                    {"name": "Emerald Green", "hex": "#097969"},
                    {"name": "Deep Plum", "hex": "#4B0082"}
                ])
            },
            {
                "title": "Pure Banarasi Katan Silk Gold Zari Saree",
                "slug": "pure-banarasi-katan-silk-gold-zari-saree",
                "sku": "CT-SR-002",
                "category_id": cat_saree.id,
                "description": "Authentic handloom Banarasi Katan silk saree woven with real gold zari floral kadwa jaal motifs. Accompanied by an unstitched silk blouse piece with matching borders or option for pre-stitched designer padded blouse.",
                "fabric": "100% Pure Katan Silk",
                "occasion": "Festive / Wedding Reception",
                "pattern": "Woven Kadwa Jaal",
                "fit_type": "Free Size with Tailored Blouse",
                "care_instructions": "Dry clean only, wrap in muslin cloth",
                "price": 4499.0,
                "compare_at_price": 9999.0,
                "discount_percent": 55,
                "cost_price": 2200.0,
                "rating": 4.8,
                "review_count": 48,
                "stock": 35,
                "is_featured": True,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["Free Size + Custom Blouse"]),
                "colors": json.dumps([
                    {"name": "Rani Pink", "hex": "#E75480"},
                    {"name": "Turquoise Teal", "hex": "#008080"},
                    {"name": "Mustard Gold", "hex": "#E1AD01"}
                ])
            },
            {
                "title": "Ivory Chikankari Mukaish Silk Anarkali Suit Set",
                "slug": "ivory-chikankari-mukaish-silk-anarkali-suit-set",
                "sku": "CT-ST-003",
                "category_id": cat_suit.id,
                "description": "Ethereal Lucknowi Chikankari Anarkali set handcrafted on pure georgette silk with silver Mukaish badla work. Comes with a matching flared churidar and a featherlight scallop-bordered organza dupatta.",
                "fabric": "Pure Georgette & Silk",
                "occasion": "Mehendi / Sangeet / Festive",
                "pattern": "Handcrafted Chikankari & Mukaish",
                "fit_type": "Regal Flared Fit",
                "care_instructions": "Gentle dry clean",
                "price": 3299.0,
                "compare_at_price": 6999.0,
                "discount_percent": 52,
                "cost_price": 1600.0,
                "rating": 4.7,
                "review_count": 29,
                "stock": 25,
                "is_featured": True,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["S", "M", "L", "XL", "XXL", "Custom Tailored"]),
                "colors": json.dumps([
                    {"name": "Ivory Pearl", "hex": "#FFFFF0"},
                    {"name": "Peach Blush", "hex": "#FFDAB9"},
                    {"name": "Pistachio Mint", "hex": "#93C572"}
                ])
            },
            {
                "title": "Embroidered Raw Silk Groom Sherwani Ensemble",
                "slug": "embroidered-raw-silk-groom-sherwani-ensemble",
                "sku": "CT-MN-004",
                "category_id": cat_men.id,
                "description": "A majestic groom's sherwani in raw matka silk featuring understated tone-on-tone Kashmiri thread embroidery, antique metal crest buttons, matching churidar, coordinating stole (stole dupatta), and safa turban option.",
                "fabric": "Raw Matka Silk",
                "occasion": "Groom Wedding / Royal Occasion",
                "pattern": "Tone-on-Tone Threadwork",
                "fit_type": "Structured Bespoke Tailored",
                "care_instructions": "Specialist Dry Clean Only",
                "price": 9999.0,
                "compare_at_price": 19999.0,
                "discount_percent": 50,
                "cost_price": 4800.0,
                "rating": 4.9,
                "review_count": 21,
                "stock": 14,
                "is_featured": True,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["38 (S)", "40 (M)", "42 (L)", "44 (XL)", "Custom Made-to-Measure"]),
                "colors": json.dumps([
                    {"name": "Champagne Cream", "hex": "#F7E7CE"},
                    {"name": "Midnight Navy", "hex": "#001F3F"},
                    {"name": "Regal Emerald", "hex": "#046307"}
                ])
            },
            {
                "title": "Sleeveless Shimmer Corset Drape Saree Gown",
                "slug": "sleeveless-shimmer-corset-drape-saree-gown",
                "sku": "CT-IW-005",
                "category_id": cat_indowestern.id,
                "description": "Pre-draped ready-to-wear cocktail gown inspired by modern red-carpet drape couture. Features a structured boned corset bodice with metallic crystals and fluid pleated Italian crepe drape skirt.",
                "fabric": "Italian Crepe & Metallic Shimmer Lycra",
                "occasion": "Cocktail Party / Reception",
                "pattern": "Pre-Stitched Drape with Crystal Bodice",
                "fit_type": "Sculpted Hourglass Fit",
                "care_instructions": "Dry clean only",
                "price": 4999.0,
                "compare_at_price": 11499.0,
                "discount_percent": 56,
                "cost_price": 2400.0,
                "rating": 4.8,
                "review_count": 19,
                "stock": 20,
                "is_featured": True,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["XS", "S", "M", "L", "XL", "Custom Fit"]),
                "colors": json.dumps([
                    {"name": "Rose Gold", "hex": "#B76E79"},
                    {"name": "Champagne", "hex": "#F7E7CE"},
                    {"name": "Obsidian Black", "hex": "#1B1B1B"}
                ])
            },
            {
                "title": "Handcrafted Cutwork Maggam Designer Blouse",
                "slug": "handcrafted-cutwork-maggam-designer-blouse",
                "sku": "CT-BL-006",
                "category_id": cat_blouse.id,
                "description": "Bespoke bridal blouse with exquisite cutwork hand embroidery, Kundan stones, zardozi peacock motifs on the sleeves, and deep sweet-heart back neckline with handcrafted latkans. Padded and lined with pure cotton.",
                "fabric": "Pure Raw Silk & Cotton Lining",
                "occasion": "Bridal / Festival",
                "pattern": "Cutwork Zardozi & Kundan",
                "fit_type": "Custom Tailored Fitting",
                "care_instructions": "Dry clean only",
                "price": 1899.0,
                "compare_at_price": 3999.0,
                "discount_percent": 52,
                "cost_price": 900.0,
                "rating": 4.9,
                "review_count": 42,
                "stock": 40,
                "is_featured": False,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["32", "34", "36", "38", "40", "42", "Custom Made-to-Measure"]),
                "colors": json.dumps([
                    {"name": "Maroon Red", "hex": "#800000"},
                    {"name": "Antique Gold", "hex": "#CFB53B"},
                    {"name": "Peacock Green", "hex": "#005F56"}
                ])
            },
            {
                "title": "Organza Floral Printed Pastel Saree with Pearl Scallops",
                "slug": "organza-floral-printed-pastel-saree-with-pearl-scallops",
                "sku": "CT-SR-007",
                "category_id": cat_saree.id,
                "description": "Breezy luxury sheer organza saree decorated with delicate vintage watercolor floral prints and meticulously hand-embroidered pearl scallop borders. Includes stitched banglori silk blouse.",
                "fabric": "Pure Silk Organza",
                "occasion": "Day Wedding / High Tea / Festive",
                "pattern": "Digital Floral & Pearl Border",
                "fit_type": "Free Size + Tailored Blouse",
                "care_instructions": "Dry clean only",
                "price": 2499.0,
                "compare_at_price": 5499.0,
                "discount_percent": 54,
                "cost_price": 1100.0,
                "rating": 4.8,
                "review_count": 27,
                "stock": 30,
                "is_featured": True,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["Free Size"]),
                "colors": json.dumps([
                    {"name": "Powder Blue", "hex": "#B0E0E6"},
                    {"name": "Blush Pink", "hex": "#FFB6C1"},
                    {"name": "Lavender Mist", "hex": "#E6E6FA"}
                ])
            },
            {
                "title": "Bandhgala Royal Jodhpuri Suit in Italian Wool Blend",
                "slug": "bandhgala-royal-jodhpuri-suit-italian-wool-blend",
                "sku": "CT-MN-008",
                "category_id": cat_men.id,
                "description": "Exquisite bespoke tailored Jodhpuri bandhgala crafted with premium Italian wool-viscose blend. Styled with hand-carved brass buttons, pocket square, and slim-tailored matching trousers.",
                "fabric": "Italian Wool-Viscose Blend",
                "occasion": "Black Tie / Reception / Royal Gala",
                "pattern": "Solid Textured Weave",
                "fit_type": "Slim Bespoke Fit",
                "care_instructions": "Dry clean only",
                "price": 6999.0,
                "compare_at_price": 14999.0,
                "discount_percent": 53,
                "cost_price": 3200.0,
                "rating": 4.9,
                "review_count": 15,
                "stock": 16,
                "is_featured": True,
                "is_active": True,
                "is_customizable": True,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                ]),
                "sizes": json.dumps(["38 (S)", "40 (M)", "42 (L)", "44 (XL)", "Custom Tailored"]),
                "colors": json.dumps([
                    {"name": "Royal Jet Black", "hex": "#111111"},
                    {"name": "Deep Cobalt", "hex": "#0047AB"},
                    {"name": "Burgundy Wine", "hex": "#722F37"}
                ])
            }
        ]

        for p in products_data:
            db.add(Product(**p))
        db.commit()

    # Seed Coupons
    if db.query(Coupon).count() == 0:
        coupons = [
            Coupon(
                code="CLASSY20",
                description="20% OFF on your luxury fashion order",
                discount_type="percentage",
                discount_value=20.0,
                min_order_amount=1999.0,
                max_discount=2000.0,
                active=True,
                usage_count=45,
                valid_until="2027-12-31"
            ),
            Coupon(
                code="FIRSTORDER",
                description="Flat ₹500 OFF on your first boutique purchase",
                discount_type="flat",
                discount_value=500.0,
                min_order_amount=1500.0,
                max_discount=500.0,
                active=True,
                usage_count=120,
                valid_until="2027-12-31"
            ),
            Coupon(
                code="ROYAL50",
                description="Special VIP savings - Flat ₹1000 OFF on bridal orders",
                discount_type="flat",
                discount_value=1000.0,
                min_order_amount=5000.0,
                max_discount=1000.0,
                active=True,
                usage_count=31,
                valid_until="2027-12-31"
            )
        ]
        for c in coupons:
            db.add(c)
        db.commit()

    # Seed Banners
    if db.query(Banner).count() == 0:
        banners = [
            Banner(
                title="Bespoke Luxury Meets Meesho Affordability",
                subtitle="Couture lehengas, silk sarees, and royal sherwanis tailored exactly to your body measurements.",
                image_url="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85",
                link_url="/products",
                tag="WEDDING FESTIVAL 2026",
                is_active=True,
                display_order=1
            ),
            Banner(
                title="The Heritage Handloom Silk Exhibition",
                subtitle="Pure Banarasi, Kanjeevaram & Chanderi weaves direct from master artisan weavers.",
                image_url="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=85",
                link_url="/products?category=sarees-silks",
                tag="UP TO 55% OFF",
                is_active=True,
                display_order=2
            )
        ]
        for b in banners:
            db.add(b)
        db.commit()

    # Seed sample orders for admin dashboard analytics
    if db.query(Order).count() == 0:
        sample_orders = [
            Order(
                order_number="CT-2026-1001",
                user_id=customer.id if customer else None,
                customer_name="Priya Sharma",
                customer_email="priya.sharma@example.com",
                customer_phone="+91 91234 56789",
                shipping_address=json.dumps({
                    "street": "Flat 402, Royal Palms Residency, MG Road",
                    "city": "Bengaluru",
                    "state": "Karnataka",
                    "pincode": "560001",
                    "landmark": "Near Trinity Metro Station"
                }),
                items=json.dumps([{
                    "product_id": 1,
                    "title": "Royal Crimson Zardozi Velvet Bridal Lehenga",
                    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                    "size": "Custom Tailored",
                    "color": "Royal Crimson",
                    "quantity": 1,
                    "price": 14999.0,
                    "custom_measurements": {"bust": "36", "waist": "30", "hip": "39", "height": "5ft 6in"}
                }]),
                subtotal=14999.0,
                discount_amount=2000.0,
                coupon_code="CLASSY20",
                delivery_fee=0.0,
                total_amount=12999.0,
                payment_method="upi",
                payment_status="paid",
                order_status="tailoring",
                tracking_number="BLR-EXP-9082",
                notes="Priority wedding delivery requested by bride for 25th.",
                custom_tailoring_notes="Extra latkan tassels requested on blouse dori."
            ),
            Order(
                order_number="CT-2026-1002",
                customer_name="Rohan Verma",
                customer_email="rohan.verma@example.com",
                customer_phone="+91 98888 12345",
                shipping_address=json.dumps({
                    "street": "House 12, Defence Colony",
                    "city": "New Delhi",
                    "state": "Delhi",
                    "pincode": "110024",
                    "landmark": "Near Flyover Market"
                }),
                items=json.dumps([{
                    "product_id": 4,
                    "title": "Embroidered Raw Silk Groom Sherwani Ensemble",
                    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
                    "size": "40 (M)",
                    "color": "Champagne Cream",
                    "quantity": 1,
                    "price": 9999.0
                }]),
                subtotal=9999.0,
                discount_amount=1000.0,
                coupon_code="ROYAL50",
                delivery_fee=0.0,
                total_amount=8999.0,
                payment_method="card",
                payment_status="paid",
                order_status="shipped",
                tracking_number="DEL-AIR-4411",
                notes="Shipped via BlueDart Express Air.",
                custom_tailoring_notes=None
            ),
            Order(
                order_number="CT-2026-1003",
                customer_name="Ananya Sengupta",
                customer_email="ananya.s@example.com",
                customer_phone="+91 97777 65432",
                shipping_address=json.dumps({
                    "street": "Plot 88, Salt Lake Sector 1",
                    "city": "Kolkata",
                    "state": "West Bengal",
                    "pincode": "700064",
                    "landmark": "Near City Centre"
                }),
                items=json.dumps([{
                    "product_id": 2,
                    "title": "Pure Banarasi Katan Silk Gold Zari Saree",
                    "image": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
                    "size": "Free Size + Custom Blouse",
                    "color": "Rani Pink",
                    "quantity": 1,
                    "price": 4499.0,
                    "custom_measurements": {"bust": "34", "waist": "28", "blouse_length": "14"}
                }]),
                subtotal=4499.0,
                discount_amount=500.0,
                coupon_code="FIRSTORDER",
                delivery_fee=0.0,
                total_amount=3999.0,
                payment_method="cod",
                payment_status="pending",
                order_status="placed",
                tracking_number=None,
                notes="COD order confirmed via phone verification.",
                custom_tailoring_notes="Sweetheart neck cut on blouse."
            )
        ]
        for ord in sample_orders:
            db.add(ord)
        db.commit()

    # Seed Sample Custom Tailoring Request
    if db.query(CustomTailoringRequest).count() == 0:
        custom_req = CustomTailoringRequest(
            request_number="REQ-TAILOR-501",
            customer_name="Sneha Kapoor",
            customer_email="sneha.kapoor@example.com",
            customer_phone="+91 99999 88888",
            garment_type="Custom Bridal Reception Gown",
            fabric_choice="Pure Italian Silk Organza & Zardozi Lace",
            measurements=json.dumps({
                "bust": "36 inches",
                "waist": "29 inches",
                "hips": "38 inches",
                "shoulder_width": "15 inches",
                "garment_length": "58 inches",
                "sleeve_length": "22 inches",
                "special_instructions": "Deep V-neck with illusion mesh, fishtail flare silhouette, custom emerald jewel belt."
            }),
            inspiration_image_url="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
            estimated_quote=18500.0,
            status="consultation_scheduled",
            appointment_date="2026-09-20 at 3:00 PM IST (Virtual Video Consultation)",
            tailor_notes="Designer assigned: Master Tailor Rajesh. Fabric swatches prepared and mailed to client."
        )
        db.add(custom_req)
        db.commit()

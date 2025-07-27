#!/usr/bin/env python3
"""
Initialize database with admin user and sample data
"""

from app import create_app
from models import db, User, Vendor, Product, ProductImage, UserRole, VendorStatus
from datetime import datetime

def init_database():
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created!")
        
        # Create admin user
        admin_user = User.query.filter_by(email='ezemaraphael94@gmail.com').first()
        if not admin_user:
            admin_user = User(
                username='raphael',
                email='ezemaraphael94@gmail.com',
                role=UserRole.ADMIN,
                is_verified=True
            )
            admin_user.set_password('AdminPass123')
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Created admin user: ezemaraphael94@gmail.com / AdminPass123")
        else:
            print("✅ Admin user already exists")
            
        # Create vendor user
        vendor_user = User.query.filter_by(email='vendor@shopnaija.com').first()
        if not vendor_user:
            vendor_user = User(
                username='vendor',
                email='vendor@shopnaija.com',
                role=UserRole.VENDOR,
                is_verified=True
            )
            vendor_user.set_password('vendor123')
            db.session.add(vendor_user)
            db.session.commit()
            print("✅ Created vendor user: vendor@shopnaija.com / vendor123")
        else:
            print("✅ Vendor user already exists")
            
        # Create vendor profile
        vendor_profile = Vendor.query.filter_by(user_id=vendor_user.id).first()
        if not vendor_profile:
            vendor_profile = Vendor(
                user_id=vendor_user.id,
                business_name='Sample Electronics Store',
                business_address='123 Lagos Street, Victoria Island, Lagos',
                business_phone='+234 801 234 5678',
                business_email='vendor@shopnaija.com',
                business_registration='RC12345678',
                bank_name='Access Bank',
                account_number='1234567890',
                account_name='Sample Electronics Store',
                status=VendorStatus.APPROVED,
                commission_rate=8.0,
                approved_at=datetime.utcnow()
            )
            db.session.add(vendor_profile)
            db.session.commit()
            print("✅ Created vendor profile: Sample Electronics Store")
        else:
            print("✅ Vendor profile already exists")
            
        # Create sample products
        sample_products = [
            {
                'name': 'iPhone 14 Pro Max',
                'description': 'Latest Apple iPhone with advanced camera system and A16 Bionic chip',
                'price': 850000.00,
                'category': 'Electronics',
                'subcategory': 'Smartphones',
                'brand': 'Apple',
                'stock': 25,
                'image_url': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
            },
            {
                'name': 'Samsung Galaxy S23 Ultra',
                'description': 'Premium Android smartphone with S Pen and 200MP camera',
                'price': 720000.00,
                'category': 'Electronics',
                'subcategory': 'Smartphones',
                'brand': 'Samsung',
                'stock': 30,
                'image_url': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'
            },
            {
                'name': 'MacBook Air M2',
                'description': 'Ultra-lightweight laptop with M2 chip, perfect for professionals',
                'price': 1200000.00,
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'brand': 'Apple',
                'stock': 15,
                'image_url': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
            },
            {
                'name': 'Nike Air Force 1',
                'description': 'Classic white leather sneakers, timeless style and comfort',
                'price': 45000.00,
                'category': 'Fashion',
                'subcategory': 'Shoes',
                'brand': 'Nike',
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
            },
            {
                'name': 'Sony WH-1000XM4 Headphones',
                'description': 'Industry-leading noise cancelling wireless headphones',
                'price': 125000.00,
                'category': 'Electronics',
                'subcategory': 'Audio',
                'brand': 'Sony',
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
            },
            {
                'name': 'Dell XPS 13',
                'description': 'Premium ultrabook with Intel Core i7 and stunning display',
                'price': 980000.00,
                'category': 'Electronics',
                'subcategory': 'Laptops',
                'brand': 'Dell',
                'stock': 20,
                'image_url': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
            },
            {
                'name': 'Adidas Ultraboost 22',
                'description': 'Premium running shoes with Boost technology',
                'price': 85000.00,
                'category': 'Fashion',
                'subcategory': 'Shoes',
                'brand': 'Adidas',
                'stock': 75,
                'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
            },
            {
                'name': 'Canon EOS R5',
                'description': 'Professional mirrorless camera with 8K video recording',
                'price': 2500000.00,
                'category': 'Electronics',
                'subcategory': 'Cameras',
                'brand': 'Canon',
                'stock': 10,
                'image_url': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'
            }
        ]
        
        for product_data in sample_products:
            existing_product = Product.query.filter_by(
                name=product_data['name'], 
                vendor_id=vendor_profile.id
            ).first()
            
            if not existing_product:
                product = Product(
                    vendor_id=vendor_profile.id,
                    name=product_data['name'],
                    description=product_data['description'],
                    price=product_data['price'],
                    category=product_data['category'],
                    subcategory=product_data.get('subcategory'),
                    brand=product_data.get('brand'),
                    stock=product_data['stock'],
                    is_active=True,
                    min_stock=5,
                    rating=4.5,
                    review_count=15
                )
                db.session.add(product)
                db.session.flush()  # Get the product ID
                
                # Add product image
                if product_data.get('image_url'):
                    image = ProductImage(
                        product_id=product.id,
                        image_url=product_data['image_url'],
                        is_primary=True,
                        alt_text=product_data['name']
                    )
                    db.session.add(image)
                
                print(f"✅ Created product: {product_data['name']}")
        
        # Create customer user
        customer_user = User.query.filter_by(email='customer@shopnaija.com').first()
        if not customer_user:
            customer_user = User(
                username='customer',
                email='customer@shopnaija.com',
                role=UserRole.CUSTOMER,
                is_verified=True
            )
            customer_user.set_password('customer123')
            db.session.add(customer_user)
            db.session.commit()
            print("✅ Created customer user: customer@shopnaija.com / customer123")
        else:
            print("✅ Customer user already exists")
            
        db.session.commit()
        
        print("\n🎉 Database initialization complete!")
        print("\nTest Credentials:")
        print("Admin: ezemaraphael94@gmail.com / AdminPass123")
        print("Vendor: vendor@shopnaija.com / vendor123") 
        print("Customer: customer@shopnaija.com / customer123")
        print("\n🌐 Backend: http://127.0.0.1:5000")
        print("🛒 Frontend: http://localhost:5173")
        print("⚙️  Admin Setup: http://localhost:5173/admin-setup")

if __name__ == '__main__':
    init_database()

import sqlite3
import json
from datetime import datetime

# Sample product data with better Nigerian context
products_data = [
    {
        'name': 'Samsung Galaxy A54 5G',
        'description': 'Latest Samsung smartphone with 5G connectivity, 128GB storage, and excellent camera quality',
        'price': 320000,
        'category': 'electronics',
        'image_url': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        'stock': 25
    },
    {
        'name': 'iPhone 14 Pro Max',
        'description': 'Apple iPhone 14 Pro Max with A16 Bionic chip, 256GB storage, and Pro camera system',
        'price': 850000,
        'category': 'electronics',
        'image_url': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        'stock': 15
    },
    {
        'name': 'Dell XPS 13 Laptop',
        'description': 'Ultrabook laptop with Intel i7 processor, 16GB RAM, 512GB SSD, perfect for professionals',
        'price': 680000,
        'category': 'electronics',
        'image_url': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        'stock': 12
    },
    {
        'name': 'Adidas Ultraboost 22',
        'description': 'Premium running shoes with boost technology for maximum comfort and performance',
        'price': 45000,
        'category': 'fashion',
        'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        'stock': 40
    },
    {
        'name': 'Nike Air Force 1',
        'description': 'Classic white Nike Air Force 1 sneakers, timeless style and comfort',
        'price': 38000,
        'category': 'fashion',
        'image_url': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        'stock': 35
    },
    {
        'name': 'Versace Designer Dress',
        'description': 'Elegant evening dress perfect for special occasions and formal events',
        'price': 125000,
        'category': 'fashion',
        'image_url': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
        'stock': 8
    },
    {
        'name': 'Golden Morn Cereal 1kg',
        'description': 'Nutritious breakfast cereal fortified with vitamins and minerals',
        'price': 1200,
        'category': 'groceries',
        'image_url': 'https://images.unsplash.com/photo-1574681547956-07fcab0eb19b?w=400',
        'stock': 100
    },
    {
        'name': 'Indomie Instant Noodles (40 pack)',
        'description': 'Pack of 40 Indomie instant noodles, perfect for quick meals',
        'price': 8500,
        'category': 'groceries',
        'image_url': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        'stock': 75
    },
    {
        'name': 'Peak Milk Powder 900g',
        'description': 'Premium quality powdered milk for the whole family',
        'price': 3200,
        'category': 'groceries',
        'image_url': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
        'stock': 60
    },
    {
        'name': 'Modern Dining Table Set',
        'description': '6-seater wooden dining table with matching chairs, perfect for family meals',
        'price': 185000,
        'category': 'home',
        'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'stock': 5
    },
    {
        'name': 'Luxury Sofa Set',
        'description': '7-seater leather sofa set with ottoman, comfortable and stylish',
        'price': 320000,
        'category': 'home',
        'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        'stock': 3
    },
    {
        'name': 'Smart LED TV 55"',
        'description': '55-inch 4K Smart LED TV with Netflix, YouTube, and other streaming apps',
        'price': 245000,
        'category': 'electronics',
        'image_url': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        'stock': 18
    },
    {
        'name': 'MAC Lipstick Collection',
        'description': 'Set of 5 premium MAC lipsticks in different shades',
        'price': 25000,
        'category': 'beauty',
        'image_url': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
        'stock': 30
    },
    {
        'name': 'Skincare Routine Set',
        'description': 'Complete skincare set with cleanser, toner, serum, and moisturizer',
        'price': 15000,
        'category': 'beauty',
        'image_url': 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400',
        'stock': 25
    },
    {
        'name': 'Perfume Gift Set',
        'description': 'Luxury perfume collection with 3 different fragrances',
        'price': 35000,
        'category': 'beauty',
        'image_url': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        'stock': 20
    },
    {
        'name': 'Gaming Mechanical Keyboard',
        'description': 'RGB mechanical keyboard perfect for gaming and professional use',
        'price': 28000,
        'category': 'electronics',
        'image_url': 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
        'stock': 22
    },
    {
        'name': 'Wireless Gaming Mouse',
        'description': 'High-precision wireless gaming mouse with customizable RGB lighting',
        'price': 15000,
        'category': 'electronics',
        'image_url': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        'stock': 30
    },
    {
        'name': 'Office Ergonomic Chair',
        'description': 'Comfortable ergonomic office chair with lumbar support and adjustable height',
        'price': 85000,
        'category': 'home',
        'image_url': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
        'stock': 15
    },
    {
        'name': 'Wireless Bluetooth Headphones',
        'description': 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        'price': 45000,
        'category': 'electronics',
        'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        'stock': 40
    },
    {
        'name': 'Designer Handbag',
        'description': 'Luxury leather handbag perfect for both casual and formal occasions',
        'price': 75000,
        'category': 'fashion',
        'image_url': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        'stock': 12
    }
]

def seed_database():
    # Connect to the database
    conn = sqlite3.connect('instance/ecommerce.db')
    cursor = conn.cursor()
    
    # Clear existing products
    cursor.execute('DELETE FROM product')
    
    # Insert sample products
    for product in products_data:
        cursor.execute('''
            INSERT INTO product (name, description, price, category, image_url, stock)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            product['name'],
            product['description'],
            product['price'],
            product['category'],
            product['image_url'],
            product['stock']
        ))
    
    # Create a sample user
    cursor.execute('''
        INSERT OR REPLACE INTO user (id, username, email, password, created_at)
        VALUES (1, 'admin', 'admin@shopnaija.com', ?, ?)
    ''', ('$2b$12$LQv3c1yqBw2hNaFHlXbNY.5LUmT1EKVEZ5V8VEhXrWj3JmL.7/j0u', datetime.utcnow()))  # password: admin123
    
    conn.commit()
    conn.close()
    print(f"Database seeded with {len(products_data)} products!")

if __name__ == '__main__':
    seed_database()

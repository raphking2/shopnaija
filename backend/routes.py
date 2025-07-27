from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Product, Cart, Vendor, Order, OrderItem, ProductReview, UserRole, VendorStatus, OrderStatus
from datetime import datetime, timedelta
import secrets
import re

# Utility function to handle JWT identity
def get_current_user_id():
    """Get current user ID from JWT, handling both string and int formats"""
    user_id = get_jwt_identity()
    if isinstance(user_id, str):
        return int(user_id)
    return user_id

# Create blueprints
api = Blueprint('api', __name__)
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')
vendor_bp = Blueprint('vendor', __name__, url_prefix='/vendor')

# Security middleware
def admin_required(f):
    """Decorator to require admin access"""
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != UserRole.ADMIN:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def vendor_required(f):
    """Decorator to require vendor access"""
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or (user.role != UserRole.VENDOR and user.role != UserRole.ADMIN):
            return jsonify({'error': 'Vendor access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Authentication Routes
@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            verification_token=secrets.token_urlsafe(32)
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=7))
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role.value
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=7))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role.value,
                'is_vendor': user.vendor_profile is not None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/admin/register', methods=['POST'])
@jwt_required()
@admin_required
def register_admin():
    """Allow existing admin to create new admin accounts"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new admin user
        admin_user = User(
            username=data['username'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            role=UserRole.ADMIN,
            is_verified=True,
            verification_token=secrets.token_urlsafe(32)
        )
        admin_user.set_password(data['password'])
        
        db.session.add(admin_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Admin user created successfully',
            'admin': {
                'id': admin_user.id,
                'username': admin_user.username,
                'email': admin_user.email,
                'role': admin_user.role.value
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/admin/create-first', methods=['POST'])
def create_first_admin():
    """Create the first admin when no admin exists"""
    try:
        # Check if any admin already exists
        existing_admin = User.query.filter_by(role=UserRole.ADMIN).first()
        if existing_admin:
            return jsonify({'error': 'Admin already exists. Use admin registration instead.'}), 400
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
            
        # Validate password strength
        if len(data['password']) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new admin user
        admin_user = User(
            username=data['username'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            role=UserRole.ADMIN,
            is_verified=True,
            verification_token=secrets.token_urlsafe(32)
        )
        admin_user.set_password(data['password'])
        
        db.session.add(admin_user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=admin_user.id, expires_delta=timedelta(days=7))
        
        return jsonify({
            'message': 'First admin created successfully',
            'access_token': access_token,
            'user': {
                'id': admin_user.id,
                'username': admin_user.username,
                'email': admin_user.email,
                'role': admin_user.role.value,
                'is_vendor': False
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/admin/check', methods=['GET'])
def check_admin_exists():
    """Check if any admin exists in the system"""
    try:
        admin_exists = User.query.filter_by(role=UserRole.ADMIN).first() is not None
        return jsonify({'adminExists': admin_exists}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vendor Registration
@api.route('/vendor/register', methods=['POST'])
@jwt_required()
def register_vendor():
    try:
        current_user_id = get_current_user_id()
        user = User.query.get(current_user_id)
        
        if user.vendor_profile:
            return jsonify({'error': 'User already has a vendor profile'}), 400
        
        data = request.get_json()
        required_fields = ['business_name', 'business_address', 'business_phone', 'business_email']
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        vendor = Vendor(
            user_id=user.id,
            business_name=data['business_name'],
            business_address=f"{data['business_address']}, {data.get('business_city', '')}, {data.get('business_state', '')}".strip(', '),
            business_phone=data['business_phone'],
            business_email=data['business_email'],
            business_registration=data.get('business_registration'),
            bank_name=data.get('bank_name'),
            account_number=data.get('account_number'),
            account_name=data.get('account_name')
        )
        
        # Update user role
        user.role = UserRole.VENDOR
        
        db.session.add(vendor)
        db.session.commit()
        
        return jsonify({
            'message': 'Vendor registration submitted for approval',
            'vendor': {
                'id': vendor.id,
                'business_name': vendor.business_name,
                'status': vendor.status.value
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Product Routes
@api.route('/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category')
        vendor_id = request.args.get('vendor_id')
        search = request.args.get('search')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        query = Product.query.filter(Product.is_active == True)
        
        # Apply filters
        if category:
            query = query.filter(Product.category == category)
        if vendor_id:
            query = query.filter(Product.vendor_id == vendor_id)
        if search:
            query = query.filter(Product.name.contains(search) | Product.description.contains(search))
        if min_price:
            query = query.filter(Product.price >= min_price)
        if max_price:
            query = query.filter(Product.price <= max_price)
        
        # Order by creation date
        query = query.order_by(Product.created_at.desc())
        
        products = query.paginate(page=page, per_page=per_page, error_out=False)
        
        result = []
        for product in products.items:
            # Get primary image
            primary_image = next((img.image_url for img in product.images if img.is_primary), None)
            if not primary_image and product.images:
                primary_image = product.images[0].image_url
            
            result.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'category': product.category,
                'subcategory': product.subcategory,
                'brand': product.brand,
                'stock': product.stock,
                'rating': product.rating,
                'review_count': product.review_count,
                'image_url': primary_image or f'https://picsum.photos/400/300?random={product.id}',
                'vendor': {
                    'id': product.vendor.id,
                    'business_name': product.vendor.business_name,
                    'status': product.vendor.status.value
                } if product.vendor else None,
                'is_low_stock': product.stock <= product.min_stock,
                'out_of_stock': product.stock == 0
            })
        
        return jsonify({
            'products': result,
            'pagination': {
                'page': products.page,
                'pages': products.pages,
                'per_page': products.per_page,
                'total': products.total,
                'has_next': products.has_next,
                'has_prev': products.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        if not product.is_active:
            return jsonify({'error': 'Product not available'}), 404
        
        # Get all images
        images = [{'url': img.image_url, 'is_primary': img.is_primary, 'alt_text': img.alt_text} 
                 for img in product.images]
        
        # Get reviews
        reviews = []
        for review in product.reviews[:10]:  # Limit to 10 recent reviews
            reviews.append({
                'id': review.id,
                'rating': review.rating,
                'comment': review.comment,
                'user': review.user.username,
                'created_at': review.created_at.isoformat(),
                'is_verified_purchase': review.is_verified_purchase
            })
        
        return jsonify({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'category': product.category,
            'subcategory': product.subcategory,
            'brand': product.brand,
            'weight': product.weight,
            'dimensions': product.dimensions,
            'stock': product.stock,
            'rating': product.rating,
            'review_count': product.review_count,
            'images': images,
            'reviews': reviews,
            'vendor': {
                'id': product.vendor.id,
                'business_name': product.vendor.business_name,
                'total_sales': product.vendor.total_sales,
                'created_at': product.vendor.created_at.isoformat()
            },
            'is_low_stock': product.stock <= product.min_stock,
            'out_of_stock': product.stock == 0,
            'created_at': product.created_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Cart Routes
@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        current_user_id = get_jwt_identity()
        cart_items = Cart.query.filter_by(user_id=current_user_id).all()
        
        result = []
        total = 0
        
        for item in cart_items:
            product = item.product
            item_total = product.price * item.quantity
            total += item_total
            
            # Get primary image
            primary_image = next((img.image_url for img in product.images if img.is_primary), None)
            if not primary_image and product.images:
                primary_image = product.images[0].image_url
            
            result.append({
                'id': item.id,
                'quantity': item.quantity,
                'added_at': item.added_at.isoformat(),
                'item_total': item_total,
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'price': product.price,
                    'stock': product.stock,
                    'image_url': primary_image or f'https://picsum.photos/400/300?random={product.id}',
                    'vendor': product.vendor.business_name
                }
            })
        
        return jsonify({
            'cart_items': result,
            'total': total,
            'item_count': len(result)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return jsonify({'error': 'Product ID required'}), 400
        
        product = Product.query.get(product_id)
        if not product or not product.is_active:
            return jsonify({'error': 'Product not found'}), 404
        
        if product.stock < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        # Check if item already in cart
        existing_item = Cart.query.filter_by(user_id=current_user_id, product_id=product_id).first()
        
        if existing_item:
            new_quantity = existing_item.quantity + quantity
            if product.stock < new_quantity:
                return jsonify({'error': 'Insufficient stock'}), 400
            existing_item.quantity = new_quantity
        else:
            cart_item = Cart(user_id=current_user_id, product_id=product_id, quantity=quantity)
            db.session.add(cart_item)
        
        db.session.commit()
        
        return jsonify({'message': 'Item added to cart'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Order Routes
@api.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate delivery info
        required_fields = ['delivery_address', 'delivery_phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get cart items
        cart_items = Cart.query.filter_by(user_id=current_user_id).all()
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Calculate totals
        subtotal = 0
        commission_total = 0
        
        for item in cart_items:
            if item.product.stock < item.quantity:
                return jsonify({'error': f'Insufficient stock for {item.product.name}'}), 400
            
            item_total = item.product.price * item.quantity
            commission = item_total * (item.product.vendor.commission_rate / 100)
            
            subtotal += item_total
            commission_total += commission
        
        delivery_fee = data.get('delivery_fee', 0)
        total_amount = subtotal + delivery_fee
        
        # Generate order number
        order_number = f"SN{datetime.now().strftime('%Y%m%d')}{secrets.randbelow(10000):04d}"
        
        # Create order
        order = Order(
            user_id=current_user_id,
            order_number=order_number,
            total_amount=total_amount,
            commission_amount=commission_total,
            delivery_fee=delivery_fee,
            delivery_address=data['delivery_address'],
            delivery_phone=data['delivery_phone'],
            notes=data.get('notes')
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Create order items and update stock
        for item in cart_items:
            vendor_amount = (item.product.price * item.quantity) * (1 - item.product.vendor.commission_rate / 100)
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                vendor_id=item.product.vendor_id,
                quantity=item.quantity,
                price=item.product.price,
                commission_rate=item.product.vendor.commission_rate,
                vendor_amount=vendor_amount
            )
            
            # Update product stock
            item.product.stock -= item.quantity
            
            # Update vendor balance
            item.product.vendor.current_balance += vendor_amount
            item.product.vendor.total_sales += (item.product.price * item.quantity)
            
            db.session.add(order_item)
        
        # Clear cart
        Cart.query.filter_by(user_id=current_user_id).delete()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': {
                'id': order.id,
                'order_number': order.order_number,
                'total_amount': order.total_amount,
                'status': order.status.value
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Register blueprints
def register_routes(app):
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(vendor_bp, url_prefix='/api/vendor')

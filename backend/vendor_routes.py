# Vendor Routes for Multi-vendor Management
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Vendor, Product, ProductImage, Order, OrderItem, UserRole, VendorStatus, OrderStatus
from datetime import datetime, timedelta
from sqlalchemy import func, desc

vendor_bp = Blueprint('vendor', __name__)

# Utility function to handle JWT identity
def get_current_user_id():
    """Get current user ID from JWT, handling both string and int formats"""
    user_id = get_jwt_identity()
    if isinstance(user_id, str):
        return int(user_id)
    return user_id

def vendor_required(f):
    """Decorator to require vendor access"""
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_current_user_id()
        user = User.query.get(current_user_id)
        if not user or (user.role != UserRole.VENDOR and user.role != UserRole.ADMIN):
            return jsonify({'error': 'Vendor access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def get_vendor_profile(user_id):
    """Helper function to get vendor profile"""
    user = User.query.get(user_id)
    if not user or not user.vendor_profile:
        return None
    return user.vendor_profile

# Vendor Dashboard
@vendor_bp.route('/dashboard/stats', methods=['GET'])
@vendor_required
def vendor_dashboard():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        if vendor.status != VendorStatus.APPROVED:
            return jsonify({
                'status': vendor.status.value,
                'message': 'Your vendor account is pending approval'
            }), 200
        
        # Get date range (default: last 30 days)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Product stats
        total_products = Product.query.filter_by(vendor_id=vendor.id).count()
        active_products = Product.query.filter_by(vendor_id=vendor.id, is_active=True).count()
        low_stock_products = Product.query.filter(
            Product.vendor_id == vendor.id,
            Product.stock <= Product.min_stock,
            Product.is_active == True
        ).count()
        out_of_stock = Product.query.filter(
            Product.vendor_id == vendor.id,
            Product.stock == 0,
            Product.is_active == True
        ).count()
        
        # Order stats
        total_orders = db.session.query(func.count(OrderItem.id)).filter(
            OrderItem.vendor_id == vendor.id
        ).scalar() or 0
        
        recent_orders = db.session.query(func.count(OrderItem.id)).join(Order).filter(
            OrderItem.vendor_id == vendor.id,
            Order.created_at >= start_date
        ).scalar() or 0
        
        pending_orders = db.session.query(func.count(OrderItem.id)).join(Order).filter(
            OrderItem.vendor_id == vendor.id,
            Order.status == OrderStatus.PENDING
        ).scalar() or 0
        
        # Revenue stats
        recent_revenue = db.session.query(func.sum(OrderItem.vendor_amount)).join(Order).filter(
            OrderItem.vendor_id == vendor.id,
            Order.created_at >= start_date
        ).scalar() or 0
        
        # Top selling products
        top_products = db.session.query(
            Product.name,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.vendor_amount).label('total_revenue')
        ).join(OrderItem).filter(
            Product.vendor_id == vendor.id
        ).group_by(Product.id).order_by(desc('total_sold')).limit(5).all()
        
        return jsonify({
            'vendor': {
                'id': vendor.id,
                'business_name': vendor.business_name,
                'status': vendor.status.value,
                'commission_rate': vendor.commission_rate,
                'total_sales': vendor.total_sales,
                'current_balance': vendor.current_balance
            },
            'products': {
                'total': total_products,
                'active': active_products,
                'low_stock': low_stock_products,
                'out_of_stock': out_of_stock
            },
            'orders': {
                'total': total_orders,
                'recent': recent_orders,
                'pending': pending_orders
            },
            'revenue': {
                'recent': recent_revenue,
                'total_sales': vendor.total_sales,
                'current_balance': vendor.current_balance
            },
            'top_products': [
                {
                    'name': product[0],
                    'total_sold': product[1],
                    'total_revenue': float(product[2]) if product[2] else 0
                } for product in top_products
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Product Management
@vendor_bp.route('/products', methods=['GET'])
@vendor_required
def vendor_get_products():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category')
        is_active = request.args.get('is_active')
        
        query = Product.query.filter_by(vendor_id=vendor.id)
        
        if category:
            query = query.filter(Product.category == category)
        if is_active is not None:
            query = query.filter(Product.is_active == (is_active.lower() == 'true'))
        
        products = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
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
                'min_stock': product.min_stock,
                'is_active': product.is_active,
                'featured': product.featured,
                'rating': product.rating,
                'review_count': product.review_count,
                'image_url': primary_image or f'https://picsum.photos/400/300?random={product.id}',
                'is_low_stock': product.stock <= product.min_stock,
                'created_at': product.created_at.isoformat(),
                'updated_at': product.updated_at.isoformat()
            })
        
        return jsonify({
            'products': result,
            'pagination': {
                'page': products.page,
                'pages': products.pages,
                'per_page': products.per_page,
                'total': products.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@vendor_bp.route('/products', methods=['POST'])
@vendor_required
def vendor_create_product():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        if vendor.status != VendorStatus.APPROVED:
            return jsonify({'error': 'Vendor account must be approved to add products'}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'description', 'price', 'category', 'stock']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create product
        product = Product(
            vendor_id=vendor.id,
            name=data['name'],
            description=data['description'],
            price=float(data['price']),
            category=data['category'],
            subcategory=data.get('subcategory'),
            brand=data.get('brand'),
            weight=data.get('weight'),
            dimensions=data.get('dimensions'),
            stock=int(data['stock']),
            min_stock=data.get('min_stock', 5)
        )
        
        db.session.add(product)
        db.session.flush()  # Get product ID
        
        # Add images if provided
        images = data.get('images', [])
        for i, image_data in enumerate(images):
            if isinstance(image_data, str):
                image_url = image_data
                is_primary = i == 0
                alt_text = f"{product.name} - Image {i+1}"
            else:
                image_url = image_data.get('url')
                is_primary = image_data.get('is_primary', i == 0)
                alt_text = image_data.get('alt_text', f"{product.name} - Image {i+1}")
            
            if image_url:
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url,
                    is_primary=is_primary,
                    alt_text=alt_text
                )
                db.session.add(product_image)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': {
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'stock': product.stock
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@vendor_bp.route('/products/<int:product_id>', methods=['PUT'])
@vendor_required
def vendor_update_product(product_id):
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        product = Product.query.filter_by(id=product_id, vendor_id=vendor.id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        
        # Update product fields
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = float(data['price'])
        if 'category' in data:
            product.category = data['category']
        if 'subcategory' in data:
            product.subcategory = data['subcategory']
        if 'brand' in data:
            product.brand = data['brand']
        if 'weight' in data:
            product.weight = data['weight']
        if 'dimensions' in data:
            product.dimensions = data['dimensions']
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'min_stock' in data:
            product.min_stock = int(data['min_stock'])
        if 'is_active' in data:
            product.is_active = bool(data['is_active'])
        
        product.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Product updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@vendor_bp.route('/products/<int:product_id>/stock', methods=['PUT'])
@vendor_required
def update_product_stock(product_id):
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        product = Product.query.filter_by(id=product_id, vendor_id=vendor.id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        action = data.get('action')  # 'increase', 'decrease', 'set'
        quantity = data.get('quantity', 0)
        
        if action == 'increase':
            product.stock += quantity
        elif action == 'decrease':
            product.stock = max(0, product.stock - quantity)
        elif action == 'set':
            product.stock = max(0, quantity)
        else:
            return jsonify({'error': 'Invalid action. Use increase, decrease, or set'}), 400
        
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Stock updated successfully',
            'new_stock': product.stock,
            'is_low_stock': product.stock <= product.min_stock,
            'out_of_stock': product.stock == 0
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Order Management
@vendor_bp.route('/orders', methods=['GET'])
@vendor_required
def vendor_get_orders():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        query = db.session.query(Order).join(OrderItem).filter(
            OrderItem.vendor_id == vendor.id
        )
        
        if status:
            try:
                status_enum = OrderStatus(status)
                query = query.filter(Order.status == status_enum)
            except ValueError:
                return jsonify({'error': 'Invalid status'}), 400
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for order in orders.items:
            # Get vendor-specific items from this order
            vendor_items = [item for item in order.items if item.vendor_id == vendor.id]
            vendor_total = sum(item.vendor_amount for item in vendor_items)
            
            result.append({
                'id': order.id,
                'order_number': order.order_number,
                'status': order.status.value,
                'vendor_total': vendor_total,
                'vendor_items': len(vendor_items),
                'customer': {
                    'username': order.customer.username,
                    'phone': order.delivery_phone
                },
                'delivery_address': order.delivery_address,
                'items': [
                    {
                        'product_name': item.product.name,
                        'quantity': item.quantity,
                        'price': item.price,
                        'vendor_amount': item.vendor_amount
                    } for item in vendor_items
                ],
                'created_at': order.created_at.isoformat()
            })
        
        return jsonify({
            'orders': result,
            'pagination': {
                'page': orders.page,
                'pages': orders.pages,
                'per_page': orders.per_page,
                'total': orders.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Profile Management
@vendor_bp.route('/profile', methods=['GET'])
@vendor_required
def get_vendor_profile_info():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        return jsonify({
            'id': vendor.id,
            'business_name': vendor.business_name,
            'business_address': vendor.business_address,
            'business_phone': vendor.business_phone,
            'business_email': vendor.business_email,
            'business_registration': vendor.business_registration,
            'bank_name': vendor.bank_name,
            'account_number': vendor.account_number,
            'account_name': vendor.account_name,
            'status': vendor.status.value,
            'commission_rate': vendor.commission_rate,
            'total_sales': vendor.total_sales,
            'current_balance': vendor.current_balance,
            'created_at': vendor.created_at.isoformat(),
            'approved_at': vendor.approved_at.isoformat() if vendor.approved_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@vendor_bp.route('/profile', methods=['PUT'])
@vendor_required
def update_vendor_profile():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'business_address' in data:
            vendor.business_address = data['business_address']
        if 'business_phone' in data:
            vendor.business_phone = data['business_phone']
        if 'bank_name' in data:
            vendor.bank_name = data['bank_name']
        if 'account_number' in data:
            vendor.account_number = data['account_number']
        if 'account_name' in data:
            vendor.account_name = data['account_name']
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Withdrawal Management Routes
@vendor_bp.route('/withdrawals', methods=['GET'])
@vendor_required
def get_withdrawal_history():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        # For now, return mock data since we don't have a Withdrawal model yet
        # TODO: Implement proper Withdrawal model and table
        withdrawals = []
        
        return jsonify({'withdrawals': withdrawals}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@vendor_bp.route('/payment-methods', methods=['GET'])
@vendor_required
def get_payment_methods():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        # For now, return mock data based on vendor's bank details
        payment_methods = []
        
        if vendor.bank_name and vendor.account_number:
            payment_methods.append({
                'id': 1,
                'type': 'Bank Transfer',
                'details': f"{vendor.bank_name} - {vendor.account_number}"
            })
        
        return jsonify({'payment_methods': payment_methods}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@vendor_bp.route('/withdraw', methods=['POST'])
@vendor_required
def request_withdrawal():
    try:
        current_user_id = get_jwt_identity()
        vendor = get_vendor_profile(current_user_id)
        
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        if vendor.status != VendorStatus.APPROVED:
            return jsonify({'error': 'Only approved vendors can request withdrawals'}), 400
        
        data = request.get_json()
        amount = data.get('amount')
        payment_method_id = data.get('payment_method_id')
        
        if not amount or amount <= 0:
            return jsonify({'error': 'Invalid withdrawal amount'}), 400
        
        if amount > vendor.current_balance:
            return jsonify({'error': 'Insufficient balance'}), 400
        
        if not payment_method_id:
            return jsonify({'error': 'Payment method is required'}), 400
        
        # For now, just return a success message
        # TODO: Implement proper withdrawal processing
        # - Create withdrawal record
        # - Update vendor balance
        # - Send notification to admin
        # - Integrate with payment provider
        
        return jsonify({
            'message': 'Withdrawal request submitted successfully',
            'reference': f'WD{datetime.utcnow().strftime("%Y%m%d%H%M%S")}'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

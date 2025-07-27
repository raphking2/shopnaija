# Admin Routes for Multi-vendor Management
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Vendor, Product, Order, OrderItem, AdminAction, UserRole, VendorStatus, OrderStatus
from datetime import datetime, timedelta
from sqlalchemy import func, desc

admin_bp = Blueprint('admin', __name__)

# Utility function to handle JWT identity
def get_current_user_id():
    """Get current user ID from JWT, handling both string and int formats"""
    user_id = get_jwt_identity()
    if isinstance(user_id, str):
        return int(user_id)
    return user_id

def admin_required(f):
    """Decorator to require admin access"""
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_current_user_id()
        user = User.query.get(current_user_id)
        if not user or user.role != UserRole.ADMIN:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Dashboard Stats
@admin_bp.route('/dashboard/stats', methods=['GET'])
@admin_required
def dashboard_stats():
    try:
        # Get date range (default: last 30 days)
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Basic counts
        total_users = User.query.filter(User.role == UserRole.CUSTOMER).count()
        total_vendors = Vendor.query.count()
        pending_vendors = Vendor.query.filter(Vendor.status == VendorStatus.PENDING).count()
        approved_vendors = Vendor.query.filter(Vendor.status == VendorStatus.APPROVED).count()
        total_products = Product.query.count()
        active_products = Product.query.filter(Product.is_active == True).count()
        
        # Orders stats
        total_orders = Order.query.count()
        recent_orders = Order.query.filter(Order.created_at >= start_date).count()
        pending_orders = Order.query.filter(Order.status == OrderStatus.PENDING).count()
        
        # Revenue stats
        total_revenue = db.session.query(func.sum(Order.total_amount)).scalar() or 0
        total_commission = db.session.query(func.sum(Order.commission_amount)).scalar() or 0
        recent_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            Order.created_at >= start_date
        ).scalar() or 0
        
        # Low stock products
        low_stock_products = Product.query.filter(
            Product.stock <= Product.min_stock,
            Product.is_active == True
        ).count()
        
        # Top performing vendors
        top_vendors = db.session.query(
            Vendor.business_name,
            Vendor.total_sales,
            func.count(Product.id).label('product_count')
        ).join(Product).group_by(Vendor.id).order_by(desc(Vendor.total_sales)).limit(5).all()
        
        return jsonify({
            'summary': {
                'total_users': total_users,
                'total_vendors': total_vendors,
                'pending_vendors': pending_vendors,
                'approved_vendors': approved_vendors,
                'total_products': total_products,
                'active_products': active_products,
                'total_orders': total_orders,
                'recent_orders': recent_orders,
                'pending_orders': pending_orders,
                'low_stock_products': low_stock_products
            },
            'revenue': {
                'total_revenue': total_revenue,
                'total_commission': total_commission,
                'recent_revenue': recent_revenue,
                'commission_rate': 8.0
            },
            'top_vendors': [
                {
                    'business_name': vendor[0],
                    'total_sales': vendor[1],
                    'product_count': vendor[2]
                } for vendor in top_vendors
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vendor Management
@admin_bp.route('/vendors', methods=['GET'])
@admin_required
def get_vendors():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        search = request.args.get('search')
        
        query = Vendor.query
        
        if status:
            try:
                status_enum = VendorStatus(status)
                query = query.filter(Vendor.status == status_enum)
            except ValueError:
                return jsonify({'error': 'Invalid status'}), 400
        
        if search:
            query = query.filter(
                Vendor.business_name.contains(search) |
                Vendor.business_email.contains(search) |
                User.username.contains(search)
            ).join(User)
        
        vendors = query.order_by(Vendor.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for vendor in vendors.items:
            result.append({
                'id': vendor.id,
                'user_id': vendor.user_id,
                'business_name': vendor.business_name,
                'business_email': vendor.business_email,
                'business_phone': vendor.business_phone,
                'business_registration': vendor.business_registration,
                'status': vendor.status.value,
                'commission_rate': vendor.commission_rate,
                'total_sales': vendor.total_sales,
                'current_balance': vendor.current_balance,
                'product_count': len(vendor.products),
                'created_at': vendor.created_at.isoformat(),
                'approved_at': vendor.approved_at.isoformat() if vendor.approved_at else None,
                'user': {
                    'username': vendor.user.username,
                    'email': vendor.user.email,
                    'phone': vendor.user.phone
                }
            })
        
        return jsonify({
            'vendors': result,
            'pagination': {
                'page': vendors.page,
                'pages': vendors.pages,
                'per_page': vendors.per_page,
                'total': vendors.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/vendors/<int:vendor_id>/approve', methods=['POST'])
@admin_required
def approve_vendor(vendor_id):
    try:
        current_user_id = get_jwt_identity()
        vendor = Vendor.query.get_or_404(vendor_id)
        
        if vendor.status != VendorStatus.PENDING:
            return jsonify({'error': 'Vendor is not in pending status'}), 400
        
        vendor.status = VendorStatus.APPROVED
        vendor.approved_at = datetime.utcnow()
        
        # Log admin action
        action = AdminAction(
            admin_id=current_user_id,
            action_type='vendor_approval',
            target_id=vendor_id,
            description=f'Approved vendor: {vendor.business_name}'
        )
        db.session.add(action)
        
        db.session.commit()
        
        # TODO: Send approval email to vendor
        
        return jsonify({'message': 'Vendor approved successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/vendors/<int:vendor_id>/reject', methods=['POST'])
@admin_required
def reject_vendor(vendor_id):
    try:
        current_user_id = get_jwt_identity()
        vendor = Vendor.query.get_or_404(vendor_id)
        data = request.get_json()
        reason = data.get('reason', 'No reason provided')
        
        if vendor.status != VendorStatus.PENDING:
            return jsonify({'error': 'Vendor is not in pending status'}), 400
        
        vendor.status = VendorStatus.REJECTED
        
        # Log admin action
        action = AdminAction(
            admin_id=current_user_id,
            action_type='vendor_rejection',
            target_id=vendor_id,
            description=f'Rejected vendor: {vendor.business_name}. Reason: {reason}'
        )
        db.session.add(action)
        
        db.session.commit()
        
        # TODO: Send rejection email to vendor
        
        return jsonify({'message': 'Vendor rejected successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/vendors/<int:vendor_id>/suspend', methods=['POST'])
@admin_required
def suspend_vendor(vendor_id):
    try:
        current_user_id = get_jwt_identity()
        vendor = Vendor.query.get_or_404(vendor_id)
        data = request.get_json()
        reason = data.get('reason', 'No reason provided')
        
        vendor.status = VendorStatus.SUSPENDED
        
        # Deactivate all vendor products
        for product in vendor.products:
            product.is_active = False
        
        # Log admin action
        action = AdminAction(
            admin_id=current_user_id,
            action_type='vendor_suspension',
            target_id=vendor_id,
            description=f'Suspended vendor: {vendor.business_name}. Reason: {reason}'
        )
        db.session.add(action)
        
        db.session.commit()
        
        return jsonify({'message': 'Vendor suspended successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Product Management
@admin_bp.route('/products', methods=['GET'])
@admin_required
def admin_get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category')
        vendor_id = request.args.get('vendor_id')
        is_active = request.args.get('is_active')
        low_stock = request.args.get('low_stock', type=bool)
        
        query = Product.query
        
        if category:
            query = query.filter(Product.category == category)
        if vendor_id:
            query = query.filter(Product.vendor_id == vendor_id)
        if is_active is not None:
            query = query.filter(Product.is_active == (is_active.lower() == 'true'))
        if low_stock:
            query = query.filter(Product.stock <= Product.min_stock)
        
        products = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for product in products.items:
            result.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'category': product.category,
                'stock': product.stock,
                'min_stock': product.min_stock,
                'is_active': product.is_active,
                'rating': product.rating,
                'review_count': product.review_count,
                'vendor': {
                    'id': product.vendor.id,
                    'business_name': product.vendor.business_name,
                    'status': product.vendor.status.value
                },
                'is_low_stock': product.stock <= product.min_stock,
                'created_at': product.created_at.isoformat()
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

@admin_bp.route('/products/<int:product_id>/deactivate', methods=['POST'])
@admin_required
def deactivate_product(product_id):
    try:
        current_user_id = get_jwt_identity()
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        reason = data.get('reason', 'Admin action')
        
        product.is_active = False
        
        # Log admin action
        action = AdminAction(
            admin_id=current_user_id,
            action_type='product_deactivation',
            target_id=product_id,
            description=f'Deactivated product: {product.name}. Reason: {reason}'
        )
        db.session.add(action)
        
        db.session.commit()
        
        return jsonify({'message': 'Product deactivated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Order Management
@admin_bp.route('/orders', methods=['GET'])
@admin_required
def admin_get_orders():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        vendor_id = request.args.get('vendor_id')
        
        query = Order.query
        
        if status:
            try:
                status_enum = OrderStatus(status)
                query = query.filter(Order.status == status_enum)
            except ValueError:
                return jsonify({'error': 'Invalid status'}), 400
        
        if vendor_id:
            query = query.join(Order.items).filter(OrderItem.vendor_id == vendor_id)
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for order in orders.items:
            result.append({
                'id': order.id,
                'order_number': order.order_number,
                'total_amount': order.total_amount,
                'commission_amount': order.commission_amount,
                'status': order.status.value,
                'customer': {
                    'username': order.customer.username,
                    'email': order.customer.email
                },
                'item_count': len(order.items),
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

# Admin Actions Log
@admin_bp.route('/actions', methods=['GET'])
@admin_required
def get_admin_actions():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        actions = AdminAction.query.order_by(AdminAction.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        result = []
        for action in actions.items:
            result.append({
                'id': action.id,
                'admin': action.admin.username,
                'action_type': action.action_type,
                'target_id': action.target_id,
                'description': action.description,
                'created_at': action.created_at.isoformat()
            })
        
        return jsonify({
            'actions': result,
            'pagination': {
                'page': actions.page,
                'pages': actions.pages,
                'per_page': actions.per_page,
                'total': actions.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Commission Settings
@admin_bp.route('/settings/commission', methods=['PUT'])
@admin_required
def update_commission_rate():
    try:
        data = request.get_json()
        vendor_id = data.get('vendor_id')
        new_rate = data.get('commission_rate')
        
        if not vendor_id or new_rate is None:
            return jsonify({'error': 'vendor_id and commission_rate are required'}), 400
        
        if not (0 <= new_rate <= 50):
            return jsonify({'error': 'Commission rate must be between 0 and 50'}), 400
        
        vendor = Vendor.query.get_or_404(vendor_id)
        old_rate = vendor.commission_rate
        vendor.commission_rate = new_rate
        
        # Log admin action
        current_user_id = get_jwt_identity()
        action = AdminAction(
            admin_id=current_user_id,
            action_type='commission_update',
            target_id=vendor_id,
            description=f'Updated commission rate for {vendor.business_name} from {old_rate}% to {new_rate}%'
        )
        db.session.add(action)
        
        db.session.commit()
        
        return jsonify({'message': 'Commission rate updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin Management Routes
@admin_bp.route('/admins', methods=['GET'])
@admin_required
def get_admins():
    """Get all admin users"""
    try:
        admins = User.query.filter(User.role == UserRole.ADMIN).all()
        
        admin_list = []
        for admin in admins:
            admin_list.append({
                'id': admin.id,
                'username': admin.username,
                'email': admin.email,
                'created_at': admin.created_at.isoformat() if admin.created_at else None,
                'last_login': admin.last_login.isoformat() if admin.last_login else None,
                'is_verified': admin.is_verified
            })
        
        return jsonify({'admins': admin_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admins', methods=['POST'])
@admin_required
def create_admin():
    """Create a new admin user"""
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
            verification_token=None
        )
        admin_user.set_password(data['password'])
        
        # Log admin action
        current_user_id = get_jwt_identity()
        action = AdminAction(
            admin_id=current_user_id,
            action_type='admin_creation',
            target_id=None,
            description=f'Created new admin user: {admin_user.email}'
        )
        
        db.session.add(admin_user)
        db.session.add(action)
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

@admin_bp.route('/admins/<int:admin_id>', methods=['DELETE'])
@admin_required
def delete_admin():
    """Delete an admin user (cannot delete yourself)"""
    try:
        current_user_id = get_jwt_identity()
        admin_id = request.view_args['admin_id']
        
        if current_user_id == admin_id:
            return jsonify({'error': 'Cannot delete your own admin account'}), 400
        
        admin_to_delete = User.query.filter_by(id=admin_id, role=UserRole.ADMIN).first()
        if not admin_to_delete:
            return jsonify({'error': 'Admin not found'}), 404
        
        # Check if this is the last admin
        admin_count = User.query.filter(User.role == UserRole.ADMIN).count()
        if admin_count <= 1:
            return jsonify({'error': 'Cannot delete the last admin user'}), 400
        
        # Log admin action
        action = AdminAction(
            admin_id=current_user_id,
            action_type='admin_deletion',
            target_id=admin_id,
            description=f'Deleted admin user: {admin_to_delete.email}'
        )
        
        db.session.add(action)
        db.session.delete(admin_to_delete)
        db.session.commit()
        
        return jsonify({'message': 'Admin user deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

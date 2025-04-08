from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Product, Cart, db
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import re

api = Blueprint('api', __name__)

# Error handlers
@api.errorhandler(400)
def handle_bad_request(e):
    return jsonify(error=str(e)), 400

@api.errorhandler(401)
def handle_unauthorized(e):
    return jsonify(error="Unauthorized access"), 401

@api.errorhandler(404)
def handle_not_found(e):
    return jsonify(error="Resource not found"), 404

@api.errorhandler(IntegrityError)
def handle_integrity_error(e):
    db.session.rollback()
    return jsonify(error="Database integrity error"), 400

@api.errorhandler(SQLAlchemyError)
def handle_db_error(e):
    db.session.rollback()
    return jsonify(error="Database error occurred"), 500

# Helper function for validating email
def is_valid_email(email):
    return re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email)

# Auth routes
@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"msg": "Missing required fields (email and password)"}), 400

        # Validate email format
        if not is_valid_email(data['email']):
            return jsonify({"msg": "Invalid email format"}), 400

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"msg": "Email already exists"}), 400

        # Create new user
        new_user = User(
            username=data.get('username', data['email'].split('@')[0]),
            email=data['email']
        )
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "User created successfully", "user_id": new_user.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"msg": "Missing email or password"}), 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({"msg": "Invalid credentials"}), 401

        # Create access token
        # access_token = create_access_token(identity=user.id)
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500

# Product Routes
@api.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'category': p.category,
            'image_url': p.image_url,
            'stock': p.stock
        } for p in products]), 200
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500

# Product Routes
@api.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    try:
        product = Product.query.get(id)
        if not product:
            return jsonify({"msg": "Product not found"}), 404

        return jsonify({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'category': product.category,
            'image_url': product.image_url,
            'stock': product.stock
        }), 200

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500


@api.route('/products/<category>', methods=['GET'])
def get_products_by_category(category):
    try:
        products = Product.query.filter_by(category=category).all()
        if not products:
            return jsonify({"msg": "No products found in this category"}), 404

        return jsonify([{
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'image_url': p.image_url,
            'stock': p.stock
        } for p in products]), 200
    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500
    

# Product Routes
@api.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    try:
        data = request.get_json()
        required_fields = ['name', 'price', 'category', 'stock']
        for field in required_fields:
            if field not in data:
                return jsonify({"msg": f"Missing required field: {field}"}), 400

        # Validate data types
        try:
            price = float(data['price'])
            stock = int(data['stock'])
        except ValueError:
            return jsonify({"msg": "Invalid price or stock value"}), 400

        # Create new product
        new_product = Product(
            name=data['name'],
            price=price,
            category=data['category'],
            image_url=data.get('image_url', ''),
            stock=stock
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            'id': new_product.id,
            'name': new_product.name,
            'price': new_product.price,
            'category': new_product.category,
            'image_url': new_product.image_url,
            'stock': new_product.stock
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Product could not be created, possible duplicate."}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating product: {str(e)}"}), 500

# Cart Routes
@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())  # Convert to integer
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or 'product_id' not in data:
            return jsonify({"msg": "Missing product_id"}), 400

        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({"msg": "Product not found"}), 404

        # Check if product is in stock
        if product.stock <= 0:
            return jsonify({"msg": "Product out of stock"}), 400

        cart_item = Cart.query.filter_by(user_id=user_id, product_id=data['product_id']).first()

        if cart_item:
            cart_item.quantity += 1
        else:
            cart_item = Cart(user_id=user_id, product_id=data['product_id'])
            db.session.add(cart_item)

        db.session.commit()
        return jsonify({"msg": "Item added to cart", "cart_item_id": cart_item.id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error: {str(e)}"}), 500

@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id = int(get_jwt_identity())  # Convert to integer
        user_id = get_jwt_identity()
        cart_items = Cart.query.filter_by(user_id=user_id).all()

        return jsonify([{
            'product_id': item.product_id,
            'quantity': item.quantity,
            'added_at': item.added_at.isoformat()
        } for item in cart_items]), 200

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500
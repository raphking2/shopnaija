from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db
from config import config

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Configure JWT to handle string identities
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return str(user)
    
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        # Convert to int for database lookup
        if isinstance(identity, str):
            identity = int(identity)
        from models import User
        return User.query.filter_by(id=identity).one_or_none()
    
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Register blueprints
    from routes import api
    from admin_routes import admin_bp
    from vendor_routes import vendor_bp
    
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(vendor_bp, url_prefix='/api/vendor')
    
    # Add root route
    @app.route('/')
    def home():
        return jsonify({
            "message": "Welcome to ShopNaija - Nigeria's Premier Multi-Vendor E-Commerce Platform",
            "version": "2.0",
            "features": [
                "Multi-vendor marketplace",
                "Admin dashboard",
                "Vendor management",
                "Mobile-responsive design",
                "Secure payments",
                "Commission tracking"
            ]
        }), 200
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy", "message": "ShopNaija API is running"}), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "Unauthorized access"}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Access forbidden"}), 403
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=app.config['DEBUG'])
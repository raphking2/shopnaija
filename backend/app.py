from flask import Flask, jsonify  # Added jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db
from config import config

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Register blueprints
    from routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    # Add root route
    @app.route('/')
    def home():
        return jsonify({"message": "Welcome to the E-Commerce API"}), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=app.config['DEBUG'])
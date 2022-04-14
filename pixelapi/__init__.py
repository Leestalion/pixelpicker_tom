from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_wtf import CSRFProtect
from flask_jwt_extended import JWTManager
from flask_wtf.csrf import generate_csrf
from sqlalchemy import create_engine


db = SQLAlchemy()
cors = CORS()
csrf = CSRFProtect()
jwt = JWTManager()


def create_app():
    """Initialize the core application."""
    app = Flask(__name__,
        instance_relative_config=True
    )
    app.config.from_object('config.Config')

    # Initialize plugins
    csrf.init_app(app)
    db.init_app(app)
    cors.init_app(app, supports_credentials=True)
    jwt.init_app(app)

    @app.after_request
    def set_csrf_cookie(response):
        response.set_cookie('XSRF-TOKEN', generate_csrf())
        return response


    with app.app_context():
        # Includes our routes
        from .routes import routes
        from .routes import auth

        # Register blueprints
        app.register_blueprint(routes.main_bp)
        app.register_blueprint(auth.auth_bp)


        # Create Database Models
        from .models.pixel import Pixel
        from .models.user import User

        try:
            db.create_all()
        except:
            engine = create_engine(app.config["SQLALCHEMY_ENGINE_URI"])
            engine.execute("CREATE DATABASE "+app.config["MYSQL_DB"])
            db.create_all()
    
    return app
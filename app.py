import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

# Initialize extensions
db = SQLAlchemy(model_class=Base)
login_manager = LoginManager()
migrate = Migrate()

def create_app():
    # Create Flask app
    app = Flask(__name__)
    
    # Configuration
    app.secret_key = os.environ.get("SESSION_SECRET", "your-secret-key-here")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "postgresql://war5_user:c4a5hglcRFqnZEMnO0omXnV3LdbootPG@dpg-d1vo26juibrs739jf230-a.oregon-postgres.render.com/war5")
   
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
    

    # إعدادات المتجر
    app.STORE_NAME = "متجر الأسلحة الفاخرة"
    app.STORE_LOGO = "logo.png" 
     # يجب وضع الملف في مجلد static/images/




    # Proxy fix for HTTPS
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    
    # Login manager configuration
    login_manager.login_view = 'main.login'
    login_manager.login_message = 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة'
    login_manager.login_message_category = 'info'
    
    @login_manager.user_loader
    def load_user(user_id):
        from models import User
        return User.query.get(int(user_id))
    
    # Create database tables
    with app.app_context():
        import models
        db.create_all()
        
        # Create admin user if not exists
        from models import User
        from werkzeug.security import generate_password_hash
        
        admin_user = User.query.filter_by(email='admin@weapons.com').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@weapons.com',
                password_hash=generate_password_hash('admin123'),
                is_admin=True
            )
            db.session.add(admin_user)
            db.session.commit()
            logging.info("Admin user created")
    
    return app

# Create app instance
app = create_app()

# Register blueprints
from routes import main_bp, admin_bp

app.register_blueprint(main_bp)
app.register_blueprint(admin_bp, url_prefix='/admin')


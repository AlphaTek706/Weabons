#!/usr/bin/env python3
"""
ملف لإضافة بيانات تجريبية لقاعدة البيانات
"""

from app import app, db
from models import User, Category, Product, Advertisement
from werkzeug.security import generate_password_hash
from datetime import datetime
import random

def create_admin_user():
    """إنشاء مستخدم مدير افتراضي"""
    admin = User.query.filter_by(username='admin').first()
    
    if not admin:
        admin = User(
            username='admin',
            email='admin@weapons-store.com',
            password_hash=generate_password_hash('admin123'),
            first_name='مدير',
            last_name='المتجر',
            phone='123456789',
            address='الرياض، المملكة العربية السعودية',
            is_admin=True,
            is_active=True
        )
        db.session.add(admin)
        print("✓ تم إنشاء المستخدم المدير")
        print("اسم المستخدم: admin")
        print("كلمة المرور: admin123")
        print("البريد الإلكتروني: admin@weapons-store.com")
    else:
        print("✓ المستخدم المدير موجود بالفعل")


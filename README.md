# متجر الأسلحة الإلكتروني - Arabic Weapons Store

## نظرة عامة
موقع ويب متقدم يجمع بين المتجر الإلكتروني والإعلانات مع واجهات منفصلة للعملاء والإدارة باستخدام Flask وPostgreSQL.

## المتطلبات
- Python 3.8+
- PostgreSQL 12+
- pip (مدير الحزم)

## التثبيت والتشغيل المحلي

### 1. تحميل المشروع
```bash
# تحميل المشروع من GitHub أو نسخ الملفات
git clone [repository-url]
cd weapons-store
```

### 2. إنشاء بيئة افتراضية
```bash
# إنشاء بيئة افتراضية
python -m venv venv

# تفعيل البيئة الافتراضية
# على Windows:
venv\Scripts\activate
# على macOS/Linux:
source venv/bin/activate
```

### 3. تثبيت المتطلبات
```bash
pip install -r local_requirements.txt
```

### 4. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة بيانات PostgreSQL
createdb weapons_store

# تعيين متغيرات البيئة
export DATABASE_URL="postgresql://username:password@localhost/weapons_store"
export SESSION_SECRET="your-secret-key-here"

# على Windows:
set DATABASE_URL=postgresql://username:password@localhost/weapons_store
set SESSION_SECRET=your-secret-key-here
```

### 5. تشغيل التطبيق
```bash
# تشغيل التطبيق
python main.py

# أو باستخدام Gunicorn
gunicorn --bind 0.0.0.0:5000 main:app
```

### 6. إضافة البيانات التجريبية
```bash
# إضافة البيانات التجريبية ومستخدم المدير
python seed_data.py
```

## بيانات تسجيل الدخول

### المستخدم المدير
- اسم المستخدم: `admin`
- كلمة المرور: `admin123`
- البريد الإلكتروني: `admin@weapons-store.com`

### مستخدمين تجريبيين
- `ahmed123` / `password123`
- `sara456` / `password123`
- `omar789` / `password123`

## الميزات

### واجهة العملاء
- تصفح المنتجات بالفئات
- البحث والتصفية
- عربة التسوق
- إتمام الطلبات
- إدارة الحساب الشخصي

### لوحة الإدارة
- إدارة المنتجات (إضافة، تعديل، حذف)
- إدارة الطلبات وحالات الشحن
- إدارة المستخدمين
- إدارة الإعلانات
- التقارير والإحصائيات

## هيكل المشروع
```
weapons-store/
├── app.py                 # إعداد التطبيق الرئيسي
├── main.py               # نقطة الدخول
├── models.py             # نماذج قاعدة البيانات
├── routes.py             # مسارات التطبيق
├── forms.py              # نماذج الويب
├── seed_data.py          # البيانات التجريبية
├── local_requirements.txt # المتطلبات
├── static/               # الملفات الثابتة
│   ├── css/
│   └── js/
└── templates/            # قوالب HTML
    ├── admin/
    └── base.html
```

## التقنيات المستخدمة
- **Backend**: Flask, SQLAlchemy, PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5, Tailwind CSS
- **Authentication**: Flask-Login
- **Forms**: WTForms, Flask-WTF
- **Database**: PostgreSQL with psycopg2
- **Server**: Gunicorn

## الأمان
- تشفير كلمات المرور باستخدام Werkzeug
- حماية CSRF على جميع النماذج
- إدارة الجلسات الآمنة
- التحكم في الوصول القائم على الأدوار

## الدعم الفني
للحصول على الدعم أو الإبلاغ عن مشاكل، يرجى التواصل معنا.

## الترخيص
هذا المشروع مرخص تحت رخصة MIT.# Weabons

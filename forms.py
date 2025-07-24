from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DecimalField, IntegerField, SelectField, BooleanField, PasswordField, DateTimeField
from wtforms.validators import DataRequired, Email, Length, NumberRange, Optional, EqualTo

class LoginForm(FlaskForm):
    username = StringField('اسم المستخدم أو البريد الإلكتروني', validators=[DataRequired()])
    password = PasswordField('كلمة المرور', validators=[DataRequired()])

class RegisterForm(FlaskForm):
    username = StringField('اسم المستخدم', validators=[DataRequired(), Length(min=4, max=20)])
    email = StringField('البريد الإلكتروني', validators=[DataRequired(), Email()])
    password = PasswordField('كلمة المرور', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('تأكيد كلمة المرور', validators=[DataRequired(), EqualTo('password')])
    first_name = StringField('الاسم الأول', validators=[DataRequired()])
    last_name = StringField('الاسم الأخير', validators=[DataRequired()])
    phone = StringField('رقم الهاتف', validators=[Optional()])
    address = TextAreaField('العنوان', validators=[Optional()])

class ProductForm(FlaskForm):
    name = StringField('اسم المنتج', validators=[DataRequired()])
    description = TextAreaField('وصف المنتج', validators=[Optional()])
    price = DecimalField('السعر', validators=[DataRequired(), NumberRange(min=0.01)])
    stock_quantity = IntegerField('الكمية المتوفرة', validators=[DataRequired(), NumberRange(min=0)])
    image_url = StringField('رابط الصورة', validators=[Optional()])
    category_id = SelectField('الفئة', coerce=int, validators=[DataRequired()])
    is_active = BooleanField('نشط')
    is_featured = BooleanField('مميز')

class CategoryForm(FlaskForm):
    name = StringField('اسم الفئة', validators=[DataRequired()])
    description = TextAreaField('وصف الفئة', validators=[Optional()])
    is_active = BooleanField('نشط')

class AdvertisementForm(FlaskForm):
    title = StringField('عنوان الإعلان', validators=[DataRequired()])
    description = TextAreaField('وصف الإعلان', validators=[Optional()])
    image_url = StringField('رابط الصورة', validators=[Optional()])
    link_url = StringField('رابط الإعلان', validators=[Optional()])
    position = SelectField('الموقع', choices=[
        ('header', 'أعلى الصفحة'),
        ('sidebar', 'الشريط الجانبي'),
        ('footer', 'أسفل الصفحة'),
        ('popup', 'نافذة منبثقة')
    ], validators=[DataRequired()])
    is_active = BooleanField('نشط')
    start_date = DateTimeField('تاريخ البداية', validators=[Optional()])
    end_date = DateTimeField('تاريخ النهاية', validators=[Optional()])

class OrderForm(FlaskForm):
    shipping_address = TextAreaField('عنوان الشحن', validators=[DataRequired()])
    payment_method = SelectField('طريقة الدفع', choices=[
        ('cash', 'الدفع عند الاستلام'),
        ('card', 'بطاقة ائتمان'),
        ('bank_transfer', 'تحويل بنكي')
    ], validators=[DataRequired()])
    notes = TextAreaField('ملاحظات', validators=[Optional()])

import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import openpyxl
from openpyxl.styles import Font, Alignment
from openpyxl.drawing.image import Image as ExcelImage
import csv
import arabic_reshaper
from bidi.algorithm import get_display
import os

def prepare_arabic_text(text):
    reshaped_text = arabic_reshaper.reshape(text)
    return get_display(reshaped_text)

def generate_pdf(data, logo_path=None):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    
    styles = getSampleStyleSheet()
    elements = []
    
    # إضافة الشعار إذا موجود
    if logo_path and os.path.exists(logo_path):
        logo = Image(logo_path, width=1.5*inch, height=1.5*inch)
        elements.append(logo)
    
    # عنوان التقرير
    title = Paragraph(prepare_arabic_text("تقرير المبيعات"), styles['Title'])
    elements.append(title)
    
    # معلومات المتجر
    store_info = Paragraph(prepare_arabic_text(f"متجر: {data['store_name']}"), styles['Normal'])
    elements.append(store_info)
    
    # ملخص المبيعات
    summary_data = [
        [prepare_arabic_text("إجمالي المبيعات"), f"${data['total_sales']:.2f}"],
        [prepare_arabic_text("عدد الطلبات"), data['orders_count']],
        [prepare_arabic_text("متوسط القيمة"), f"${data['avg_order_value']:.2f}"]
    ]
    
    summary_table = Table(summary_data)
    elements.append(summary_table)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

def generate_excel(data, logo_path=None):
    output = io.BytesIO()
    wb = openpyxl.Workbook()
    ws = wb.active
    
    # إضافة البيانات
    ws.append(["تقرير المبيعات"])
    ws.append([f"متجر: {data['store_name']}"])
    ws.append(["إجمالي المبيعات", f"${data['total_sales']:.2f}"])
    
    wb.save(output)
    output.seek(0)
    return output

def generate_csv(data):
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["تقرير المبيعات"])
    writer.writerow([f"متجر: {data['store_name']}"])
    writer.writerow(["إجمالي المبيعات", f"${data['total_sales']:.2f}"])
    
    output.seek(0)
    return output
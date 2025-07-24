# app/report_generator.py
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import openpyxl
import csv

class ReportGenerator:
    @staticmethod
    def generate_pdf(data):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        
        story = [
            Paragraph("Sales Report", styles['Title']),
            Paragraph(f"Total Sales: ${data['total_sales']:.2f}", styles['Normal']),
            Paragraph(f"Orders Count: {data['orders_count']}", styles['Normal'])
        ]
        
        doc.build(story)
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_excel(data):
        output = io.BytesIO()
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(["Sales Report"])
        ws.append(["Total Sales", f"${data['total_sales']:.2f}"])
        ws.append(["Orders Count", data['orders_count']])
        wb.save(output)
        output.seek(0)
        return output

    @staticmethod
    def generate_csv(data):
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Sales Report"])
        writer.writerow(["Total Sales", f"${data['total_sales']:.2f}"])
        writer.writerow(["Orders Count", data['orders_count']])
        output.seek(0)
        return output
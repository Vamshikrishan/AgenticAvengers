from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

def generate_plan_pdf(plan):
    file_path = "daily_plan.pdf"
    doc = SimpleDocTemplate(file_path, pagesize=A4)

    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("<b>AI Life Copilot – Daily Schedule</b>", styles["Title"]))
    elements.append(Paragraph("<br/>", styles["Normal"]))

    table_data = [["Time", "Activity"]]

    for item in plan:
        table_data.append([item["time"], item["task"]])

    table = Table(table_data, colWidths=[120, 350])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#5b6cff")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("BACKGROUND", (0,1), (-1,-1), colors.whitesmoke),
    ]))

    elements.append(table)
    doc.build(elements)
    return file_path

from openpyxl import Workbook

workbook = Workbook()
sheet = workbook.active 

sheet["A1"] = "Company"
sheet["B1"] = "Role"
sheet["C1"] = "Date"
sheet["D1"] = "Status"

workbook.save(filename="internships.xlsx")



# Bulk Upload Plan: Products & Categories

To allow you to quickly add hundreds of products at once, we will build a Bulk Upload feature in your Admin Dashboard. 

## 1. File Format
We will support **CSV files** (Comma Separated Values) because they are lightweight and can be easily exported from Excel, Google Sheets, or any inventory software. 

Your CSV should have the following column headers:
- `SKU` (Required, must be unique)
- `Name` (Required)
- `Image URL` (Optional)
- `Category` (Required - this is the *name* of the category, e.g., "Necklaces")

## 2. How the Upload Process Will Work
When you upload the file in the Admin Dashboard, the system will do the following:

**Step 1: Read & Parse**
The system reads the spreadsheet and checks that all required columns are present.

**Step 2: Validation & Error Handling**
Before saving anything to the database, the system will scan the file for errors:
- **Missing Data:** It will flag any row that is missing a SKU, Name, or Category.
- **Duplicate SKUs:** It will check if any SKUs are duplicated inside the file itself to prevent database crashes.

**Step 3: Smart Category Handling (The Edge Case)**
You mentioned the edge case where a product in the Excel file belongs to a category that *does not exist* in your database yet (e.g., a typo like "Necklces", or a brand new category like "Rings").
- **Our Solution:** We will **auto-detect and auto-create missing categories**. 
- The system will compare the categories in your Excel file against the existing categories in your database. 
- If it finds new ones, it will automatically create them in the database first, retrieve their new IDs, and then link them to the products. You won't have to manually create categories beforehand!

**Step 4: Bulk Insertion**
Once the data is validated and categories are linked, the system will push all the products to the database in one single, fast request. 

## 3. UI Updates in Admin Dashboard
- We will add a **"Bulk Upload Products (CSV)"** section next to the single "Add Product" form.
- It will have a file selection button and a small button to **"Download Template"** so you know exactly how to format your Excel file.
- We will add a status box to show you exactly what happened (e.g., *✅ Added 150 products and auto-created 2 new categories*).

---
**Do you approve of this workflow? Especially the part where we automatically create missing categories, or would you prefer it to throw an error and force you to create them manually first?**

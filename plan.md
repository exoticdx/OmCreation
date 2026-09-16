# Scalable Catalogue Architecture Plan

## Goal Description
To achieve the goal of delivering a customized digital catalogue for any client within 24 hours, we need a **Generic Backend** combined with a **Configuration-Driven Frontend**. 

Instead of modifying the database schema every time a client needs a new field (like "stitches" for embroidery or "karats" for jewelry), the database will simply accept flexible data. The frontend will dynamically generate filters, sorting options, and product details based on a single configuration file.

## Core Strategy: The EAV / JSONB Approach

### 1. Database: Generic `attributes` Column
We will modify the `Product` table in Supabase to include a single new column: `attributes` (Type: JSONB).
- **Why?** JSONB allows us to store an unlimited number of custom fields inside a single product without ever changing the backend code or running complex database migrations again.
- *Example Data stored in DB:* `{"stitches": 5000, "fabric": "Silk", "color": "Red"}`

### 2. Frontend: `store.config.ts`
We will introduce a central configuration file in the Next.js app. When you get a new client, you simply edit this one file. The entire frontend (Filters, Sorting, Product Cards, and Admin Upload) will automatically adapt.

```typescript
// Example: src/config/store.config.ts
export const STORE_CONFIG = {
  customFields: [
    { 
      key: 'stitches', 
      label: 'Stitch Count', 
      type: 'number', 
      isFilterable: true, 
      isSortable: true 
    },
    { 
      key: 'fabric', 
      label: 'Fabric', 
      type: 'select', 
      options: ['Cotton', 'Silk', 'Polyester'],
      isFilterable: true, 
      isSortable: false 
    }
  ]
};
```

### 3. Automated UI Generation
Based on `store.config.ts`, the frontend components will be updated to be completely dynamic:
- **Admin Bulk Upload:** The CSV parser will automatically look for columns named "Stitch Count" and "Fabric" and pack them into the `attributes` JSON payload.
- **Admin Add Product:** The form will dynamically loop through the config and render a number input for `stitches` and a dropdown for `fabric`.
- **Catalogue Sidebar (Filters):** Will automatically generate a Range Slider for `stitches` and Checkboxes for `fabric`.
- **Catalogue Sorting:** Will automatically add "Sort by Stitch Count (High to Low)" to the sort dropdown.
- **Product Cards / Modals:** Will automatically loop through and display the attributes: `Stitch Count: 5000`.

## User Review Required
> [!IMPORTANT]
> **Database Execution:** Because we are bypassing Prisma and using Supabase directly, you will need to run a 1-line SQL command in your Supabase SQL Editor to add the `attributes` column. I will provide the exact command. 
> 
> **Does storing the field definitions in a frontend configuration file (`store.config.ts`) work for your workflow?** 
> *Pros:* Deploying for a new client takes 5 minutes (just edit the file and deploy). 
> *Cons:* The client cannot create brand new fields themselves from the admin dashboard (they would need to ask you to add it to the code). If you want the *client* to be able to create new fields dynamically, we will need to store the configuration in the database instead.

## Proposed Changes

### Database Layer
- Provide SQL to run in Supabase: `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "attributes" JSONB DEFAULT '{}'::jsonb;`

### Configuration Layer
#### [NEW] `src/config/store.config.ts`
Create the schema definition file.

### Backend Actions (`src/app/actions.ts`)
#### [MODIFY] `addProduct` & `bulkAddProducts`
Update the insertion logic to accept the dynamic `attributes` JSON object and save it to the database.

### Frontend Components
#### [MODIFY] `src/app/admin/AdminDashboard.tsx`
- Update the single product form to loop through `STORE_CONFIG.customFields` and render the appropriate inputs.
- Update the CSV parser to map dynamic columns to the `attributes` JSON object.

#### [MODIFY] `src/components/CatalogueClient.tsx`
- Build a dynamic Sidebar Filter component.
- Build a dynamic Sort Dropdown.
- Apply filtering and sorting logic to the displayed products based on `product.attributes`.

#### [MODIFY] `src/components/ProductCard.tsx` & `InquiryModal.tsx`
- Loop through and render the dynamic fields elegantly on the UI.

## Verification Plan
1. **Database:** I will wait for you to confirm you ran the SQL command.
2. **Admin Test:** I will verify that the Admin dashboard correctly displays dynamic inputs and uploads to Supabase.
3. **Filter Test:** I will verify that sorting by a custom number field (like stitches) correctly orders the products in the UI.

# DNA Lab Management System - Quick Start

## What Has Been Built

A complete, production-ready Next.js application for DNA laboratory management with:
- Professional login system (email/password authentication)
- Admin dashboard with sidebar navigation
- Species management (add, edit, delete)
- Customer management (add, edit, delete with details)
- Order management (create, view, edit, delete, filter)
- PDF and Excel export functionality
- Professional invoice generation
- Office settings configuration
- Fully responsive UI with Tailwind CSS

## Installation (5 Minutes)

### 1. Get MongoDB URI
- Go to https://www.mongodb.com/cloud/atlas
- Create free account and cluster
- Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dna-lab`

### 2. Setup Environment
```bash
# Create .env.local
echo "MONGODB_CONNECTION_STRING=mongodb+srv://user:pass@cluster.mongodb.net/dna-lab" > .env.local
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
```

### 3. Install & Run
```bash
pnpm install
node scripts/init-admin.mjs  # Create admin user
pnpm dev
```

### 4. Login
- Navigate to http://localhost:3000/login
- Use credentials created during init-admin script

## Default Demo Login
- Email: admin@example.com
- Password: password123 (if using defaults)

## Folder Structure

- `/app` - Next.js App Router
  - `/(auth)` - Authentication pages
  - `/api` - API endpoints
  - `/dashboard` - Protected dashboard pages
- `/lib` - Database models and utilities
- `/components` - Reusable React components
- `/scripts` - Setup scripts

## Key Endpoints

**Dashboard Pages:**
- `/login` - Login page
- `/dashboard` - Dashboard home
- `/dashboard/species` - Species management
- `/dashboard/customers` - Customer management
- `/dashboard/orders` - Order management
- `/dashboard/settings` - Settings

**API Routes:**
- `POST /api/species` - Create species
- `GET /api/species` - List species
- `GET/PUT/DELETE /api/species/[id]` - Manage single species
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `GET/PUT/DELETE /api/customers/[id]` - Manage single customer
- `POST /api/orders` - Create order
- `GET /api/orders` - List/filter orders
- `GET/PUT/DELETE /api/orders/[id]` - Manage single order
- `POST /api/orders/export-pdf` - Export to PDF
- `POST /api/orders/export-excel` - Export to Excel
- `POST /api/orders/generate-invoice` - Generate invoice
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## Features Overview

### Authentication
- Secure email/password login
- Session-based with NextAuth.js
- Protected dashboard routes via middleware
- Password hashing with bcryptjs

### Species Management
- Full CRUD (Create, Read, Update, Delete)
- Auto-generated unique IDs
- List with search functionality
- Database persistence

### Customer Management
- Track customer details:
  - Name, phone, address, farm name
- Search and filter customers
- Full CRUD operations
- Database persistence

### Order Management
- **Auto-increment DNA ID** (database-generated)
- Create orders with:
  - Species selection (searchable dropdown)
  - Customer selection (searchable dropdown)
  - Entry date
  - Status (Pending, Processing, Completed, Failed)
  - Sex (Male, Female, Unknown)
  - Notes
- **Filter orders by:**
  - Status
  - Customer name
  - Species
  - Date range
- **Export to PDF** (single or batch)
- **Export to Excel**
- **Generate invoices** with office details
- **Print support**

### Settings
- Configure office information:
  - Name, address, phone, email, logo
- Settings appear on all invoices
- Database persistence

### Dashboard
- Statistics overview:
  - Total species count
  - Total customers count
  - Total orders count
  - Recent orders list
- Navigation to all sections
- Professional design

## Database Schema

Three main collections after initialization:

1. **users** - Admin and user accounts
2. **species** - Laboratory species
3. **customers** - Customer information
4. **orders** - Lab orders with auto-increment DNA IDs
5. **settings** - Office configuration
6. **counters** - Used for DNA ID auto-increment

## Project Files Created

### Core Application Files:
- `app/(auth)/login/page.tsx` - Login page
- `app/dashboard/layout.tsx` - Dashboard layout
- `app/dashboard/page.tsx` - Dashboard home
- `app/dashboard/species/page.tsx` - Species management
- `app/dashboard/customers/page.tsx` - Customer management
- `app/dashboard/orders/page.tsx` - Order management with filtering
- `app/dashboard/settings/page.tsx` - Settings management

### API Routes:
- `app/api/species/route.ts` - Species CRUD
- `app/api/species/[id]/route.ts` - Single species operations
- `app/api/customers/route.ts` - Customer CRUD
- `app/api/customers/[id]/route.ts` - Single customer operations
- `app/api/orders/route.ts` - Order CRUD and filtering
- `app/api/orders/[id]/route.ts` - Single order operations
- `app/api/orders/export-pdf/route.ts` - PDF export
- `app/api/orders/export-excel/route.ts` - Excel export
- `app/api/orders/generate-invoice/route.ts` - Invoice generation
- `app/api/settings/route.ts` - Settings management

### Component Files:
- `components/auth/LoginForm.tsx` - Login form
- `components/dashboard/Sidebar.tsx` - Navigation sidebar
- `components/dashboard/Header.tsx` - Top header
- `components/forms/SpeciesForm.tsx` - Species form
- `components/forms/CustomerForm.tsx` - Customer form
- `components/forms/OrderForm.tsx` - Order form with validation
- `components/forms/SettingsForm.tsx` - Settings form

### Database/Config:
- `lib/db.ts` - MongoDB connection
- `lib/auth.ts` - NextAuth configuration
- `lib/models/User.ts` - User schema
- `lib/models/Species.ts` - Species schema
- `lib/models/Customer.ts` - Customer schema
- `lib/models/Order.ts` - Order schema with DNA ID
- `lib/models/Settings.ts` - Settings schema
- `lib/utils/counter.ts` - DNA ID counter utility
- `lib/utils/validators.ts` - Zod validation schemas

### Scripts:
- `scripts/init-admin.mjs` - Database initialization and admin creation

## Technology Stack Used

- **Framework**: Next.js 16 with App Router
- **Database**: MongoDB Atlas + Mongoose ORM
- **Authentication**: NextAuth.js v5 (email/password)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Exports**: jsPDF (PDF), SheetJS (Excel)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Security**: bcryptjs
- **HTTP Client**: Built-in fetch API

## Customization

### Change Login Credentials
After first login, use the Settings page to configure your office details.

### Add More Fields
1. Update the Mongoose schema in `/lib/models/`
2. Update the form component in `/components/forms/`
3. Update the API route validation

### Change Colors
Edit `app/globals.css` to modify the color theme (currently blue primary #2563eb)

### Add New Features
1. Create API route in `/app/api/`
2. Create model in `/lib/models/`
3. Create component in `/components/`
4. Create page in `/app/dashboard/`

## Troubleshooting

**MongoDB Connection Error:**
- Verify MONGODB_CONNECTION_STRING in .env.local
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure username/password are URL-encoded

**Login Not Working:**
- Check that init-admin script completed successfully
- Verify database contains user document
- Clear browser cookies and try again

**Build Errors:**
- Delete `.next` folder
- Run `pnpm install` again
- Restart dev server

## Production Deployment

### On Vercel:
1. Push code to GitHub
2. Connect Vercel to GitHub repo
3. Add environment variables:
   - MONGODB_CONNECTION_STRING
   - NEXTAUTH_SECRET (new random value)
   - NEXTAUTH_URL (your domain)
4. Deploy

### On Other Platforms:
1. Set environment variables
2. Run `pnpm build`
3. Run `pnpm start`

## Support Resources

- **README.md** - Overview and features
- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Architecture and implementation details
- **Code comments** - Inline documentation

## Next Steps

1. Complete the setup (MongoDB URI configuration)
2. Run the initialization script to create your admin user
3. Login to the dashboard
4. Add species and customers
5. Start creating orders
6. Generate reports and exports

The application is fully functional and ready to use!

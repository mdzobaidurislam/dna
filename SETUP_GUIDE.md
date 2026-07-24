# DNA Lab Management System - Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- pnpm installed

## Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or sign in
3. Create a new cluster (free tier is sufficient)
4. Click "Connect" and get your connection string
5. Replace `<username>` and `<password>` with your database credentials
6. The format should be: `mongodb+srv://username:password@cluster.mongodb.net/dna-lab?retryWrites=true&w=majority`

## Step 2: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your MongoDB URI:
   ```
   MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/dna-lab?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. Generate a secret for NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

## Step 3: Install Dependencies

```bash
pnpm install
```

## Step 4: Initialize Database

Run the admin initialization script to create the first admin user:

```bash
node scripts/init-admin.mjs
```

You'll be prompted to enter:
- Admin name (default: Admin)
- Admin email (default: admin@example.com)
- Admin password (required, min 8 characters recommended)

## Step 5: Start the Development Server

```bash
pnpm dev
```

The application will be available at http://localhost:3000

## Step 6: Login

Navigate to the login page and use the credentials you set during initialization.

## Default Demo Credentials (if using default settings)

- Email: admin@example.com
- Password: password123 (change this in production!)

## Project Features

### 1. Authentication
- Email/password login with NextAuth.js
- Session-based authentication
- Protected dashboard routes

### 2. Species Management
- Add, edit, and delete species
- List all species with search functionality
- Full CRUD operations

### 3. Customer Management
- Add, edit, and delete customers
- Customer details: name, phone, address, farm name
- Full CRUD operations
- Search functionality

### 4. Order Management
- Create, view, edit, and delete orders
- Order details:
  - Auto-increment DNA ID
  - Species selection
  - Customer selection
  - Entry date
  - Status (Pending, Processing, Completed, Failed)
  - Sex (Male, Female, Unknown)
  - Notes
- Filter orders by:
  - Status
  - Customer
  - Species
  - Date range
- Export to PDF (individual or multiple)
- Export to Excel
- Generate professional invoices
- Print orders

### 5. Settings
- Configure office information:
  - Office name
  - Office address
  - Office phone
  - Office email
  - Company logo
- Settings appear on all generated invoices and reports

### 6. Dashboard
- Overview statistics
- Quick access to all management sections
- Professional UI design

## API Endpoints

### Species
- `GET /api/species` - List all species
- `POST /api/species` - Create new species
- `PUT /api/species/[id]` - Update species
- `DELETE /api/species/[id]` - Delete species

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Orders
- `GET /api/orders` - List orders with filtering
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order
- `POST /api/orders/export-pdf` - Export to PDF
- `POST /api/orders/export-excel` - Export to Excel
- `POST /api/orders/generate-invoice` - Generate invoice

### Settings
- `GET /api/settings` - Get office settings
- `PUT /api/settings` - Update office settings

## File Structure

```
/app
  /(auth)
    /login - Login page
  /api
    /auth - NextAuth routes
    /species - Species API routes
    /customers - Customer API routes
    /orders - Order API routes
    /settings - Settings API routes
  /dashboard
    /page.tsx - Dashboard home
    /species - Species management
    /customers - Customer management
    /orders - Order management
    /settings - Settings management

/lib
  /models - Mongoose schemas
  /db.ts - Database connection
  /auth.ts - NextAuth configuration
  /utils - Helper functions

/components
  /auth - Authentication components
  /dashboard - Dashboard components
  /forms - Form components
```

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure MONGODB_CONNECTION_STRING is set in `.env.local`

### Authentication Issues
- Clear browser cookies and try again
- Verify NEXTAUTH_SECRET is set and is a long random string
- Check that the database contains user records

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Restart dev server

## Deployment

### To Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `MONGODB_CONNECTION_STRING`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your deployed URL)
4. Deploy

### Environment Variables for Production

```
MONGODB_CONNECTION_STRING=your-production-mongodb-uri
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

## Support

For issues, check the README.md file or review the error logs in the console.

## Security Notes

1. Always use strong passwords
2. Change NEXTAUTH_SECRET in production
3. Use HTTPS in production
4. Keep credentials secure
5. Regularly backup your database
6. Enable MongoDB Atlas authentication

## Performance Tips

1. Database indexes are created on frequently queried fields
2. Use filters to limit data loaded
3. Generate PDFs/Excel for large exports
4. Monitor database usage in MongoDB Atlas

## Future Enhancements

- User role management
- Multi-user support
- Audit logging
- Advanced reporting
- API documentation
- Mobile app

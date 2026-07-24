# DNA Lab Management System

A comprehensive Next.js 16 application for managing DNA lab operations including species management, customer database, order processing with auto-incrementing DNA IDs, and professional reporting with PDF/Excel exports.

## Features

### 1. Authentication
- Email/password authentication with NextAuth.js
- Secure password hashing with bcryptjs
- Protected routes and session management
- Professional login interface

### 2. Species Management
- Add, edit, and delete species
- Search functionality
- Database persistence with MongoDB

### 3. Customer Management
- Manage customer information (name, phone, address, farm name)
- Search by name or farm
- Full CRUD operations

### 4. Order Management
- Create orders with auto-incrementing DNA IDs
- Link to species and customers via dropdowns with search
- Order status tracking (pending, processing, completed, rejected)
- Track sex information (male, female, unknown)
- Add notes to orders
- Date range filtering
- Status-based filtering

### 5. Reporting & Exports
- **PDF Export**: Generate batch PDF reports of orders
- **Excel Export**: Download orders as formatted Excel spreadsheets
- **Invoice Generation**: Professional invoices with office branding
- All exports include timestamp and formatted data

### 6. Settings Management
- Configure office information (name, address, phone, email)
- Manage logo for invoices
- Display settings on all generated documents

### 7. Dashboard
- Overview statistics (total orders, customers, species, pending)
- Quick navigation to all features
- Clean, modern interface

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: NextAuth.js v5 (Beta)
- **UI**: Tailwind CSS + shadcn/ui components
- **Export Libraries**: jsPDF (PDF) + SheetJS/XLSX (Excel)
- **Date Handling**: date-fns
- **Form Validation**: Zod
- **Icons**: Lucide React

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository>
cd dna-lab-system
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file with your MongoDB Atlas credentials:

```env
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/dna?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Initialize Admin User

Run the initialization script to create the first admin user:

```bash
node scripts/init-admin.mjs
```

Follow the prompts to create your admin account.

**Or use demo credentials (already in database after first setup):**
- Email: `admin@example.com`
- Password: `password123`

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users
```
- email (unique)
- password (hashed)
- name
- createdAt
- updatedAt
```

### Species
```
- name (unique)
- description
- createdAt
- updatedAt
```

### Customers
```
- name (required)
- phone
- address
- farm_name
- createdAt
- updatedAt
```

### Orders
```
- dna_id (auto-increment, unique)
- name
- species_id (reference to Species)
- customer_id (reference to Customer)
- entry_date
- status (pending, processing, completed, rejected)
- sex (male, female, unknown)
- notes
- createdAt
- updatedAt
```

### Settings (Single Document)
```
- _id: "default"
- office_name
- office_address
- office_phone
- office_email
- logo_url
- updatedAt
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

### Species
- `GET /api/species` - List all species
- `POST /api/species` - Create species
- `GET /api/species/[id]` - Get species detail
- `PUT /api/species/[id]` - Update species
- `DELETE /api/species/[id]` - Delete species

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer detail
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Orders
- `GET /api/orders` - List orders (supports filters: status, customer_id, species_id, startDate, endDate)
- `POST /api/orders` - Create order (DNA ID auto-generated)
- `GET /api/orders/[id]` - Get order detail
- `PUT /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order
- `POST /api/orders/export-pdf` - Export orders to PDF
- `POST /api/orders/export-excel` - Export orders to Excel
- `POST /api/orders/generate-invoice` - Generate single order invoice

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## Usage Guide

### Creating Your First Order

1. **Login** with your admin credentials
2. **Add Species** (if not already created)
   - Navigate to Species
   - Click "Add Species"
   - Enter species name and optional description
3. **Add Customers** (if not already created)
   - Navigate to Customers
   - Click "Add Customer"
   - Fill in customer details
4. **Create Order**
   - Navigate to Orders
   - Click "New Order"
   - Select species from dropdown (with search)
   - Select customer from dropdown (with search)
   - Set entry date
   - Choose status and sex
   - Submit
   - DNA ID is automatically generated

### Generating Reports

1. **Single Invoice**
   - Go to Orders list
   - Click the PDF icon on an order
   - Invoice downloads with office branding

2. **Batch Export**
   - Select one or more orders with checkboxes
   - Click "Export PDF" or "Export Excel"
   - File downloads with current data

3. **Filtering Before Export**
   - Use filters to narrow down orders
   - Select specific date ranges
   - Filter by status or customer
   - Then select and export

### Configuring Settings

1. Navigate to Settings
2. Enter your office information
3. Update phone and email
4. Settings automatically appear on generated invoices

## DNA ID Auto-Increment

The DNA ID is automatically generated using MongoDB's counter pattern:
- Sequential numbering (1, 2, 3, ...)
- Unique per order
- Cannot be manually changed
- Starts from 1 on first order

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- NextAuth.js CSRF protection
- Protected API routes with session verification
- MongoDB injection prevention via Mongoose
- Input validation with Zod schemas
- Server-side data validation

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
4. Deploy

### Deploy to Other Platforms

Ensure Node.js 18+ is available and set all environment variables.

## Troubleshooting

### MongoDB Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (add your IP or 0.0.0.0)
- Ensure database user has correct permissions

### NextAuth Errors
- Generate new NEXTAUTH_SECRET with `openssl rand -base64 32`
- Set NEXTAUTH_URL to your exact domain
- Clear browser cookies if session issues persist

### Export Errors
- Ensure orders are properly populated with species and customer data
- Check browser console for detailed error messages
- Verify settings are configured for invoice generation

## Project Structure

```
/app
  /api           # API routes
  /dashboard     # Protected dashboard pages
  /(auth)        # Authentication pages
/components
  /auth          # Authentication components
  /dashboard     # Dashboard components
  /forms         # Reusable form components
  /ui            # shadcn/ui components
/lib
  /db.ts         # MongoDB connection
  /auth.ts       # NextAuth configuration
  /models        # Mongoose schemas
  /utils         # Helper functions
/public          # Static assets
/scripts         # Setup and utility scripts
```

## Performance Optimization

- Server-side data fetching for initial loads
- Client-side caching with React hooks
- Optimized PDF generation
- Efficient MongoDB queries with proper indexing
- Image optimization in next.config.mjs

## License

This project is provided as-is for DNA lab management purposes.

## Support

For issues or questions, check the implementation in the codebase or review the API documentation above.

---

**Created with Next.js 16, MongoDB, and Tailwind CSS**

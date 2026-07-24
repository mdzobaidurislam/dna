# DNA Lab Management System - Testing Checklist

## Pre-Testing Setup

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained and verified
- [ ] `.env.local` file created with MONGODB_CONNECTION_STRING, NEXTAUTH_SECRET, NEXTAUTH_URL
- [ ] Dependencies installed (`pnpm install`)
- [ ] Admin user created (`node scripts/init-admin.mjs`)
- [ ] Dev server running (`pnpm dev`)

## Authentication Testing

### Login Page
- [ ] Login page loads at `/login`
- [ ] Form fields render: Email, Password, Sign In button
- [ ] Demo credentials displayed on page
- [ ] Page styling is professional and responsive

### Login Functionality
- [ ] Invalid email/password shows error
- [ ] Valid credentials redirect to dashboard
- [ ] Session cookie created after login
- [ ] Session persists on page refresh
- [ ] User cannot access dashboard without login
- [ ] Logged-in user redirected from `/login` to `/dashboard`

### Logout
- [ ] Logout button visible in header
- [ ] Clicking logout clears session
- [ ] User redirected to login page after logout
- [ ] Session cookie removed

### Protected Routes
- [ ] Direct access to `/dashboard` without login redirects to `/login`
- [ ] All dashboard sub-routes require authentication

## Dashboard Testing

### Dashboard Page
- [ ] Dashboard loads successfully
- [ ] Dashboard layout with sidebar and header renders
- [ ] Statistics cards display:
  - [ ] Total Species count
  - [ ] Total Customers count
  - [ ] Total Orders count
  - [ ] Recent Orders list

### Sidebar Navigation
- [ ] Sidebar visible on left
- [ ] Navigation links present:
  - [ ] Dashboard
  - [ ] Species
  - [ ] Customers
  - [ ] Orders
  - [ ] Settings
- [ ] Active link highlighting works
- [ ] Links navigate to correct pages

### Header
- [ ] User name displayed
- [ ] Logout button present and working

## Species Management Testing

### Species List Page
- [ ] Page loads at `/dashboard/species`
- [ ] Page title displays "Species Management"
- [ ] "Add New Species" button visible
- [ ] Species table displays with columns: Name, Description, Actions
- [ ] Search functionality works (filter by name)
- [ ] Empty state message when no species exist

### Create Species
- [ ] Click "Add New Species" opens form modal
- [ ] Form fields: Name (required), Description
- [ ] Submit button creates new species
- [ ] Success message displays
- [ ] New species appears in list immediately
- [ ] Form validates name uniqueness
- [ ] Form clears after successful submission

### Edit Species
- [ ] Click edit icon opens form with pre-filled data
- [ ] Name field is populated correctly
- [ ] Description field is populated correctly
- [ ] Submit updates species in database
- [ ] Success message displays
- [ ] Updated species appears in list

### Delete Species
- [ ] Click delete icon shows confirmation dialog
- [ ] Confirmation dialog has cancel option
- [ ] Confirming delete removes species from database
- [ ] Success message displays
- [ ] Species disappears from list

## Customer Management Testing

### Customer List Page
- [ ] Page loads at `/dashboard/customers`
- [ ] Page title displays "Customer Management"
- [ ] "Add New Customer" button visible
- [ ] Customer table displays columns: Name, Phone, Address, Farm Name, Actions
- [ ] Search functionality works (filter by name or farm)
- [ ] Empty state message when no customers exist

### Create Customer
- [ ] Click "Add New Customer" opens form modal
- [ ] Form fields: Name (required), Phone, Address, Farm Name
- [ ] All form fields accept input correctly
- [ ] Submit button creates new customer
- [ ] Success message displays
- [ ] New customer appears in list immediately
- [ ] Form clears after successful submission

### Edit Customer
- [ ] Click edit icon opens form with pre-filled data
- [ ] All fields are populated correctly
- [ ] Submit updates customer in database
- [ ] Success message displays
- [ ] Updated customer appears in list

### Delete Customer
- [ ] Click delete icon shows confirmation dialog
- [ ] Confirmation dialog has cancel option
- [ ] Confirming delete removes customer from database
- [ ] Success message displays
- [ ] Customer disappears from list

## Order Management Testing

### Order List Page
- [ ] Page loads at `/dashboard/orders`
- [ ] Page title displays "Order Management"
- [ ] "Add New Order" button visible
- [ ] Order table displays columns: DNA ID, Species, Customer, Date, Status, Actions

### Order Search & Filter
- [ ] Filter by Status dropdown works
- [ ] Filter by Customer dropdown works
- [ ] Filter by Species dropdown works
- [ ] Date range picker filters by entry date
- [ ] Multiple filters can be applied simultaneously
- [ ] Filter results update list immediately
- [ ] Clear filters resets list to all orders
- [ ] DNA ID search works

### Create Order
- [ ] Click "Add New Order" opens form modal
- [ ] Form fields present and required:
  - [ ] DNA ID (auto-filled, read-only)
  - [ ] Species (dropdown with search)
  - [ ] Customer (dropdown with search)
  - [ ] Entry Date (date picker)
  - [ ] Status (dropdown: Pending, Processing, Completed, Failed)
  - [ ] Sex (dropdown: Male, Female, Unknown)
  - [ ] Notes (textarea)
- [ ] DNA ID is auto-incremented (starts at 1, increments by 1)
- [ ] Species dropdown searchable
- [ ] Customer dropdown searchable
- [ ] Submit creates order with all details
- [ ] Success message displays
- [ ] New order appears in list with correct DNA ID

### Order Details
- [ ] Clicking order row or edit icon opens edit form
- [ ] All order details display correctly
- [ ] DNA ID displayed (read-only)
- [ ] Species name displays correctly
- [ ] Customer name displays correctly
- [ ] Entry date displays in correct format
- [ ] Status displays correctly
- [ ] Sex displays correctly
- [ ] Notes display correctly

### Edit Order
- [ ] Edit form opens with pre-filled data
- [ ] All fields can be edited (except DNA ID)
- [ ] Submit updates order in database
- [ ] Success message displays
- [ ] Updated order appears in list with new data

### Delete Order
- [ ] Click delete icon shows confirmation dialog
- [ ] Confirmation dialog has cancel option
- [ ] Confirming delete removes order from database
- [ ] Success message displays
- [ ] Order disappears from list
- [ ] DNA ID counter is NOT reset (auto-increment continues)

### Order Status Workflow
- [ ] Create order with "Pending" status
- [ ] Edit order to "Processing" status
- [ ] Edit order to "Completed" status
- [ ] Edit order to "Failed" status
- [ ] Filter by each status shows correct orders

### Date Range Filtering
- [ ] Select date range filters orders correctly
- [ ] Orders outside range are hidden
- [ ] Orders within range are shown
- [ ] Start date and end date work independently

## Settings Testing

### Settings Page
- [ ] Page loads at `/dashboard/settings`
- [ ] Page title displays "Office Settings"
- [ ] Settings form displays with fields:
  - [ ] Office Name
  - [ ] Office Address
  - [ ] Office Phone
  - [ ] Office Email
  - [ ] Logo URL

### Save Settings
- [ ] Enter office information
- [ ] Click Save button
- [ ] Success message displays
- [ ] Settings persist after page reload
- [ ] Settings persist after logout/login

### Verify Settings on Invoice
- [ ] Create an order
- [ ] Generate invoice for the order
- [ ] Invoice displays saved office information
- [ ] Logo appears on invoice if URL is set

## Export & Reporting Testing

### PDF Export
- [ ] Select single order or multiple orders
- [ ] Click "Export to PDF" button
- [ ] PDF downloads successfully
- [ ] PDF contains order details:
  - [ ] DNA ID
  - [ ] Species name
  - [ ] Customer name
  - [ ] Entry date
  - [ ] Status
  - [ ] Sex
  - [ ] Notes
- [ ] PDF is formatted professionally
- [ ] Multiple orders export correctly in single PDF

### Excel Export
- [ ] Select single order or multiple orders
- [ ] Click "Export to Excel" button
- [ ] Excel file downloads successfully
- [ ] Excel file opens in spreadsheet application
- [ ] Excel contains columns:
  - [ ] DNA ID
  - [ ] Species
  - [ ] Customer
  - [ ] Date
  - [ ] Status
  - [ ] Sex
  - [ ] Notes
- [ ] Data is formatted correctly
- [ ] Multiple orders export to separate rows

### Invoice Generation
- [ ] Navigate to order
- [ ] Click "Generate Invoice" button
- [ ] Invoice PDF downloads
- [ ] Invoice contains:
  - [ ] Office name
  - [ ] Office address
  - [ ] Office phone
  - [ ] Office email
  - [ ] Order details
  - [ ] Species information
  - [ ] Customer information
  - [ ] Professional formatting
  - [ ] Dates formatted correctly
- [ ] Invoice displays logo if configured
- [ ] Invoice is printable

### Print Function
- [ ] Open order page
- [ ] Press Ctrl+P (or Cmd+P on Mac)
- [ ] Print preview displays correctly
- [ ] Prints without styling issues

## Data Persistence Testing

### Database Persistence
- [ ] Add species, refresh page, species still exists
- [ ] Add customer, refresh page, customer still exists
- [ ] Add order, refresh page, order still exists
- [ ] Edit order, refresh page, changes persist
- [ ] Change settings, refresh page, settings persist

### Session Persistence
- [ ] Login to application
- [ ] Close browser tab
- [ ] Return to http://localhost:3000
- [ ] User remains logged in
- [ ] Session expires after reasonable time (24 hours default)

## Validation Testing

### Form Validation
- [ ] Submit empty required fields shows error
- [ ] Email format validation works on login
- [ ] Password field masks input
- [ ] Species dropdown requires selection
- [ ] Customer dropdown requires selection
- [ ] Entry date is required

### Data Integrity
- [ ] Cannot create species with duplicate names
- [ ] Cannot delete species with linked orders (or show warning)
- [ ] Cannot delete customer with linked orders (or show warning)
- [ ] DNA ID remains unique and sequential

## Performance Testing

### Load Times
- [ ] Login page loads within 2 seconds
- [ ] Dashboard loads within 2 seconds
- [ ] Species list loads within 1 second
- [ ] Customer list loads within 1 second
- [ ] Orders list loads within 2 seconds (with many records)
- [ ] PDF export completes within 3 seconds
- [ ] Excel export completes within 2 seconds

### Network
- [ ] API endpoints respond with appropriate status codes
- [ ] Error responses are handled gracefully
- [ ] Network errors show user-friendly messages
- [ ] Timeout handling works (shows error after 30 seconds)

## UI/UX Testing

### Responsive Design
- [ ] Desktop view (1920x1080) renders correctly
- [ ] Tablet view (768x1024) renders correctly
- [ ] Mobile view (375x667) renders correctly
- [ ] Sidebar collapses on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Forms are usable on mobile

### Accessibility
- [ ] All form labels associated with inputs
- [ ] Tab navigation works through form fields
- [ ] Keyboard shortcuts work (Enter to submit)
- [ ] Color contrast meets WCAG standards
- [ ] Alt text present on images

### Visual Design
- [ ] Color scheme is consistent
- [ ] Typography is professional
- [ ] Spacing and padding look balanced
- [ ] Icons render correctly
- [ ] Buttons have hover states
- [ ] Links are understandable

## Error Handling Testing

### Invalid Inputs
- [ ] Submit form with invalid email shows error
- [ ] Submit form with weak password shows message
- [ ] Submit form with special characters handles correctly
- [ ] Very long inputs truncate gracefully

### Database Errors
- [ ] Connection lost error handled gracefully
- [ ] Duplicate key error shows user-friendly message
- [ ] Query timeout shows error message

### Network Errors
- [ ] No internet connection shows error
- [ ] API unavailable shows error message
- [ ] Request timeout shows error message

## Security Testing

### Authentication
- [ ] Password stored as hash (never plaintext)
- [ ] Session token cannot be guessed
- [ ] CSRF token present on forms
- [ ] XSS prevention (test with <script> tag input)
- [ ] SQL injection prevention (test with SQL commands)

### Authorization
- [ ] Cannot directly access other users' data
- [ ] API enforces authentication on all endpoints
- [ ] Middleware blocks unauthenticated requests

## Documentation Testing

- [ ] README.md is complete and clear
- [ ] SETUP_GUIDE.md covers all setup steps
- [ ] QUICK_START.md provides quick reference
- [ ] PROJECT_SUMMARY.md documents architecture
- [ ] All files referenced in docs exist
- [ ] Code examples in docs are accurate

## Final Sign-Off

- [ ] All tests passed
- [ ] No critical bugs found
- [ ] No console errors in development
- [ ] Application ready for deployment
- [ ] Documentation is complete
- [ ] User can follow SETUP_GUIDE to get running

**Date Tested:** _______________

**Tested By:** _______________

**Notes:** ________________________________________________________________

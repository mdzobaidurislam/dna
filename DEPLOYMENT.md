# DNA Lab Management System - Deployment Guide

## Application Status

Your DNA Lab Management System is fully built and ready to use. The application includes:

- Complete Next.js 16 application with App Router
- MongoDB Mongoose integration for database
- NextAuth.js authentication system
- Full CRUD operations for Species, Customers, Orders
- Advanced filtering and search
- PDF and Excel export functionality
- Professional invoice generation
- Responsive UI with Tailwind CSS

## To Get Started

### Step 1: Setup MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster (M0 tier)
4. Click "Connect" and copy your connection string
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/dna-lab?retryWrites=true&w=majority`

### Step 2: Configure Environment

Create `.env.local` in the project root:

```bash
# MongoDB Connection
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/dna-lab?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=generate-a-random-secret-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

To generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 3: Initialize Database

```bash
# Install dependencies
pnpm install

# Create admin user
node scripts/init-admin.mjs
```

Follow the prompts to set your admin credentials.

### Step 4: Run Development Server

```bash
pnpm dev
```

Access at http://localhost:3000

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. Push code to GitHub
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/dna-lab.git
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_CONNECTION_STRING` - Your MongoDB Atlas connection string
   - `NEXTAUTH_SECRET` - Generate new: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production domain

5. Deploy

### Option 2: Deploy to Other Platforms

#### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t dna-lab .
docker run -p 3000:3000 -e MONGODB_CONNECTION_STRING=<your-uri> dna-lab
```

#### AWS EC2/Heroku

```bash
# Install Node.js 18+
# Clone repository
# Install dependencies
pnpm install

# Run initialization
node scripts/init-admin.mjs

# Build
pnpm build

# Start
pnpm start
```

### Option 3: Traditional VPS/Server

1. SSH into server
2. Install Node.js 18+
3. Install MongoDB or use MongoDB Atlas
4. Clone repository
5. Set environment variables in `.env` or system environment
6. Run:
   ```bash
   pnpm install
   pnpm build
   pnpm start
   ```

## Production Checklist

Before deploying:

- [ ] Change NEXTAUTH_SECRET to a new random value
- [ ] Set NEXTAUTH_URL to your production domain
- [ ] Update MONGODB_CONNECTION_STRING with production credentials
- [ ] Ensure MongoDB Atlas IP whitelist includes your server
- [ ] Test login functionality
- [ ] Test all CRUD operations
- [ ] Test exports (PDF/Excel)
- [ ] Test invoice generation
- [ ] Configure office settings with your information
- [ ] Verify SSL/HTTPS is enabled
- [ ] Setup automated backups for MongoDB

## Environment Variables

### Required
```
MONGODB_CONNECTION_STRING=<your-mongodb-connection-string>
NEXTAUTH_SECRET=<random-secret-key>
NEXTAUTH_URL=<your-deployment-url>
```

### Optional
```
NODE_ENV=production
```

## Database Backups

### MongoDB Atlas Automated Backups

1. Log into MongoDB Atlas
2. Go to Backup Section
3. Enable Automatic Backups
4. Set backup frequency and retention policy

### Manual Backup

```bash
# Export database
mongoexport --uri="<MONGODB_CONNECTION_STRING>" --collection=users --out=users.json
mongoexport --uri="<MONGODB_CONNECTION_STRING>" --collection=species --out=species.json
mongoexport --uri="<MONGODB_CONNECTION_STRING>" --collection=customers --out=customers.json
mongoexport --uri="<MONGODB_CONNECTION_STRING>" --collection=orders --out=orders.json
mongoexport --uri="<MONGODB_CONNECTION_STRING>" --collection=settings --out=settings.json
```

## Performance Optimization

### MongoDB Atlas
- Use appropriate index configuration
- Monitor performance in Atlas Dashboard
- Upgrade cluster if needed (starts at M0 free tier)

### Application
- Enable caching headers
- Optimize images
- Minify CSS/JavaScript (automatic in production build)
- Use CDN for static assets (Vercel does this automatically)

### Monitoring
- Monitor error rates
- Track API response times
- Monitor database connection pool
- Setup alerts for critical errors

## Scaling

For high-volume usage:

1. **Database**: Upgrade MongoDB cluster tier
2. **Application**: Add more server instances
3. **Caching**: Implement Redis for session/data caching
4. **CDN**: Use CDN for static content
5. **Load Balancer**: Distribute traffic across multiple instances

## Security Production Hardening

1. **SSL/HTTPS**: Enable and enforce HTTPS
2. **CORS**: Configure appropriate CORS policies
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **Input Validation**: All inputs are validated (already implemented)
5. **Database Credentials**: Use MongoDB Atlas with IAM authentication
6. **Secrets Management**: Use environment variables, not config files
7. **API Keys**: If adding APIs, store keys securely
8. **Logging**: Monitor logs for suspicious activity
9. **Backups**: Setup automated backups
10. **Updates**: Keep dependencies updated

## Troubleshooting

### MongoDB Connection Issues

**Error**: "Could not connect to MongoDB"

Solutions:
- Verify MONGODB_CONNECTION_STRING is correct
- Check IP whitelist in MongoDB Atlas (add your server IP)
- Ensure username/password are URL-encoded
- Test connection with: `mongosh "<MONGODB_CONNECTION_STRING>"`

### NextAuth Issues

**Error**: "NextAuth callback error"

Solutions:
- Verify NEXTAUTH_SECRET is set
- Ensure NEXTAUTH_URL matches your domain
- Check database connectivity
- Review NextAuth logs for details

### Performance Issues

**Symptom**: Slow page loads

Solutions:
- Check MongoDB query performance
- Verify database indexes are created
- Monitor network latency
- Check application error logs
- Review browser console for client-side errors

## Monitoring & Logging

### Application Logs

Production logs can be viewed in:
- Vercel Dashboard (if deployed on Vercel)
- Application server logs (if self-hosted)
- CloudWatch (if using AWS)

### Database Monitoring

MongoDB Atlas provides:
- Query Performance Analysis
- Database Metrics
- Slow query logs
- Real-time alerts

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- DataDog for comprehensive monitoring

## Maintenance

### Regular Tasks

- [ ] Monitor database size
- [ ] Review error logs weekly
- [ ] Update npm dependencies monthly
- [ ] Backup database daily
- [ ] Review security logs monthly
- [ ] Update OS patches as needed

### Version Updates

```bash
# Check for updates
pnpm outdated

# Update packages
pnpm update

# Update specific package
pnpm add package@latest
```

## Support & Documentation

If you encounter issues:

1. Check SETUP_GUIDE.md for setup issues
2. Review PROJECT_SUMMARY.md for architecture
3. Check README.md for feature overview
4. Review code comments for implementation details
5. Check MongoDB documentation for database issues
6. Check Next.js documentation for framework issues
7. Check NextAuth.js documentation for auth issues

## Getting Help

- Next.js Docs: https://nextjs.org/docs
- MongoDB Documentation: https://docs.mongodb.com/
- NextAuth.js Docs: https://next-auth.js.org/
- Mongoose Docs: https://mongoosejs.com/

## License

Specify your license here (MIT, Apache, etc.)

## Final Notes

The application is production-ready and fully functional. The main requirement is setting up MongoDB Atlas and configuring environment variables. After that, you can deploy to any hosting platform that supports Node.js.

Good luck with your DNA Lab Management System!

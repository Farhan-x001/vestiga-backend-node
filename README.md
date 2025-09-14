# Vestiga Backend (Node.js)

A modern Node.js backend API for the Vestiga application system, built with Express.js and MongoDB.

## Features

- 🚀 **Express.js** - Fast, unopinionated web framework
- 🍃 **MongoDB** - NoSQL database with Mongoose ODM
- 💳 **PayU Integration** - Payment processing
- 📊 **Google Sheets** - Data export and management
- 📱 **WhatsApp API** - Automated notifications
- 🔒 **Security** - Helmet, CORS, rate limiting
- 📝 **Logging** - Morgan HTTP request logger
- 🧪 **Testing** - Jest testing framework

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- PayU merchant account
- Google Cloud Platform account
- Meta WhatsApp Business API access

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd vestiga-backend-node
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your actual credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 8080) |
| `NODE_ENV` | Environment | No (default: development) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `PAYU_KEY` | PayU merchant key | Yes |
| `PAYU_SALT` | PayU salt | Yes |
| `PAYU_MERCHANT_ID` | PayU merchant ID | Yes |
| `GOOGLE_SHEETS_CREDENTIALS_PATH` | Path to Google credentials JSON | Yes |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Google Sheets ID | Yes |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp access token | Yes |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

## API Endpoints

### Applications
- `POST /api/applications` - Create application
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application by ID
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `DELETE /api/applications/bulk` - Delete multiple applications

### Payments
- `POST /api/payments/initiate` - Initiate PayU payment
- `POST /api/payments/callback` - Handle PayU callback

### Google Sheets
- `POST /api/sheets/add-application` - Add application to sheets
- `PUT /api/sheets/update-application` - Update application in sheets
- `DELETE /api/sheets/delete-application/:id` - Delete application from sheets

### WhatsApp
- `GET /api/whatsapp/webhook` - Verify webhook
- `POST /api/whatsapp/webhook` - Handle webhook events
- `POST /api/whatsapp/send-confirmation` - Send application confirmation
- `POST /api/whatsapp/send-payment-confirmation` - Send payment confirmation
- `POST /api/whatsapp/send-update` - Send application update

### Health
- `GET /health` - Health check endpoint

## Deployment

### Railway

1. **Connect to Railway:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Set environment variables:**
   ```bash
   railway variables set MONGO_URI="your-mongo-uri"
   railway variables set PAYU_KEY="your-payu-key"
   # ... set all required variables
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

### Manual Deployment

1. **Build and start:**
   ```bash
   npm install --production
   npm start
   ```

2. **Use PM2 for production:**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name vestiga-backend
   ```

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── applicationController.js
│   ├── paymentController.js
│   ├── sheetsController.js
│   └── whatsappController.js
├── middleware/
│   └── (custom middleware)
├── models/
│   └── Application.js       # Mongoose schema
├── routes/
│   ├── applicationRoutes.js
│   ├── paymentRoutes.js
│   ├── sheetsRoutes.js
│   └── whatsappRoutes.js
├── services/
│   ├── googleSheetsService.js
│   └── whatsappService.js
└── server.js               # Main server file
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
# vestiga-backend-node
# vestiga-backend-node

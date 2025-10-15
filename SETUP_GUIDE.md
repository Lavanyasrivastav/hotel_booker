# 🏨 HotelBooker Complete Setup Guide

This guide will help you set up the complete HotelBooker project with a Node.js backend, MongoDB database, and connected frontend.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Install MongoDB

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and start automatically
4. Verify installation by opening Command Prompt and typing: `mongod --version`

#### Alternative: MongoDB Atlas (Cloud)
If you prefer not to install MongoDB locally:
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `backend/config.env` with your Atlas connection string

### 2. Set Up Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - The `config.env` file is already created with default values
   - Update `MONGODB_URI` if using MongoDB Atlas
   - Change `JWT_SECRET` to a secure random string for production

4. **Seed the database:**
   ```bash
   npm run seed
   ```
   This will create:
   - 12 premium hotels across India
   - Admin user: `admin@hotelbooker.com` / `admin123`
   - Regular user: `john@example.com` / `password123`

5. **Start the backend server:**
   ```bash
   # Development mode (auto-reload)
   npm run dev
   
   # Production mode
   npm start
   
   # Or use the Windows batch file
   start.bat
   ```

   The server will start on `http://localhost:5000`

### 3. Test the Backend

1. **Health Check:**
   Open your browser and go to: `http://localhost:5000/api/health`

2. **API Endpoints:**
   - Hotels: `http://localhost:5000/api/hotels`
   - Featured Hotels: `http://localhost:5000/api/hotels/featured`
   - Search: `http://localhost:5000/api/hotels/search?q=Mumbai`

3. **Using Postman or similar:**
   - Test POST endpoints like registration and login
   - Use the admin credentials to test protected routes

### 4. Frontend Integration

The frontend is already updated to connect to the backend API. Simply:

1. **Open the main page:**
   - Open `index3.html` in your browser
   - Or use a local server (recommended)

2. **Set up a local server:**
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   
   # Using Live Server extension in VS Code
   ```

3. **Access the website:**
   - Main page: `http://localhost:8000/index3.html`
   - Sign in: `http://localhost:8000/signin.html`

## 🔧 Configuration Details

### Backend Configuration (`backend/config.env`)

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/hotelbooker  # Database connection
JWT_SECRET=your-super-secret-jwt-key-change-in-production  # JWT signing key
NODE_ENV=development                         # Environment mode
```

### Database Structure

The database includes comprehensive hotel information:

- **Hotel Details**: Name, description, location, pricing
- **Amenities**: Wi-Fi, pool, spa, restaurant, etc.
- **Room Types**: Different room categories with pricing
- **Policies**: Check-in/out times, cancellation policies
- **Ratings & Reviews**: User feedback system
- **Geographic Data**: Coordinates for location-based features

### API Features

- **Authentication**: JWT-based login/registration
- **Hotel Management**: CRUD operations for hotels
- **Search & Filtering**: Advanced search with multiple criteria
- **Booking System**: Complete booking lifecycle
- **User Management**: Profiles, preferences, wishlists
- **Rate Limiting**: Protection against abuse

## 🧪 Testing the Complete System

### 1. User Registration & Login

1. Go to the sign-in page
2. Register a new account or use existing credentials
3. Login and verify the authentication works

### 2. Hotel Search & Booking

1. Use the search form on the main page
2. Search for hotels in different cities
3. Apply filters (price, stars, amenities)
4. Select a hotel and try booking
5. Complete the booking process

### 3. Admin Functions

1. Login with admin account: `admin@hotelbooker.com` / `admin123`
2. Test hotel creation, updates, and deletion via API
3. Manage user accounts and bookings

## 🚨 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
- Ensure MongoDB service is running
- Check if the connection string is correct
- Verify MongoDB is installed and accessible

#### Backend Server Won't Start
- Check if port 5000 is already in use
- Verify all dependencies are installed
- Check the console for error messages

#### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS settings in the backend
- Verify the API_BASE_URL in the frontend JavaScript

#### Database Seeding Failed
- Check MongoDB connection
- Ensure you have write permissions
- Check the console for specific error messages

### Error Messages

- **"MongoDB connection error"**: Database not accessible
- **"Port already in use"**: Another service is using port 5000
- **"Module not found"**: Dependencies not installed
- **"CORS error"**: Frontend origin not allowed

## 🔒 Security Considerations

### Production Deployment

1. **Change default credentials** immediately
2. **Use strong JWT secrets** (32+ characters)
3. **Enable HTTPS** with SSL certificates
4. **Set up proper firewall rules**
5. **Use environment variables** for sensitive data
6. **Implement proper logging** and monitoring

### API Security

- Rate limiting is enabled (100 requests per 15 minutes)
- Input validation on all endpoints
- JWT token expiration (7 days)
- CORS protection enabled

## 📱 Features Overview

### Frontend Features
- Responsive design for all devices
- Real-time search and filtering
- Interactive hotel cards with images
- Booking modal with availability checking
- User authentication and profile management
- Wishlist functionality
- Advanced search with multiple criteria

### Backend Features
- RESTful API with proper HTTP methods
- Comprehensive data validation
- JWT-based authentication
- Database indexing for performance
- Error handling and logging
- Rate limiting and security headers
- Scalable architecture

### Database Features
- Rich hotel metadata
- Geographic coordinates for mapping
- Flexible search and filtering
- User preferences and history
- Booking management system
- Review and rating system

## 🚀 Next Steps

### Immediate Improvements
1. Add more hotels to the database
2. Implement payment gateway integration
3. Add email notifications
4. Create admin dashboard
5. Add image upload functionality

### Advanced Features
1. Real-time availability updates
2. Mobile app development
3. Analytics and reporting
4. Multi-language support
5. Advanced recommendation system

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure services are running
4. Check the API documentation in the README
5. Review the troubleshooting section above

## 🎉 Success!

Once everything is working:

- Backend: `http://localhost:5000` ✅
- Frontend: `http://localhost:8000` ✅
- Database: MongoDB running ✅
- API: All endpoints responding ✅
- Authentication: Login/registration working ✅
- Booking: Complete flow functional ✅

Your HotelBooker system is now fully operational! 🏨✨

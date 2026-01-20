# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace platform where Clients can post jobs (Gigs) and Freelancers can apply for them (Bids). Built with React.js (Next.js), Node.js, Express.js, MongoDB, and Socket.io for real-time notifications.

## 🚀 Quick Links

- **🌐 Frontend**: [http://localhost:3000](http://localhost:3000)
- **🔌 Backend API**: [http://localhost:5001/api](http://localhost:5001/api)
- **📚 Swagger UI**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)
- **📄 API Spec**: `backend/swagger.yaml` or `backend/swagger.json`

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Secure sign-up and login with JWT tokens stored in HttpOnly cookies
- ✅ **Gig Management (CRUD)** - Create, read, update, and delete job postings
- ✅ **Browse & Search Gigs** - Public feed showing all "Open" jobs with search functionality
- ✅ **Bidding System** - Freelancers can submit bids with message and price
- ✅ **Hiring Logic** - Clients can hire freelancers with automatic status updates
  - Gig status changes from "open" to "assigned"
  - Selected bid status becomes "hired"
  - All other bids automatically marked as "rejected"
- ✅ **Real-time Notifications** - Socket.io integration for instant updates when hired/rejected
- ✅ **Transactional Integrity** - MongoDB transactions prevent race conditions during hiring

### Bonus Features
- ✅ **Race Condition Prevention** - Atomic updates using MongoDB transactions
- ✅ **Real-time Updates** - Socket.io notifications for hired/rejected bids

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly cookies
- **Real-time**: Socket.io
- **Security**: bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd gigflow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5001
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory (optional, defaults are set):

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### 🔗 Swagger UI (Interactive API Documentation)

**Access Swagger UI:**
- **Local Development**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)
- **Production**: `https://your-domain.com/api-docs`

The Swagger UI provides:
- ✅ Complete API endpoint documentation
- ✅ Interactive testing interface (Try it out feature)
- ✅ Request/response schemas with examples
- ✅ Authentication examples
- ✅ Error response documentation
- ✅ Real-time API testing

### 📄 OpenAPI Specification Files

- **`backend/swagger.yaml`** - Full OpenAPI 3.0 specification (YAML format)
- **`backend/swagger.json`** - JSON format specification

You can import these files into:
- Postman
- Insomnia
- Any OpenAPI-compatible tool

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { name, email, password }
Response: { success, data: { _id, name, email } }
```

#### Login User
```
POST /api/auth/login
Body: { email, password }
Response: { success, data: { _id, name, email } }
Sets HttpOnly cookie with JWT token
```

#### Logout User
```
POST /api/auth/logout
Response: { success, message }
Clears HttpOnly cookie
```

#### Check Current User
```
GET /api/auth/check
Headers: Cookie with token
Response: { success, data: { _id, name, email } }
```

### Gig Endpoints

#### Get All Gigs
```
GET /api/gigs?search=<query>&status=<open|assigned>
Response: { success, count, data: [gigs] }
```

#### Get Single Gig
```
GET /api/gigs/:id
Response: { success, data: gig }
```

#### Create Gig
```
POST /api/gigs
Headers: Cookie with token
Body: { title, description, budget }
Response: { success, data: gig }
```

#### Update Gig
```
PUT /api/gigs/:id
Headers: Cookie with token
Body: { title?, description?, budget? }
Response: { success, data: gig }
```

#### Delete Gig
```
DELETE /api/gigs/:id
Headers: Cookie with token
Response: { success, data: {} }
```

### Bid Endpoints

#### Get Bids for a Gig (Owner Only)
```
GET /api/bids/:gigId
Headers: Cookie with token
Response: { success, count, data: [bids] }
```

#### Create Bid
```
POST /api/bids
Headers: Cookie with token
Body: { gigId, message, price }
Response: { success, data: bid }
```

#### Hire Freelancer
```
PATCH /api/bids/:bidId/hire
Headers: Cookie with token
Response: { success, data: { bid, gig }, message }
Triggers real-time notification to hired freelancer
```

#### Get User's Bids
```
GET /api/bids/user/my-bids
Headers: Cookie with token
Response: { success, count, data: [bids] }
```

## 🗄️ Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date
}
```

### Gig
```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 1000 chars),
  budget: Number (required, min 1),
  ownerId: ObjectId (ref: User),
  status: String (enum: ['open', 'assigned'], default: 'open'),
  createdAt: Date
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig, required),
  freelancerId: ObjectId (ref: User, required),
  message: String (required, max 500 chars),
  price: Number (required, min 1),
  status: String (enum: ['pending', 'hired', 'rejected'], default: 'pending'),
  createdAt: Date
}
```

## 🎯 Key Features Explained

### Hiring Logic with Transactional Integrity

The hiring process uses MongoDB transactions to ensure atomicity:

1. When a client clicks "Hire" on a bid:
   - Transaction starts
   - Validates gig is still "open"
   - Validates bid is still "pending"
   - Updates bid status to "hired"
   - Updates gig status to "assigned"
   - Rejects all other pending bids for that gig
   - Transaction commits

2. If two clients try to hire simultaneously:
   - Only one transaction succeeds
   - The other receives a 409 Conflict error
   - Prevents race conditions

### Real-time Notifications

Using Socket.io:
- When a freelancer is hired, they receive an instant notification
- When bids are rejected, freelancers are notified in real-time
- Notifications appear in the navbar bell icon
- No page refresh needed

## 🧪 Testing the Application

### Test Flow

1. **Register/Login**: Create accounts for both a client and freelancer
2. **Post a Gig**: As client, create a new gig
3. **Submit Bids**: As freelancer, submit bids on the gig
4. **Review Bids**: As client, view all bids on your gig
5. **Hire Freelancer**: As client, click "Hire" on a bid
6. **Check Notifications**: As freelancer, see real-time notification

### Expected Behavior

- ✅ Only one freelancer can be hired per gig
- ✅ All other bids automatically rejected
- ✅ Gig status changes to "assigned"
- ✅ Real-time notification appears for hired freelancer
- ✅ Rejected freelancers receive notifications

## 📁 Project Structure

```
gigflow/
├── backend/                          # Backend API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection configuration
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.js    # Authentication logic (register, login, logout)
│   │   │   ├── bidController.js     # Bid operations (create, hire, get bids)
│   │   │   └── gigController.js     # Gig CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT authentication middleware
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── Bid.js               # Bid model (gigId, freelancerId, message, price, status)
│   │   │   ├── Gig.js               # Gig model (title, description, budget, ownerId, status)
│   │   │   └── User.js              # User model (name, email, password)
│   │   ├── routes/                  # API route definitions
│   │   │   ├── auth.js              # /api/auth routes
│   │   │   ├── bids.js              # /api/bids routes
│   │   │   └── gigs.js              # /api/gigs routes
│   │   └── index.js                 # Express server setup & Socket.io configuration
│   ├── swagger.yaml                  # OpenAPI 3.0 specification (YAML)
│   ├── swagger.json                  # OpenAPI 3.0 specification (JSON)
│   ├── .env.example                  # Environment variables template
│   └── package.json                  # Backend dependencies
│
├── frontend/                         # Next.js Frontend Application
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Authentication routes (grouped)
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Login page
│   │   │   └── register/
│   │   │       └── page.tsx         # Registration page
│   │   ├── components/               # Reusable React components
│   │   │   ├── Footer.tsx           # Footer component with social links
│   │   │   └── Navbar.tsx          # Navigation bar with notifications
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.tsx      # Authentication state management
│   │   │   └── SocketContext.tsx    # Socket.io real-time notifications
│   │   ├── dashboard/
│   │   │   └── page.tsx             # User dashboard with stats
│   │   ├── gigs/                    # Gig-related pages
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx         # Gig detail page (view bids, submit bid, hire)
│   │   │   ├── create/
│   │   │   │   └── page.tsx         # Create new gig form
│   │   │   └── page.tsx             # Browse all gigs with search/filter
│   │   ├── my-bids/
│   │   │   └── page.tsx             # User's submitted bids
│   │   ├── my-gigs/
│   │   │   └── page.tsx             # User's posted gigs
│   │   ├── services/
│   │   │   └── api.ts               # Axios API client configuration
│   │   ├── globals.css              # Global styles & Tailwind components
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Landing page
│   ├── public/                      # Static assets
│   │   ├── favicon.svg
│   │   └── logo-g.svg
│   ├── .env.local                   # Frontend environment variables (optional)
│   ├── next.config.ts               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   └── package.json                 # Frontend dependencies
│
└── README.md                         # Project documentation
```

## 🎨 What's in the App

### Frontend Pages & Features

#### 🏠 Landing Page (`/`)
- Hero section with animated gradient background
- Feature highlights with icons
- Statistics display
- Call-to-action buttons
- Responsive design with glass morphism effects

#### 🔐 Authentication Pages
- **Login** (`/login`) - User login with email/password
- **Register** (`/register`) - New user registration with validation

#### 📊 Dashboard (`/dashboard`)
- User statistics (Total Gigs, Active Gigs, Total Bids)
- Quick action cards
- Tips for success section
- Personalized welcome message

#### 💼 Gigs Pages
- **Browse Gigs** (`/gigs`)
  - Search functionality (by title/description)
  - Filter by status (open/assigned)
  - Budget filters
  - Beautiful card layout with hover effects
  - Real-time stats display

- **Gig Detail** (`/gigs/[id]`)
  - Full gig information
  - Bid submission form (for freelancers)
  - View all bids (for gig owner)
  - Hire freelancer button (for gig owner)
  - Real-time bid updates

- **Create Gig** (`/gigs/create`)
  - Form to post new job
  - Title, description, budget fields
  - Validation and error handling

#### 📝 My Bids (`/my-bids`)
- List of all user's submitted bids
- Filter by status (pending/hired/rejected)
- Bid statistics
- Performance insights
- Links to related gigs

#### 📋 My Gigs (`/my-gigs`)
- List of user's posted gigs
- Filter by status (open/assigned)
- Delete gig functionality
- View bid counts
- Links to gig details

### Backend API Endpoints

#### 🔑 Authentication (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Authenticate user
- `POST /logout` - Clear session
- `GET /check` - Get current user info

#### 💼 Gigs (`/api/gigs`)
- `GET /` - Get all gigs (with search & filter)
- `GET /:id` - Get single gig details
- `POST /` - Create new gig (protected)
- `PUT /:id` - Update gig (protected, owner only)
- `DELETE /:id` - Delete gig (protected, owner only)

#### 💰 Bids (`/api/bids`)
- `POST /` - Submit a bid (protected)
- `GET /:gigId` - Get bids for a gig (protected, owner only)
- `PATCH /:bidId/hire` - Hire freelancer (protected, owner only)
- `GET /user/my-bids` - Get user's bids (protected)

### Real-time Features
- Socket.io integration for instant notifications
- User-specific notification rooms
- Real-time bid status updates
- Hiring notifications
- Rejection notifications

## 🌐 Application URLs

### Development
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)
- **Swagger UI**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

### Production (Example)
- **Frontend**: `https://gigflow.vercel.app`
- **Backend API**: `https://api.gigflow.com/api`
- **Swagger UI**: `https://api.gigflow.com/api-docs`

## 🚢 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5001
   NODE_ENV=production
   ```

2. Ensure MongoDB is accessible (MongoDB Atlas recommended)

3. Deploy to platforms like:
   - **Railway** (recommended - easy MongoDB integration)
   - **Render** (free tier available)
   - **Heroku** (paid plans)
   - **AWS/DigitalOcean** (VPS)

4. After deployment, update Swagger server URL in `swagger.yaml`

### Frontend Deployment

1. Set environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
   ```

2. Deploy to:
   - **Vercel** (recommended for Next.js - free tier)
   - **Netlify** (free tier available)
   - **AWS Amplify**

3. Update CORS settings in backend to allow your frontend domain

## 🔒 Security Features

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens in HttpOnly cookies (prevents XSS)
- ✅ CORS configured for specific origins
- ✅ Input validation and sanitization
- ✅ MongoDB transactions for data integrity
- ✅ Authentication middleware for protected routes

## 📝 Important Notes

- **Fluid Roles**: Any user can post gigs (client) or bid on gigs (freelancer) - roles are not fixed
- **Search**: Uses MongoDB text indexing for fast search across gig titles and descriptions
- **Real-time**: Socket.io rooms (`user-{userId}`) are used for user-specific notifications
- **Dates**: All timestamps are stored in UTC
- **Authentication**: JWT tokens are stored in HttpOnly cookies for security
- **Transactions**: MongoDB transactions ensure atomic operations during hiring
- **CORS**: Configured for `http://localhost:3000` in development

## 🔍 Quick Start Guide

1. **Start MongoDB** (local or use MongoDB Atlas)
2. **Backend**: `cd backend && npm install && npm run dev`
3. **Frontend**: `cd frontend && npm install && npm run dev`
4. **Access**: Open [http://localhost:3000](http://localhost:3000)
5. **API Docs**: Visit [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

## 📖 Additional Resources

- **Swagger Documentation**: Full API documentation available at `/api-docs`
- **OpenAPI Spec**: Import `swagger.yaml` into Postman/Insomnia
- **MongoDB**: Ensure MongoDB is running before starting backend
- **Environment Variables**: Copy `.env.example` to `.env` and configure

## 👤 Author

**MANYA SHUKLA**

## 📧 Submission

- **Email**: ritik.yadav@servicehive.tech
- **CC**: hiring@servicehive.tech

## 📄 License

This project is part of a Full Stack Development Internship Assignment.



# OmniCart - Full Stack E-Commerce Platform

A modern, full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). OmniCart provides a complete shopping experience with product browsing, cart management, user authentication, and order processing.

## 🚀 Tech Stack

### Frontend
- **React** 19.2.4 - UI library
- **React Router DOM** 7.13.0 - Client-side routing
- **TypeScript** 5.8.2 - Type safety
- **Vite** 6.2.0 - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.0.0 - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Deployment
- **Netlify** - Hosting platform (frontend + serverless functions)
- **serverless-http** - Express adapter for Netlify Functions

## 📋 Features

- 🛍️ Product browsing with search and filtering
- 🛒 Shopping cart management
- 👤 User authentication (register/login)
- 📦 Order processing and tracking
- ❤️ Wishlist functionality
- 📍 Address Management with Type Selection (Home/Work/Other)
- 💳 Secure Wallet with Luhn Algorithm Validation
- 📱 Responsive design
- 🔐 Secure password hashing
- 🎨 Modern UI with dark mode support

## 🏗️ Project Structure

```
OmniCart/
├── client/                 # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   ├── App.tsx           # Main app component
│   ├── index.tsx         # Entry point
│   ├── vite.config.ts    # Vite configuration
│   └── package.json      # Frontend dependencies
│
├── server/                # Backend Express application
│   ├── models/           # Mongoose schemas
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/           # API route handlers
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js         # Express server setup
│   ├── netlify.js        # Netlify function handler
│   └── package.json      # Backend dependencies
│
├── netlify.toml          # Netlify deployment config
├── .gitignore
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OmniCart
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/omnicart
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:3000
   ```

   Update `client/.env.local` if needed:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```

### Running Locally

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start the frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:3000`

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/meta/categories` - Get all categories

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/address` - Add new address
- `PUT /api/users/address/:addressId` - Update address
- `DELETE /api/users/address/:addressId` - Delete address
- `POST /api/users/card` - Add payment method (Luhn Validated)
- `DELETE /api/users/card/:cardId` - Remove payment method
- `POST /api/users/:id/wishlist/:productId` - Add to wishlist
- `DELETE /api/users/:id/wishlist/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

## 🚀 Deployment to Netlify

1. **Connect your repository to Netlify**
   - Sign up/login to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure build settings** (already set in `netlify.toml`)
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/dist`
   - Functions directory: `server`

3. **Set environment variables in Netlify**
   - Go to Site settings → Environment variables
   - Add:
     - `MONGODB_URI` - Your MongoDB Atlas connection string
     - `JWT_SECRET` - Your JWT secret key
     - `NODE_VERSION` - 18

4. **Deploy**
   - Push to your main branch
   - Netlify will automatically build and deploy

## 🔧 Development

### Adding New Features

1. **Backend**: Add models in `server/models/`, routes in `server/routes/`
2. **Frontend**: Add components in `client/components/`, pages in `client/pages/`
3. **API Integration**: Use the `/api` proxy configured in `vite.config.ts`

### Database Seeding

To populate your database with sample data, you can create a seed script in `server/seed.js`.

## 📝 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Your Name

---

Built with ❤️ using the MERN stack

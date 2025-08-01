# Inventory Management Tool - Frontend

A modern React-based admin portal for the Inventory Management Tool backend.

## Features

- **User Authentication**: Login/Register with JWT tokens
- **Dashboard**: Overview with key metrics and recent products
- **Product Management**: View, search, filter, and update products
- **Add Products**: Comprehensive form with validation
- **Analytics**: Charts and insights with Chart.js
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live data from the backend API

## Tech Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Chart.js**: Data visualization
- **React Toastify**: Notifications
- **Font Awesome**: Icons
- **CSS3**: Modern styling with Grid and Flexbox

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend API running on port 8080

### Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Production Build

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.js       # Navigation bar
│   │   ├── Login.js        # Authentication
│   │   ├── Dashboard.js    # Main dashboard
│   │   ├── Products.js     # Product management
│   │   ├── AddProduct.js   # Add product form
│   │   └── Analytics.js    # Analytics and charts
│   ├── context/
│   │   └── AuthContext.js  # Authentication context
│   ├── App.js              # Main app component
│   ├── index.js            # App entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── Dockerfile             # Docker configuration
```

## Components

### Authentication
- **Login/Register**: User authentication with JWT tokens
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Token Management**: Automatic token storage and cleanup

### Dashboard
- **Statistics Cards**: Total products, value, low stock, categories
- **Quick Actions**: Links to main features
- **Recent Products**: Latest added products with status

### Product Management
- **Product List**: Searchable and filterable table
- **Inline Editing**: Update quantities directly in the table
- **Status Indicators**: Visual stock level indicators
- **Search & Filter**: By name, SKU, and product type

### Add Product
- **Comprehensive Form**: All product fields with validation
- **Image Preview**: Live preview of product images
- **Form Validation**: Client-side validation with error messages
- **Category Selection**: Predefined product categories

### Analytics
- **Category Distribution**: Doughnut chart showing product categories
- **Top Products**: Bar chart of highest value products
- **Low Stock Alerts**: List of products needing restocking
- **Key Metrics**: Summary statistics

## API Integration

The frontend communicates with the backend API using:

- **Base URL**: http://localhost:8080 (configurable)
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Toast notifications for user feedback
- **Loading States**: Loading indicators for better UX

## Styling

- **Modern Design**: Clean, professional interface
- **Responsive**: Mobile-first approach
- **Color Scheme**: Bootstrap-inspired colors
- **Icons**: Font Awesome icons throughout
- **Grid Layout**: CSS Grid for responsive layouts

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

### Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8080)

## Docker

The frontend can be run in Docker:

```bash
# Build and run with docker-compose
docker-compose up frontend

# Or build individually
docker build -t inventory-frontend .
docker run -p 3000:3000 inventory-frontend
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain consistent styling
4. Add proper error handling
5. Test all features thoroughly 
# Storely Seller Hub - React Dashboard

A modern, full-featured e-commerce admin dashboard built with React, TypeScript, and Tailwind CSS. Designed for sellers to manage their online stores, products, orders, and analytics.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI primitives
- **State Management**: Zustand
- **Routing**: React Router v7
- **Charts**: Recharts, ApexCharts
- **Forms**: React Hook Form with Zod validation
- **Authentication**: JWT-based with protected routes
- **File Upload**: Cloudinary integration
- **Icons**: Lucide React + custom SVG icons

## Project Structure

```
src/
├── app/                    # App entry point, routing, providers
├── features/               # Feature-based modules
│   ├── auth/              # Authentication (sign in, register, workflow)
│   ├── dashboard/         # Main dashboard homepage
│   ├── products/          # Product management (list, add, inventory, categories)
│   ├── orders/            # Order management (all, pending, processing, shipped, delivered, cancelled, returned)
│   ├── stores/            # Store management (create, profile, user profiles)
│   └── settings/          # User settings (logout)
├── shared/                # Shared components, hooks, services, utilities
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (Button, Input, Modal, Table, etc.)
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components (Sidebar, Header, Layout)
│   │   ├── charts/       # Chart components
│   │   └── tables/       # Table components
│   ├── services/         # API services (auth, products, orders, stores, users)
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   ├── context/          # React context providers
│   ├── api/              # API client and endpoints
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript types
└── config/               # Configuration constants
```

## Features

### Dashboard
- Overview with key metrics and charts
- Sales analytics visualization

### Products Management
- **All Products**: List, search, filter, paginate products
- **Add Products**: Create new products with images, variants, pricing
- **Inventory**: Track stock levels across products
- **Low Stock**: Monitor products below threshold
- **Categories**: Manage product categories

### Orders Management
- **All Orders**: Complete order listing with filters
- **Status-based views**: Pending, Processing, Shipped, Delivered, Cancelled, Returned
- Order details and status updates

### Store Management
- **Create Store**: Multi-step store setup wizard
- **Store Profile**: Configure store details, branding, policies
- **User Profiles**: Manage store team members

### Authentication & Security
- JWT-based authentication
- Protected routes with automatic redirect
- Role-based access control
- Secure token storage

### UI/UX Features
- Responsive design (mobile-first)
- Collapsible sidebar navigation
- Dark/Light theme support
- Toast notifications (Sonner)
- Loading states and error boundaries
- Accessible components (Radix UI)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://admin.storly.co.in
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### Using Docker

```bash
# Build image
docker build --build-arg VITE_API_BASE_URL=https://admin.storly.co.in -t storely-dashboard .

# Run container
docker run -p 8080:80 storely-dashboard
```

Visit [http://localhost:8080](http://localhost:8080)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## API Integration

The dashboard connects to the Storely Admin API. Key services:

- **Auth Service**: Login, register, token refresh
- **Product Service**: CRUD operations for products, categories, inventory
- **Order Service**: Order listing, status updates, filtering
- **Store Service**: Store creation, profile management
- **User Service**: Team member management
- **Image Service**: Cloudinary upload and management

## Deployment

The project builds to static assets in `dist/` directory. Deploy to any static hosting:

- Vercel / Netlify
- AWS S3 + CloudFront
- Nginx / Apache
- Docker (included Dockerfile)

## License

Private project - Storely
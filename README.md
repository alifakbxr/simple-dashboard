# Dashboard Application

A modern, full-featured dashboard web application built with Next.js 16, TypeScript, and Tailwind CSS. The application provides comprehensive user management, analytics, authentication, and data visualization capabilities with a responsive design and dark mode support.

## Features

- **🔐 Authentication System**: JWT-based authentication with login/logout functionality and protected routes
- **👥 User Management**: Complete CRUD operations for users with search, sorting, filtering, and pagination
- **📊 Analytics Dashboard**: Interactive charts and data visualization using Recharts
- **📈 Summary Cards**: Key metrics and statistics display on dashboard
- **⚙️ Settings & Notifications**: User preferences and notification management
- **🎨 Dark Mode**: Theme switching with persistence using next-themes
- **📱 Responsive Design**: Mobile-first approach with adaptive layouts
- **🔄 Real-time Updates**: Live data fetching and updates
- **📋 Recent Activity**: Activity feed showing latest user actions
- **🎯 Quick Actions**: Shortcuts for common tasks

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: JWT with bcryptjs and jsonwebtoken
- **Forms**: React Hook Form with Yup validation and @hookform/resolvers
- **Charts**: Recharts for data visualization
- **Icons**: Phosphor React icons
- **Theming**: next-themes for dark mode support
- **Deployment**: Optimized for Vercel

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Authentication**: Login using the credentials provided in the login form
2. **Dashboard**: View summary cards, recent activity, and quick actions
3. **Analytics**: Explore interactive charts and data visualizations
4. **User Management**: Browse, search, filter, and manage users with pagination
5. **User Details**: Click on users to view/edit detailed information and posts
6. **Settings**: Configure notifications and application preferences
7. **Theme**: Toggle between light and dark modes

## API Endpoints

- `GET /api/auth/login` - User authentication
- `GET /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/refresh` - Refresh authentication token
- `GET /api/users` - List all users with pagination
- `GET /api/users/[id]` - Get specific user details
- `GET /api/posts` - Get posts data
- `GET /api/settings/notifications` - Get notification settings

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── posts/                # Posts endpoints
│   │   ├── settings/             # Settings endpoints
│   │   └── users/                # User management endpoints
│   ├── analytics/                # Analytics page
│   ├── dashboard/                # Main dashboard page
│   ├── login/                    # Login page
│   ├── settings/                 # Settings page
│   └── users/[id]/               # Dynamic user detail pages
├── src/
│   ├── app/                      # App layout and globals
│   ├── components/               # React components
│   │   ├── AnalyticsCharts.tsx   # Data visualization components
│   │   ├── AuthProvider.tsx      # Authentication context
│   │   ├── Header.tsx            # Main header component
│   │   ├── PostList.tsx          # Posts display component
│   │   ├── RecentActivity.tsx    # Activity feed component
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── SummaryCards.tsx      # Dashboard metrics cards
│   │   ├── UserDetail.tsx        # User detail view
│   │   └── UserTable.tsx         # Users table with search/filter
│   └── types/                    # TypeScript type definitions
│       ├── auth.ts               # Authentication types
│       ├── post.ts               # Post types
│       └── user.ts               # User types
└── public/                       # Static assets
```
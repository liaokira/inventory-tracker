# Inventory Tracker

View it deployed here: https://inventory-tracker-o01i0vw5m-kira-liaos-projects.vercel.app/

## System Overview

### Tech Stack

- **Frontend Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL (Serverless)
- **API**: Next.js API Routes (Serverless Functions)
- **Deployment**: Vercel

### Architecture

The application uses a serverless architecture with the following components:

- **Frontend**: React components with client-side state management
- **API Layer**: RESTful API endpoints using Next.js Route Handlers
- **Database**: PostgreSQL database hosted on Neon with automatic connection pooling
- **Deployment**: Serverless functions on Vercel for automatic scaling

### Reasoning & Tradeoffs
- The characteristics of this project are:
    - Small scale (not used by a lot of people worldwide)
    - Simple data type / responses
- **React frontend** -> Modern standard, easy to create responsive apps as a SPA
    - Easy to fetch data and have the page "react" accordingly to user input
    - Also easy to deploy to Vercel
- **Neon DB** -> Neon is ideal for: Low traffic apps, side projects
    - 2 standard types of data (locations and items)
    - Neon DB works well with serverless functions
- **Vercel Serverless API**
    - I rule out using serverful API since we don't need to have 24/7 uptime, or a heavy load of requests
    - Presumably only a small amount of people will be using this so no need to worry about exceeding Vercel free limits
    - Also it's easier and quicker to deploy serverless for a small project

TLDR: prioritizing fast deployment, ease of access, no need for scalability/complexity. With this in mind, potential tradeoffs may be:
- Can't handle a consistent heavy load of users
- Would be costly to scale
- Might not handle other unstructured data well

### Running Locally

- Node.js 18+ installed
- A Neon database account (free tier available at [neon.tech](https://neon.tech))

### Running Locally

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. The application will connect to your database and you can start adding locations and items!

### Building for Production

```bash
npm run build
npm start
```

## Usage Tips

- **Add Location**: Click the "+" button on the right side of the screen
- **Add Item**: Click the "+" button inside any location column
- **Edit Item**: Click on any item card to edit it in place
- **Edit Location**: Click on the location name to rename it
- **Search**: Use the search bar at the top to filter by category, location, or item name


# Inventory Tracker - Serverless API Framework

This is a [Next.js](https://nextjs.org) project with Vercel serverless API functions.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the API testing interface.

## Serverless API Structure

### Creating API Endpoints

API routes are created in the `src/app/api/` directory. Each route is defined by a `route.ts` file.

**Example structure:**
```
src/app/api/
  └── example/
      └── route.ts
```

This creates an endpoint at `/api/example`.

### Example API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### Supported HTTP Methods

- `GET` - Retrieve data
- `POST` - Create/send data
- `PUT` - Update data
- `DELETE` - Delete data
- `PATCH` - Partial update

### Configuration

The `vercel.json` file contains serverless function configuration:

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

- **memory**: Memory allocated to each function (MB)
- **maxDuration**: Maximum execution time (seconds)

## Testing the API

Visit [http://localhost:3000](http://localhost:3000) to access the API testing interface which includes:

- **GET Request Test**: Tests `/api/example?name=Developer`
- **POST Request Test**: Tests `/api/example` with JSON body

You can also test using curl:

```bash
# GET request
curl http://localhost:3000/api/example?name=YourName

# POST request
curl -X POST http://localhost:3000/api/example \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

## Deploy on Vercel

Deploy your app to Vercel:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure serverless functions

Your API endpoints will be available at: `https://your-app.vercel.app/api/...`

## Learn More

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Next.js Documentation](https://nextjs.org/docs)

# Short - URL Shortening Service

A fast, scalable URL shortening service built with Next.js 13+ App Router, AWS DynamoDB, and Redis-based rate limiting.

## Features

- 🔗 URL shortening with custom 9-character IDs
- 🚀 Built on Next.js 13+ with App Router for optimal performance
- 📊 AWS DynamoDB backend with deduplication
- 🛡️ Redis-powered rate limiting (5 requests/10s per IP)
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- ⚡ Optimized with Turbo dev server
- 🔒 Input validation with Zod schemas

## Tech Stack

- **Frontend**: Next.js 13+, React, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, AWS DynamoDB, Redis
- **Tools**: TypeScript, ESLint, Prettier, nanoid

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (required package manager)
- AWS account with DynamoDB access
- Upstash Redis instance

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables (see Configuration section below)

3. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Configuration

Create a `.env.local` file with the following variables:

```env
# App Configuration
APP_DOMAIN=https://yourdomain.com
APP_DYNAMODB_TABLE_NAME=your-table-name

# AWS Configuration
APP_AWS_REGION=us-east-1
APP_AWS_ACCESS_KEY_ID=your-access-key
APP_AWS_SECRET_ACCESS_KEY=your-secret-key

# Development only - AWS Profile
DEV_AWS_PROFILE=your-aws-profile

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Environment Detection
VERCEL_ENV=development
```

### DynamoDB Setup

Create a DynamoDB table with:
- Primary key: `id` (String)
- Global Secondary Index: `long-url-index` with partition key `longUrl` (String)

## Development

### Available Scripts

- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### API Endpoints

- `POST /api/v1/shorten` - Create a short URL
- `GET /[id]` - Redirect to original URL

## Deployment

This application is optimized for deployment on Vercel, but can be deployed on any platform supporting Next.js.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fshort)

Make sure to configure all environment variables in your deployment platform.

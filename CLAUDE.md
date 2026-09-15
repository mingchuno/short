# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Management
- Package manager: `pnpm` (required, specified in package.json)
- Install dependencies: `pnpm install`

### Development Server
- Start development server: `pnpm dev` (uses Next.js with Turbo)
- Open: http://localhost:3000

### Build & Deployment
- Build for production: `pnpm build`
- Start production server: `pnpm start`

### Code Quality
- Run all checks: `pnpm check`
- Run linting and formatting checks: `pnpm lint` (Biome)
- Apply safe formatting and lint fixes: `pnpm format`
- Check types: `pnpm typecheck`
- Run unit tests: `pnpm test`

## Architecture Overview

This is a Next.js 13+ URL shortening service using the App Router architecture with the following key components:

### Core Technology Stack
- **Framework**: Next.js 13.4.7 with App Router
- **Database**: AWS DynamoDB with AWS SDK v3
- **Caching/Rate Limiting**: Upstash Redis with sliding window rate limiting
- **Styling**: Tailwind CSS with Radix UI components
- **Validation**: Zod for schema validation
- **ID Generation**: nanoid (9 character IDs)

### Application Structure

**API Layer** (`src/app/api/v1/`):
- `POST /api/v1/shorten` - Creates shortened URLs with rate limiting middleware
- Rate limited to 5 requests per 10 seconds per IP via middleware

**URL Resolution** (`src/app/[id]/`):
- Dynamic route handler for redirecting shortened URLs to original destinations
- Returns 404 page for invalid/missing IDs

**Data Layer** (`src/lib/dynamo/`):
- DynamoDB operations: `getUrlById`, `getUrlByLongUrl`, `createShortenUrl`
- Uses GSI "long-url-index" to prevent duplicate URLs
- Supports both AWS credentials and local profile authentication for development

**Business Logic** (`src/lib/service/shorten.ts`):
- `shortenUrl()` function handles deduplication and ID generation
- Checks for existing URLs before creating new entries

**Rate Limiting** (`src/lib/ratelimit.ts`):
- IP-based: 5 requests per 10 seconds
- Global: 100 requests per 10 seconds
- Uses ephemeral caching for performance

### Configuration Requirements

Environment variables needed:
- `APP_DOMAIN` - Domain for generated short links
- `APP_DYNAMODB_TABLE_NAME` - DynamoDB table name
- `APP_AWS_REGION` - AWS region
- `APP_AWS_ACCESS_KEY_ID` / `APP_AWS_SECRET_ACCESS_KEY` - AWS credentials (production)
- `DEV_AWS_PROFILE` - AWS profile for local development
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - Redis credentials
- `VERCEL_ENV` - Environment detection

### Database Schema

DynamoDB table structure:
- Primary key: `id` (string, 9 characters via nanoid)
- Attributes: `longUrl`, `link`
- GSI: `long-url-index` on `longUrl` for deduplication queries

### Component Architecture

UI components in `src/components/`:
- `shorten-form.tsx` - Main URL shortening form
- `short-link.tsx` - Display component for generated links
- `error-message.tsx` - Error display component
- `ui/` - Reusable Radix UI components (button, input, tooltip)

All components use Tailwind CSS with class-variance-authority for styling variants.

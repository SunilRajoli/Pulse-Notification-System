# Notification & Activity System

Production-grade notification backend with Node.js, Express, PostgreSQL, Redis, and BullMQ.

## How to Run

```bash
# 1. Start services
docker compose up -d

# 2. Run migrations
psql postgres://postgres:postgres@localhost:5432/notifications_db -f migrations/001_init.sql

# 3. Copy env
cp .env.example .env

# 4. Install deps
npm install

# 5. Start API server
npm run dev

# 6. Start worker (separate terminal)
npm run worker
```

## API Summary

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, get JWT |
| GET | /api/posts | No | List recent posts |
| POST | /api/posts | Yes | Create a post |
| POST | /api/posts/:postId/like | Yes | Like a post |
| DELETE | /api/posts/:postId/like | Yes | Unlike a post |
| GET | /api/notifications | Yes | Get my notifications |
| PUT | /api/notifications/read-all | Yes | Mark all as read |

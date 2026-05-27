# Cricket Pitch Booking System

A real-time cricket pitch booking platform where users can check availability and reserve time slots for cricket pitches. The system handles multiple users booking simultaneously without conflicts.

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Cache/Queues:** Redis, Bull
- **Real-time:** Socket.io
- **Auth:** JWT + bcrypt
- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **State:** Zustand (auth) + React Query (server state)

## Setup

### Prerequisites

- Node.js v20+
- PostgreSQL v15+
- Redis v7+
- Docker (optional)

### Manual Setup

```bash
# Backend
cd backend
cp .env.example .env  # update DATABASE_URL and REDIS_URL
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Access

- Frontend: http://localhost:5173
- API: http://localhost:4000

## API Endpoints

| Method | Path                | Auth | Description                |
| ------ | ------------------- | ---- | -------------------------- |
| POST   | /auth/register      | No   | Register new user          |
| POST   | /auth/login         | No   | Login, returns JWT         |
| POST   | /auth/logout        | Yes  | Blacklist token in Redis   |
| GET    | /pitches            | No   | List all pitches           |
| GET    | /pitches/:id        | No   | Get single pitch           |
| GET    | /slots              | Yes  | Slots for pitchId + date   |
| POST   | /reserve-slot       | Yes  | Reserve slot for 2 minutes |
| POST   | /confirm-booking    | Yes  | Confirm reservation        |
| POST   | /cancel-reservation | Yes  | Release reservation        |
| GET    | /my-bookings        | Yes  | Get user's bookings        |

## Database Schema

- **User** - id, name, email, password, role (USER/ADMIN)
- **Pitch** - id, name, location, pricePerHour
- **Booking** - id, userId, pitchId, bookingDate, startTime, endTime, status

Slots are generated dynamically (6 AM to 10 PM, hourly). A unique constraint on (pitchId, bookingDate, startTime) prevents duplicate bookings.

## Architecture

### Slot Race Condition

Redis SET NX is atomic - only one process can acquire the key. Even if two requests arrive simultaneously, Redis guarantees only one succeeds. The DB unique constraint is a backup safety net.

### Temporary Reservation (2-min hold)

Redis key `reservation:{pitchId}:{date}:{startTime}` with EX 120. A Bull job scheduled at T+120s calls releaseReservation() which deletes the key and emits slot:released. If user confirms before 120s, the key is deleted immediately and the Bull job is cancelled.

### Concurrency Protection (3 Layers)

1. **Redis SET NX** - Atomic reservation, returns 409 if slot already held
2. **DB Transaction + Row Lock** - SELECT FOR UPDATE on confirm, then INSERT
3. **DB Unique Constraint** - Final safety net at database level

### Scalability to 10,000 concurrent users

- GET /slots is read-heavy - cache slot availability in Redis with short TTL
- Read replica for PostgreSQL to offload slot read queries
- Horizontal scaling of Node.js processes behind a load balancer
- Bull queues allow distributed job processing across multiple workers

### Socket.io Multi-Server Scaling

- @socket.io/redis-adapter - all Socket.io instances share Redis pub/sub
- Load balancer with sticky sessions
- Redis pub/sub for cross-server event broadcasting

### Database Choice: PostgreSQL

PostgreSQL was chosen for ACID transactions, row-level locking support, and unique constraints - all critical for preventing double-booking in a concurrent environment.

# Work Item Lifecycle Management System

A comprehensive full-stack application for managing work items through a defined lifecycle with strict state transitions, blocking capabilities, role-based access control, and complete audit trail tracking.

## Overview

This system manages "Work Items" that move through a defined lifecycle (CREATED → IN_PROGRESS → IN_REVIEW → COMPLETED, with optional REWORK). Each state transition is validated server-side, blocked items cannot progress, and all actions are recorded in an immutable audit trail.

**Key Features:**
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Admin, Operator, Viewer)
- Strict lifecycle state machine with allowed transitions
- Work item blocking/unblocking with justification
- Explicit rework support
- Complete audit trail with full traceability
- Server-side enforcement of all business rules
- React frontend with real-time state management

## Tech Stack

**Backend:**
- NestJS (TypeScript)
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt password hashing
- Class Validator for DTOs

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- Tailwind CSS
- TypeScript

## Architecture

### Backend Structure
```
backend/
├── src/
│   ├── auth/               # JWT authentication & login/register
│   ├── users/              # User management & roles
│   ├── work-items/         # Work item lifecycle management
│   ├── history/            # Audit trail & event recording
│   ├── common/             # Shared utilities, decorators, guards
│   ├── prisma/             # Database client
│   └── main.ts             # Application entry point
└── prisma/
    └── schema.prisma       # Database schema
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/         # React components
│   ├── context/            # Auth context & state
│   ├── api/                # API client & endpoints
│   ├── types/              # TypeScript interfaces
│   └── App.tsx             # Main router
```

### Database Schema

**Users Table**
- `id`: UUID primary key
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `firstName`, `lastName`: User name fields
- `role`: UserRole enum (ADMIN, OPERATOR, VIEWER)
- `active`: Boolean flag for account status
- `createdAt`, `updatedAt`: Timestamps

**WorkItems Table**
- `id`: UUID primary key
- `title`, `description`: Item details
- `currentState`: WorkItemState enum
- `isBlocked`: Boolean flag
- `blockedReason`: Optional blocking justification
- `createdById`: Foreign key to user
- `createdAt`, `updatedAt`: Timestamps

**HistoryEvents Table**
- `id`: UUID primary key
- `workItemId`: Foreign key to work item
- `eventType`: HistoryEventType enum
- `previousState`, `newState`: State transition tracking
- `details`: JSON string for additional context
- `performedById`: Foreign key to user
- `createdAt`: Event timestamp

## Lifecycle States & Transitions

```
CREATED
  └─> IN_PROGRESS
      ├─> IN_REVIEW
      │   ├─> COMPLETED (terminal)
      │   └─> REWORK
      └─> REWORK
          ├─> IN_PROGRESS
          └─> IN_REVIEW
```

**Rules:**
- Blocked work items cannot transition to any other state
- Only ADMIN and OPERATOR can initiate state transitions
- Each transition is recorded with optional reason
- Rework is an explicit action that changes state to REWORK
- COMPLETED is a terminal state (no further transitions allowed)

## Authorization Model

### Admin
- Full access to all work items
- Can manage all users and assign roles
- Can view complete system history
- Can create, update, transition, block/unblock items
- Can view all work items regardless of creator

### Operator
- Can create and manage work items they created
- Can transition states and block/unblock their items
- Can view their own items and history
- Cannot manage other users

### Viewer
- Read-only access to items they created
- Cannot create new items
- Cannot modify or transition items
- Can view item history

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env`:**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/work_item_db"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   NODE_ENV="development"
   PORT=3001
   ```

4. **Create PostgreSQL database:**
   ```bash
   createdb work_item_db
   ```

5. **Run Prisma migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Start backend server:**
   ```bash
   npm run start:dev
   ```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. **Clone and navigate to frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env`:**
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. **Start frontend development server:**
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:3000`

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users/me` - Get current user info
- `GET /users` - Get all users (Admin only)
- `PATCH /users/:id/role` - Update user role (Admin only)

### Work Items
- `POST /work-items` - Create work item
- `GET /work-items` - List user's work items
- `GET /work-items/:id` - Get work item detail
- `PATCH /work-items/:id` - Update work item
- `POST /work-items/:id/transition` - Transition state
- `POST /work-items/:id/block` - Block work item
- `POST /work-items/:id/unblock` - Unblock work item
- `POST /work-items/:id/rework` - Initiate rework

### History
- `GET /history/work-item/:id` - Get work item history
- `GET /history/user/me` - Get user's activities
- `GET /history/all` - Get all system history (Admin only)

## Key Design Decisions

### 1. Server-Side Enforcement
All business rules (state transitions, blocking, authorization) are enforced server-side. Frontend UI is disabled for invalid actions but clients cannot bypass validation.

### 2. Immutable Audit Trail
History events are never modified or deleted. Each change creates a new record with timestamp, user, and details. This ensures compliance and traceability.

### 3. JWT Authentication
Stateless JWT tokens with 24-hour expiration. No session storage required. Tokens include user role for permission checks.

### 4. Role-Based Access Control
Three roles with clear permission boundaries. Authorization checks on both endpoints and individual resources prevent unauthorized access.

### 5. State Machine Pattern
Explicit allowed transitions prevent invalid state combinations. Blocked items prevent all transitions, ensuring workflow consistency.

### 6. Soft Authorization Pattern
VIEWER/OPERATOR users can only access items they created (except ADMIN). This provides data isolation without row-level security complexity.

## Testing the System

### 1. Create Test Users
- Register as Admin, Operator, and Viewer
- Note: Initial users register as VIEWER, need manual role update via database

### 2. Create Work Items
- Create items as different users
- Verify authorization boundaries

### 3. Test State Transitions
- Try invalid transitions (should be rejected)
- Try transitions on blocked items (should fail)
- Verify history recording

### 4. Test Blocking
- Block items and verify cannot transition
- Unblock and verify can transition again

### 5. Verify History
- Check that all actions are recorded
- Verify audit trail shows correct sequence

## Known Limitations

1. **No Pagination**: List endpoints return all records. Production would need pagination.

2. **Manual Role Assignment**: Initial users register as VIEWER. An admin endpoint to update roles exists but no UI. Update roles directly in database or via API.

3. **No Soft Deletes**: Deleted records are hard deleted. Production should use soft deletes with timestamped `deletedAt`.

4. **No Rate Limiting**: No request rate limiting implemented. Production should add.

5. **Basic Error Messages**: Error messages are functional but not localized. Production would need i18n support.

6. **No Email Verification**: Registration doesn't send verification emails. Production should implement.

7. **Concurrent Update Conflicts**: No optimistic locking. Race conditions on simultaneous updates not handled.

## Future Enhancements

- Email verification and password reset flows
- Pagination and advanced filtering
- Work item dependencies and critical path
- Bulk operations
- WebSocket notifications for real-time updates
- Advanced search and filtering
- Custom field support
- Workflow templates
- Integration with external systems
- Metrics and reporting dashboard

## Security Considerations

- **Password Storage**: Bcrypt with salt rounds = 10
- **Token Expiration**: 24 hours (configurable)
- **CORS**: Enabled for development, should be restricted in production
- **Input Validation**: All inputs validated with class-validator
- **SQL Injection**: Protected via Prisma parameterized queries
- **Authorization**: Server-side enforcement on all protected endpoints

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Run `npm run db:migrate` to create tables

### Frontend can't connect to backend
- Check VITE_API_URL in .env
- Verify backend is running on port 3001
- Check browser console for CORS errors

### Login fails
- Verify user was registered
- Check email/password are correct
- Check user account is active

### State transitions fail
- Verify work item is not blocked
- Check allowed transitions for current state
- Verify user role allows action

## License

MIT

# Work Item Lifecycle Management System

A comprehensive full-stack application for managing work items through a defined lifecycle with strict state transitions, blocking capabilities, role-based access control, and complete audit trail tracking.

## Overview

This system manages "Work Items" that move through a defined lifecycle (CREATED → IN_PROGRESS → IN_REVIEW → COMPLETED, with optional REWORK). Each state transition is validated server-side, blocked items cannot progress, and all actions are recorded in an immutable audit trail.

**Key Features:**
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Admin, Operator, Viewer)
- User status management (Active, Inactive, Suspended) with admin approval workflow
- Strict lifecycle state machine with allowed transitions
- Work item blocking/unblocking with justification (Operator/Admin only)
- Users can change status of their own work items (JIRA-like behavior)
- Explicit rework support
- Complete audit trail with full traceability
- Server-side enforcement of all business rules
- React frontend with real-time state management
- Admin user management interface
- Activity history tracking for all users

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
- Vite (build tool)
- React Router v6
- Axios for API calls
- Tailwind CSS v3
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
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── Dashboard.tsx
│   │   ├── WorkItemDetail.tsx
│   │   ├── CreateWorkItem.tsx
│   │   ├── UsersManagement.tsx (Admin only)
│   │   ├── ActivityHistory.tsx
│   │   └── Header.tsx
│   ├── context/            # Auth context & state
│   ├── api/                # API client & endpoints
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── history.ts
│   ├── types/              # TypeScript interfaces
│   └── App.tsx             # Main router
```

### Frontend Routes
- `/login` - User login page
- `/register` - User registration page
- `/dashboard` - Main dashboard showing work items
- `/work-items/create` - Create new work item
- `/work-items/:id` - View and manage work item details
- `/users` - Users Management (Admin only)
- `/activity` - Activity History page

### Database Schema

**Users Table**
- `id`: UUID primary key
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `firstName`, `lastName`: User name fields
- `role`: UserRole enum (ADMIN, OPERATOR, VIEWER)
- `status`: UserStatus enum (ACTIVE, INACTIVE, SUSPENDED)
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
- Users can change the status of work items they created (regardless of role)
- ADMIN can change status of any work item
- Only ADMIN and OPERATOR can block/unblock work items
- Each transition is recorded with optional reason
- Rework is an explicit action that changes state to REWORK
- COMPLETED is a terminal state (no further transitions allowed)

## Authorization Model

### User Status Management
- **INACTIVE**: New users register as INACTIVE and cannot login until approved by admin
- **ACTIVE**: Approved users can login and perform all allowed actions
- **SUSPENDED**: Suspended users cannot login or perform any actions
- Only ADMIN can change user status
- Status transition rules:
  - INACTIVE users can only be set to ACTIVE (cannot be suspended)
  - ACTIVE users can be set to ACTIVE or SUSPENDED (cannot go back to INACTIVE)
  - SUSPENDED users can be reactivated to ACTIVE

### Admin
- Full access to all work items
- Can manage all users (assign roles and change status)
- Can view complete system history
- Can create, update, transition, block/unblock items
- Can view all work items regardless of creator
- Cannot change their own role or status

### Operator
- Can create and manage work items they created
- Can transition states of their own work items
- Can block/unblock any work item
- Can view their own items and history
- Cannot manage other users

### Viewer
- Can create work items
- Can change status of work items they created (JIRA-like behavior)
- Cannot block/unblock work items
- Can view their own items and history
- Cannot manage other users

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- pnpm (recommended) or npm

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Create `.env` file:**
   ```bash
   # Create .env file with the following content:
   DATABASE_URL="postgresql://user:password@localhost:5432/work_item_db"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   NODE_ENV="development"
   PORT=3001
   ```

4. **Create PostgreSQL database:**
   ```bash
   createdb work_item_db
   ```

5. **Generate Prisma client:**
   ```bash
   pnpm prisma generate
   ```

6. **Run Prisma migrations:**
   ```bash
   pnpm prisma migrate dev
   ```
   
   Note: This will create the database schema with UserStatus enum (ACTIVE, INACTIVE, SUSPENDED)

7. **Start backend server:**
   ```bash
   pnpm run start:dev
   ```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Create `.env` file (optional):**
   ```bash
   # Create .env file if you need to override API URL:
   VITE_API_URL=http://localhost:3001
   ```
   
   Note: The default API URL is `http://localhost:3001` and is configured in `src/api/client.ts`

4. **Start frontend development server:**
   ```bash
   pnpm run dev
   ```

Frontend will run on `http://localhost:3000`

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
pnpm run start:dev
```

### Terminal 2 - Frontend
```bash
cd frontend
pnpm run dev
```

Visit `http://localhost:3000` in your browser.

**Note:** Make sure PostgreSQL is running and the database is accessible before starting the backend.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users/me` - Get current user info
- `GET /users` - Get all users (Admin only)
- `PATCH /users/:id/role` - Update user role (Admin only)
- `PATCH /users/:id/status` - Update user status (Admin only)

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
All business rules (state transitions, blocking, authorization, user status) are enforced server-side. Frontend UI is disabled for invalid actions but clients cannot bypass validation.

### 2. User Status Management
- New users register as INACTIVE and require admin approval to become ACTIVE
- ACTIVE users can be suspended by admin
- SUSPENDED users are blocked from all actions via UserStatusGuard
- Status changes follow strict rules: INACTIVE → ACTIVE only, ACTIVE → ACTIVE/SUSPENDED only

### 3. Immutable Audit Trail
History events are never modified or deleted. Each change creates a new record with timestamp, user, and details. This ensures compliance and traceability.

### 4. JWT Authentication
Stateless JWT tokens with 24-hour expiration. No session storage required. Tokens include user role for permission checks. Only ACTIVE users can login.

### 5. Role-Based Access Control
Three roles with clear permission boundaries. Authorization checks on both endpoints and individual resources prevent unauthorized access.

### 6. State Machine Pattern
Explicit allowed transitions prevent invalid state combinations. Blocked items prevent all transitions, ensuring workflow consistency.

### 7. User-Owned Work Item Management
Users can change the status of work items they created (JIRA-like behavior), regardless of role. This allows task owners to manage their own workflow while maintaining role-based restrictions for blocking/unblocking.

### 8. Soft Authorization Pattern
VIEWER/OPERATOR users can only access items they created (except ADMIN). This provides data isolation without row-level security complexity.

## Testing the System

### 1. Create Test Users
- Register new users (they will be INACTIVE by default)
- Login as admin and navigate to Users Management
- Activate users and assign appropriate roles (ADMIN, OPERATOR, VIEWER)
- Test that INACTIVE users cannot login
- Test that SUSPENDED users cannot perform actions

### 2. Test User Status Management
- Register a new user (should be INACTIVE)
- As admin, try to set INACTIVE user to SUSPENDED (should not be possible)
- Activate the user (INACTIVE → ACTIVE)
- As admin, verify you can now set them to SUSPENDED
- Suspend the user and verify they cannot login or perform actions
- Reactivate the user and verify they can login again

### 3. Create Work Items
- Create items as different users
- Verify authorization boundaries
- Test that users can change status of their own work items

### 4. Test State Transitions
- Try invalid transitions (should be rejected)
- Try transitions on blocked items (should fail)
- Verify users can transition their own work items
- Verify history recording

### 5. Test Blocking
- As OPERATOR/ADMIN, block items and verify cannot transition
- Unblock and verify can transition again
- Verify VIEWER cannot block/unblock items

### 6. Verify History
- Check that all actions are recorded
- Verify audit trail shows correct sequence
- Test Activity History page for individual and system-wide history

## Known Limitations

1. **No Pagination**: List endpoints return all records. Production would need pagination.

2. **No Soft Deletes**: Deleted records are hard deleted. Production should use soft deletes with timestamped `deletedAt`.

3. **No Rate Limiting**: No request rate limiting implemented. Production should add.

4. **Basic Error Messages**: Error messages are functional but not localized. Production would need i18n support.

5. **No Email Verification**: Registration doesn't send verification emails. Production should implement.

6. **Concurrent Update Conflicts**: No optimistic locking. Race conditions on simultaneous updates not handled.

7. **No Admin Self-Protection**: Admin cannot change their own role or status (enforced in UI), but this should also be enforced server-side for additional security.

## Future Enhancements

- Email verification and password reset flows
- Email notifications when user status changes
- Pagination and advanced filtering
- Work item dependencies and critical path
- Bulk operations
- WebSocket notifications for real-time updates
- Advanced search and filtering
- Custom field support
- Workflow templates
- Integration with external systems
- Metrics and reporting dashboard
- Admin self-protection (prevent admin from changing own role/status server-side)
- User activity monitoring and analytics

## Security Considerations

- **Password Storage**: Bcrypt with salt rounds = 10
- **Token Expiration**: 24 hours (configurable)
- **CORS**: Enabled for development, should be restricted in production
- **Input Validation**: All inputs validated with class-validator
- **SQL Injection**: Protected via Prisma parameterized queries
- **Authorization**: Server-side enforcement on all protected endpoints
- **User Status Guard**: Prevents SUSPENDED and INACTIVE users from performing actions
- **Admin Self-Protection**: Admin cannot change their own role or status (UI enforced)
- **Error Handling**: Proper error messages without exposing sensitive information

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
- Check user status is ACTIVE (INACTIVE and SUSPENDED users cannot login)
- If user is INACTIVE, admin needs to activate them via Users Management page
- If user is SUSPENDED, admin needs to reactivate them

### State transitions fail
- Verify work item is not blocked
- Check allowed transitions for current state
- Verify user owns the work item (or is ADMIN)
- Check user status is ACTIVE (suspended users cannot perform actions)

### User cannot login after registration
- New users are INACTIVE by default
- Admin must activate the user via Users Management page
- Navigate to `/users` as admin and set user status to ACTIVE

### Suspended user sees errors
- Suspended users are automatically logged out when they try to perform actions
- Error message will show "Your account has been suspended"
- Admin needs to reactivate the user via Users Management page

## License

MIT

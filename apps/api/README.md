# Engenius API - Hexagonal Architecture

## 📁 Project Structure

```
src/
├── core/                    # Core Domain (Inner circle - Business Logic)
│   ├── domain/              # Entities, Value Objects, Domain Events
│   ├── ports/               # Interfaces (Repository, Service ports)
│   └── use-cases/           # Application use cases / Services
│
├── infrastructure/          # Adapters (Outer circle - Technical Details)
│   ├── database/            # Database adapters
│   │   ├── drizzle/        # Drizzle schema, migrations
│   │   └── repositories/   # Repository implementations
│   ├── http/               # HTTP adapters
│   │   ├── routes/         # Elysia route definitions
│   │   └── controllers/    # Request handlers
│   └── services/           # External service adapters (email, etc.)
│
├── shared/                  # Shared utilities
│   ├── config/             # Configuration
│   ├── utils/              # Helper functions
│   └── types/              # Shared types
│
└── main.ts                 # Application entry point
```

## 🎯 Hexagonal Architecture Principles

### Core (Domain + Use Cases)
- **NO external dependencies**
- Pure business logic
- Defines interfaces/ports for external interactions

### Infrastructure (Adapters)
- Implements interfaces defined in Core
- Contains technical details (Drizzle, Elysia, etc.)
- Can be replaced without affecting Core

### Dependency Flow
```
Infrastructure → Core
External       → Core → Ports
```

## 📝 Conventions

### Domain Layer
- Entities: Core business objects
- Value Objects: Immutable values
- Domain Events: Something that happened in the domain

### Ports
- Repository Interfaces: Data access contracts
- Service Interfaces: External service contracts

### Use Cases
- Application services
- Orchestrate domain logic
- Implement business workflows

### Adapters
- Repository Implementations: Drizzle ORM
- Controllers: Elysia route handlers
- External Services: Email, SMS, etc.

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Generate database migrations
bun run db:generate

# Push schema to database (development only)
bun run db:push

# Run migrations
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio
```

## 📡 API Endpoints

### Health Check
- `GET /` - API health check

### Users
- `GET /users` - Get all users (with pagination)
- `GET /users/:id` - Get user by ID
- `GET /users/email/:email` - Get user by email
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user
- `POST /users/verify-otp` - Verify OTP and activate user
- `GET /users/:id/membership` - Check membership status

### Payments
- `GET /payments` - Get all payments
- `GET /payments/:id` - Get payment by ID
- `GET /payments/user/:userId` - Get user's payment history
- `GET /payments/pending` - Get pending payments
- `GET /payments/activate/:code` - Get payment by activate code
- `POST /payments` - Create new payment
- `PUT /payments/:id/status` - Update payment status
- `POST /payments/activate` - Activate payment with code

## 🗄️ Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| firstname | varchar(255) | First name |
| lastname | varchar(255) | Last name |
| email | varchar(255) | Email (unique) |
| phone | varchar | Phone number |
| university | varchar | University |
| department | varchar | Department/Faculty |
| exp | timestamp | Membership expiry |
| exp_korpor | timestamp | Korpor course expiry |
| exp_otp | timestamp | OTP expiry |
| subject | json | Subjects and sheets |
| role | json | User roles (e.g., ["user", "admin"]) |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |
| time | int4 | Remaining time (seconds) |
| activated | bool | Account activation status |
| otp | varchar | Latest OTP |
| examination_fields | json | Exam fields selected |
| token | varchar | Auth token |
| profile | varchar | Profile image URL |
| deleted_at | timestamp | Soft delete timestamp |

### Payment Stripe Table
| Column | Type | Description |
|--------|------|-------------|
| id | serial4 | Primary key |
| user_id | varchar | User ID |
| username | varchar | Username |
| price | numeric(10,2) | Price |
| day | int4 | Number of days |
| subjects | jsonb | Purchased subjects |
| sheets | jsonb | Purchased sheets |
| status | bool | Payment status |
| activate | bool | Activation status |
| activate_code | varchar | Activation code |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |
| deleted_at | timestamp | Soft delete timestamp |

## 🏗️ Architecture Example

```typescript
// 1. Domain Entity (Core) - Pure business logic
class User {
  isAdmin(): boolean { ... }
  isMembershipExpired(): boolean { ... }
}

// 2. Repository Port (Core) - Interface
interface UserRepository {
  findById(id: string): Promise<User | null>;
  ...
}

// 3. Repository Implementation (Infrastructure) - Drizzle
class UserRepositoryImpl implements UserRepository {
  async findById(id: string) {
    return await db.select().from(users).where(eq(users.id, id));
  }
}

// 4. Use Case (Core) - Application logic
class UserUseCase {
  constructor(private repo: UserRepository) {}
  async getUser(id: string) {
    return await this.repo.findById(id);
  }
}

// 5. Controller (Infrastructure) - HTTP layer
class UserController {
  constructor(private useCase: UserUseCase) {}
  async getUser(id: string) {
    return await this.useCase.getUser(id);
  }
}

// 6. Main.ts - Dependency injection
const repo = new UserRepositoryImpl();
const useCase = new UserUseCase(repo);
const controller = new UserController(useCase);
```

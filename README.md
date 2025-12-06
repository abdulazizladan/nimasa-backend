# NIMASA Backend API

Backend API for the Nigerian Maritime Administration and Safety Agency (NIMASA) organizational management system. This application provides comprehensive endpoints for managing organizations, departments, projects, performance tracking, and reporting.

## Description

A robust NestJS-based REST API that powers the NIMASA organizational management platform. The system enables efficient management of organizational structures, departmental operations, project tracking, performance monitoring, and comprehensive reporting capabilities.

## Features

### 🏢 Organization Management
- Create and manage organizations with unique codes
- Hierarchical department structure
- Priority area assignments
- Organization-wide reporting and analytics

### 👥 Department Management
- Department creation and updates
- Department-specific performance tracking
- Task and project assignment
- Department analytics and visualizations

### 📊 Project Management
- Project creation and lifecycle management
- Task tracking and assignment
- Project status monitoring
- Progress reporting

### 📈 Performance Tracking
- Department performance metrics
- Monthly performance trends
- Task completion analytics
- Performance rating system

### 📋 Reporting
- Organization performance reports
- Department-specific reports
- Custom report generation
- Data export capabilities

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- User management
- Secure password handling with bcrypt

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: SQLite with TypeORM
- **Authentication**: Passport.js with JWT strategy
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SQLite3

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Application
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=1d

# Database
DATABASE_PATH=./db.sqlite
```

## Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the application is running, access the interactive Swagger API documentation at:

```
http://localhost:3000/api
```

### Main API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile

#### Organizations
- `GET /organization` - List all organizations
- `POST /organization` - Create organization
- `GET /organization/:code` - Get organization by code
- `PATCH /organization/:code` - Update organization
- `DELETE /organization/:code` - Delete organization
- `GET /organization/priority-area` - List priority areas

#### Departments
- `POST /organization/department` - Create department
- `GET /organization/department/:id` - Get department by ID
- `PATCH /organization/department/:id` - Update department

#### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project by ID
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Performance
- `GET /performance/department/:code` - Get department performance
- `GET /performance/department/:code/monthly` - Monthly performance trends

#### Reports
- `GET /report/organization/:code` - Organization performance report
- `GET /report/department/:id` - Department performance report

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── guards/        # Auth guards
│   ├── strategies/    # Passport strategies
│   └── dto/           # Auth DTOs
├── user/              # User management module
│   ├── entities/      # User entity
│   └── dto/           # User DTOs
├── organization/      # Organization & Department module
│   ├── entities/      # Organization, Department, PriorityArea entities
│   └── DTO/           # Organization DTOs
├── projects/          # Project management module
│   ├── entities/      # Project, Task entities
│   └── DTOs/          # Project DTOs
├── performance/       # Performance tracking module
│   ├── entities/      # Performance entities
│   └── dto/           # Performance DTOs
├── report/            # Reporting module
└── main.ts            # Application entry point
```

## Database

The application uses SQLite for data persistence with TypeORM as the ORM. The database file is located at `db.sqlite` in the root directory.

### Auto-synchronization

⚠️ **Warning**: `synchronize: true` is enabled in development for automatic schema updates. **Disable this in production** and use migrations instead.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Docker Support

Build and run using Docker:

```bash
# Build image
docker build -t nimasa-backend .

# Run container
docker run -p 3000:3000 nimasa-backend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRATION` | JWT token expiration | `1d` |
| `DATABASE_PATH` | SQLite database path | `./db.sqlite` |

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Input validation using class-validator
- CORS enabled for frontend integration
- Environment variables for sensitive data

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

UNLICENSED - Private/Proprietary

## Support

For issues and questions, please contact the development team.

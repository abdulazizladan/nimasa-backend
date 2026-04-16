# Backend API Endpoints Documentation

This document outlines the available REST API endpoints in the NestJS application, their URL paths, request payloads, and response structures along with data types.

---

## 1. Authentication module (`/auth`)
Handles user authentication, login, and password resetting.

### `POST /auth/login`
Authenticates a user and returns a token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response Body:**
  ```json
  {
    "access_token": "string",
    "token": "string",
    "user": {
      "id": "string (uuid)",
      "email": "string",
      "role": "string",
      "status": "string",
      "info": {
        "firstName": "string",
        "lastName": "string",
        "image": "string"
      },
      "contact": {
        "phone": "string"
      }
    }
  }
  ```
### `POST /auth/register`
Registers a new user (admin, director, or manager).
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "enum (admin | director | manager)",
    "status": "string (optional)",
    "info": {
      "firstName": "string",
      "lastName": "string",
      "image": "string (optional)"
    },
    "contact": {
      "phone": "string (optional)"
    }
  }
  ```
- **Response Body:** `User` object
  ```json
  {
    "id": "string (uuid)",
    "email": "string",
    "role": "string",
    "status": "string",
    "info": {
      "firstName": "string",
      "lastName": "string",
      "image": "string"
    },
    "contact": {
      "phone": "string"
    }
  }
  ```


### `POST /auth/reset-password`
Initiates a password reset process.
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Response Body:**
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

---

## 2. Users module (`/users`)
Handles User entity CRUD. 

### `GET /users`
Retrieves a list of all users.
- **Query Params:** None
- **Response Body:** `User[]`
  ```json
  [
    {
      "id": "string (uuid)",
      "email": "string",
      "role": "string",
      "status": "string",
      "info": { ... }
    }
  ]
  ```

### `POST /users`
Create a new user.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "enum (admin | director | manager)",
    "status": "string (optional)",
    "info": {
      "firstName": "string",
      "lastName": "string",
      "image": "string (optional)"
    },
    "contact": {
      "phone": "string (optional)"
    }
  }
  ```
- **Response Body:** `User` object (same as above).

### `GET /users/:email`
Retrieve a single user by email.
- **Response Body:** `User` object.

### `PATCH /users/:email`
Updates an existing user.
- **Request Body:** Partial `User` payload (fields are optional).
- **Response Body:** `User` object.

### `DELETE /users/:email`
Deletes a user.
- **Response Status:** `200 OK`
- **Response Body:** `{ message: "User deleted successfully" }` (or void depending on config).

---

## 3. Agency Management module (`/agencies`)
Used for maintaining the `Organization` records.

### `GET /agencies`
- **Query Params:** `?includeDepartments=boolean`
- **Response Body:** `Organization[]`
  ```json
  [
    {
      "id": "string (uuid)",
      "name": "string",
      "code": "string",
      "type": "string",
      "status": "string",
      "headOfAgency": "string",
      "baseColor": "string",
      "logo": "string",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
  ```

### `POST /agencies`
- **Request Body:**
  ```json
  {
    "name": "string",
    "code": "string",
    "type": "string",
    "status": "string",
    "headOfAgency": "string",
    "contactEmail": "string"
  }
  ```
- **Response Body:** `Organization` object.

### `GET /agencies/:code`
- **Response Body:** `Organization` object.

### `PATCH /agencies/:code`
- **Request Body:** Partial `Organization` payload.
- **Response Body:** `Organization` object.

### `DELETE /agencies/:code`
- **Response Status:** `204 No Content`

---

## 4. Departments module (`/departments`)

### `GET /departments`
- **Response Body:** `Department[]`
  ```json
  [
    {
      "id": "string (uuid)",
      "name": "string",
      "headOfDepartment": "string",
      "organization": "Organization Object"
    }
  ]
  ```

### `POST /departments`
- **Request Body:**
  ```json
  {
    "name": "string",
    "organizationCode": "string",
    "headOfDepartment": "string (optional)"
  }
  ```
- **Response Body:** `Department` object.

### `GET /departments/:id`
- **Response Body:** `Department` object.

### `PATCH /departments/:id`
- **Request Body:**
  ```json
  {
    "name": "string (optional)",
    "headOfDepartment": "string (optional)"
  }
  ```
- **Response Body:** `Department` object.

---

## 5. Deliverables (`/agency-deliverables` & `/high-impact-deliverables`)
Handles the `Deliverable` entity containing baseline data, quarterly target vs actuals.

### `GET /agency-deliverables`
### `GET /high-impact-deliverables`
- **Query Params:** `?ministry=string`, `?priorityArea=string` (optional filters based on DTO)
- **Response Body:** `Deliverable[]`
  ```json
  [
    {
      "id": "string (uuid)",
      "serialNumber": "number",
      "ministry": "string",
      "priorityArea": "string",
      "outcome": "string",
      "deliverable": "string",
      "baselineType": "string",
      "indicator": "string",
      "baseline2023": "number",
      "q1_2024_target": "number",
      "q1_2024_actual": "number",
      "responsibleDepartment": "string",
      "supportingEvidence": "string"
    }
  ]
  ```

### `POST /agency-deliverables`
### `POST /high-impact-deliverables`
- **Request Body:**
  ```json
  {
      "serialNumber": "number",
      "ministry": "string",
      "priorityArea": "string",
      "outcome": "string",
      "deliverable": "string",
      "indicator": "string",
      "baselineType": "string",
      "responsibleDepartment": "string",
      "supportingEvidence": "string"
  }
  ```
- **Response Body:** `Deliverable` object.

### `PATCH /agency-deliverables/:id`
### `PATCH /high-impact-deliverables/:id`
- **Request Body:** Partial `Deliverable` attributes (e.g. `{"q1_2024_actual": 5}`).
- **Response Body:** `Deliverable` object.

---

## 6. Quarterly Reports (`/quarterly-reports`)
Wraps the `MonthlySubmission` relations linked to a specific Deliverable.

### `GET /quarterly-reports`
- **Query Params:** 
  - `deliverableId` (string, required)
  - `quarter` (string, optional)
  - `year` (string, optional)
- **Response Body:** `MonthlySubmission[]`
  ```json
  [
    {
      "id": "string (uuid)",
      "month": "number",
      "year": "number",
      "status": "string",
      "comments": "string",
      "evidenceLinks": ["string"],
      "createdAt": "Date"
    }
  ]
  ```

### `POST /quarterly-reports`
Adds a recurring report to a deliverable. 
- **Query Params:** `deliverableId` (string)
- **Request Body:**
  ```json
  {
    "year": "number",
    "month": "number",
    "status": "string",
    "comments": "string",
    "evidenceLinks": ["string"]
  }
  ```
- **Response Body:** `MonthlySubmission` object.

---

## 7. Performance Bond Deliverables (`/performance-bond-deliverables`)
Handles `DepartmentMonthlyPerformance` entity for KPI tracking.

### `POST /performance-bond-deliverables/department-monthly`
Creates or updates a monthly check-in for a department's performance tasks.
- **Request Body:**
  ```json
  {
    "departmentId": "string (uuid)",
    "year": "number",
    "month": "number",
    "totalTargets": "number",
    "completedTargets": "number",
    "outstandingTargets": "number",
    "unmetTargets": "number",
    "keyAchievements": "string",
    "challenges": "string",
    "recommendations": "string"
  }
  ```
- **Response Body:** `DepartmentMonthlyPerformance` object.

### `PATCH /performance-bond-deliverables/department-monthly/:id`
- **Request Body:** Partial update fields of the Performance entity.
- **Response Body:** `DepartmentMonthlyPerformance` object.

### `GET /performance-bond-deliverables/department/:departmentId/current`
- **Response Body:** `DepartmentMonthlyPerformance` object representing the most recent submission.

### `GET /performance-bond-deliverables/department/:departmentId/summary`
Retrieves aggregation data.
- **Response Body:**
  ```json
  {
    "departmentId": "string (uuid)",
    "currentMonth": {
      "year": "number",
      "month": "number",
      "totalTargets": "number",
      "completedTargets": "number"
    },
    "previousMonth": { ... }
  }
  ```

---

## 8. Dashboard Analytics (`/dashboard`)

### `GET /dashboard/performance-report`
- **Query Params:** `?year=string` (optional)
- **Response Body:**
  ```json
  {
    "year": "string | number",
    "priorityAreas": ["array of areas"],
    "totalDeliverables": "number",
    "quarterlyPerformance": {}
  }
  ```

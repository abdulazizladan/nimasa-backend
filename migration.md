# NestJS Backend API Migration Document

This document outlines the required REST APIs (endpoints, request/response structures, and methods) that need to be developed in the NestJS application to support the Angular frontend. The requirements are gathered by analyzing the frontend store definitions, injectable services, and data models.

## 1. Authentication Module (`/auth`)
Handles user authentication and session management.

* **POST** `/auth/login`
  * **Payload:** `{ email, password }`
  * **Response:** `{ token, user: User }`
* **POST** `/auth/reset-password`
  * **Payload:** `{ email }`
  * **Response:** `{ message: 'Success' }`

## 2. Users Management Module (`/users`)
Handles administration of users based on `User`, `UserRole`, and `UserStatus` models.

* **GET** `/users`
  * **Response:** `User[]`
* **GET** `/users/:id`
  * **Response:** `User`
* **POST** `/users`
  * **Payload:** `{ name, email, role, status }`
  * **Response:** `User`
* **PUT** `/users/:id`
  * **Payload:** `{ name, email, role, status }`
* **DELETE** `/users/:id`

## 3. Agency Management Module (`/agencies`)
Handles tracking of agencies based on the `Agency` model.

* **GET** `/agencies`
  * **Response:** `Agency[]`
* **GET** `/agencies/:id`
  * **Response:** `Agency`
* **POST** `/agencies`
  * **Payload:** `{ name, code, type, status, headOfAgency, contactEmail }`
* **PUT** `/agencies/:id`
* **DELETE** `/agencies/:id`

## 4. Agency Deliverables Module (`/agency-deliverables` & `/departments`)
Manages internal departments and their specific deliverables (`AgencyDeliverable` & `Department` models).

* **GET** `/departments`
  * **Response:** `Department[]`
* **GET** `/agency-deliverables`
  * **Query Params:** `?departmentId={id}`
  * **Response:** `AgencyDeliverable[]`
* **POST** `/agency-deliverables`
  * **Payload:** `{ name, department, yearlyData }`
* **PUT** `/agency-deliverables/:id`
* **DELETE** `/agency-deliverables/:id`

## 5. Performance Bond Deliverables Module (`/performance-bond-deliverables`)
Handles KPI Tracking and execution based on the `KPIReport` model.

* **GET** `/performance-bond-deliverables`
  * **Response:** `KPIReport[]`
* **GET** `/performance-bond-deliverables/:id`
  * **Response:** `KPIReport`
* **POST** `/performance-bond-deliverables`
  * **Payload:** `{ priorityArea, deliverable, indicator, baseline2023, yearlyPerformance, projections }`
* **PUT** `/performance-bond-deliverables/:id`
* **POST** `/performance-bond-deliverables/:id/evidence`
  * **Payload:** `multipart/form-data` (File upload for `evidenceFile`)

## 6. High Impact Deliverables Module (`/high-impact-deliverables` & `/quarterly-reports`)
Manages strategic impact deliverables and their quarterly progress reports (`HighImpactDeliverable` & `QuarterlyReport`).

* **GET** `/high-impact-deliverables`
  * **Response:** `HighImpactDeliverable[]`
* **POST** `/high-impact-deliverables`
  * **Payload:** `{ ministry, priorityArea, outcome, deliverable, indicators }`
* **PUT** `/high-impact-deliverables/:id`

* **GET** `/quarterly-reports`
  * **Query Params:** `?deliverableId={id}&quarter={Q1|Q2|Q3|Q4}&year={YYYY}`
  * **Response:** `QuarterlyReport[]`
* **POST** `/quarterly-reports`
  * **Payload:** `{ indicatorName, groupSn, quarter, year, expectedMilestones, achievedMilestones, target, actual, challenges, mdaEffort, supportRequired }`

## 7. Dashboard & Analytics Module (`/dashboard`)
Provides aggregated data for the admin dashboards (`PerformanceReport` & `DashboardStore`).

* **GET** `/dashboard/performance-report`
  * **Query Params:** `?year={YYYY}`
  * **Response:** `PerformanceReport` (Aggregated statistics containing priority areas, total deliverables, and quarterly actuals vs targets mapped according to the active year)

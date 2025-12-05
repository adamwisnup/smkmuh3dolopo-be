# SMK MUH 3 DOLOPO API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
- **JWT Bearer Token** authentication is required for most endpoints
- **Role-based access control** with two roles:
  - `SUPER_ADMIN` - Full access to all endpoints
  - Regular authenticated users - Limited access based on endpoint

## Headers
For authenticated requests, include:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Module

### 1.1 Admin Login
```http
POST /auth/login/admin
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "meta": {
    "code": 200,
    "success": true,
    "message": "Admin logged in successfully"
  },
  "data": {
    "access_token": "string"
  }
}
```

---

### 1.2 Get All Admins (SUPER_ADMIN only)
```http
GET /auth/admin?page=1&limit=10
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

---

### 1.3 Get Admin by ID (SUPER_ADMIN only)
```http
GET /auth/admin/:id
```

---

### 1.4 Create Admin (SUPER_ADMIN only)
```http
POST /auth/admin
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

---

### 1.5 Update Admin (SUPER_ADMIN only)
```http
PATCH /auth/admin/:id
```

**Note:** Admin cannot update their own role

---

### 1.6 Delete Admin (SUPER_ADMIN only)
```http
DELETE /auth/admin/:id
```

**Note:** Admin cannot delete themselves

---

## 2. Students Module

### 2.1 Get All Students (SUPER_ADMIN only)
```http
GET /students?page=1&limit=10
```

---

### 2.2 Get Student by ID (SUPER_ADMIN only)
```http
GET /students/:id
```

---

### 2.3 Create Student (Public)
```http
POST /students
```

**Request Body:**
```json
{
  "name": "string",
  "gender": "string",
  "place_of_birth": "string",
  "date_of_birth": "ISO date string",
  "address": "string",
  "phone_number": "string",
  "from_school": "string",
  "graduation_year": "number",
  "biological_father": "string",
  "biological_mother": "string",
  "father_condition": "string",
  "mother_condition": "string",
  "father_job": "string",
  "mother_job": "string",
  "parent_guardian_phone_number": "string",
  "major": "string",
  "recommendation_from": "string"
}
```

---

### 2.4 Update Student (SUPER_ADMIN only)
```http
PATCH /students/:id
```

---

### 2.5 Delete Student (SUPER_ADMIN only)
```http
DELETE /students/:id
```

---

### 2.6 Get Registered Students Count (SUPER_ADMIN only)
```http
GET /students/stats/registered-count
```

---

### 2.7 Get Last Week Registered Count (SUPER_ADMIN only)
```http
GET /students/stats/last-week-registered-count
```

---

## 3. Teachers Module

### 3.1 Get All Teachers (Public)
```http
GET /teachers?page=1&limit=10
```

---

### 3.2 Get Teacher by ID (Public)
```http
GET /teachers/:id
```

---

### 3.3 Create Teacher (JWT required)
```http
POST /teachers
Content-Type: multipart/form-data
```

**Request Body:**
- `name`: string
- `position`: string
- `nip`: string
- `subject`: string
- `photo`: file (optional)

---

### 3.4 Update Teacher (JWT required)
```http
PATCH /teachers/:id
Content-Type: multipart/form-data
```

---

### 3.5 Delete Teacher (JWT required)
```http
DELETE /teachers/:id
```

---

## 4. Careers Module

### 4.1 Get All Careers (Public)
```http
GET /careers?page=1&limit=10
```

---

### 4.2 Get Career by ID (Public)
```http
GET /careers/:id
```

---

### 4.3 Create Career (JWT required)
```http
POST /careers
Content-Type: multipart/form-data
```

**Request Body:**
- `position`: string
- `description`: string
- `requirements`: string
- `photo`: file (optional)

---

### 4.4 Update Career (JWT required)
```http
PATCH /careers/:id
Content-Type: multipart/form-data
```

---

### 4.5 Delete Career (JWT required)
```http
DELETE /careers/:id
```

---

## 5. News Module

### 5.1 Get All News (JWT required)
```http
GET /news?page=1&limit=10
```

---

### 5.2 Get Published News (Public)
```http
GET /news/published?page=1&limit=10
```

---

### 5.3 Get News by ID (Public)
```http
GET /news/:id
```

---

### 5.4 Create News (JWT required)
```http
POST /news
Content-Type: multipart/form-data
```

**Request Body:**
- `title`: string
- `content`: string
- `status`: "DRAFT" | "PUBLISHED"
- `photo`: file (optional)

---

### 5.5 Update News (JWT required)
```http
PATCH /news/:id
Content-Type: multipart/form-data
```

---

### 5.6 Delete News (JWT required)
```http
DELETE /news/:id
```

---

### 5.7 Get Published News Count (JWT required)
```http
GET /news/stats/published-count
```

---

### 5.8 Get Total News Count (JWT required)
```http
GET /news/stats/total-count
```

---

## 6. Social Media Module

### 6.1 Get All Social Media (Public)
```http
GET /social-media?page=1&limit=10
```

---

### 6.2 Get Social Media by ID (Public)
```http
GET /social-media/:id
```

---

### 6.3 Create Social Media (JWT required)
```http
POST /social-media
```

**Request Body:**
```json
{
  "platform": "string",
  "url": "string",
  "icon": "string"
}
```

---

### 6.4 Update Social Media (JWT required)
```http
PATCH /social-media/:id
```

---

### 6.5 Delete Social Media (JWT required)
```http
DELETE /social-media/:id
```

---

## Global Response Format

### Success Response
```json
{
  "meta": {
    "code": number,
    "success": true,
    "message": "string"
  },
  "data": any
}
```

### Error Response
```json
{
  "meta": {
    "code": number,
    "success": false,
    "message": "string"
  }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## CORS Configuration
The API allows requests from:
- `http://localhost:3000`
- `https://fe-smk3-dolopoh-r96n.vercel.app`

---

## Security Features
1. **JWT Authentication** - All protected endpoints require valid JWT token
2. **Role-based Access Control** - SUPER_ADMIN role for sensitive operations
3. **Input Validation** - Using class-validator decorators
4. **File Upload Security** - Multer configured for image uploads
5. **CORS Protection** - Restricted to specific domains
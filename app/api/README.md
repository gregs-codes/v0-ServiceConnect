# ServiceConnect API Documentation

This document provides information about the available API endpoints in the ServiceConnect application.

## Base URL

When running locally:
\`\`\`
http://localhost:3000/api
\`\`\`

When deployed on Vercel:
\`\`\`
https://your-vercel-deployment-url.vercel.app/api
\`\`\`

## Authentication

Most endpoints require authentication via a JWT token. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

## API Endpoints

### Providers

#### Get All Providers
- **URL**: `/api/providers`
- **Method**: `GET`
- **Query Parameters**:
  - `profession` (optional) - Filter by profession (e.g., "Welder")
  - `location` (optional) - Filter by location
  - `minRating` (optional) - Minimum rating value (0-5)
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Providers retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "John Smith",
        "profession": "Welder",
        "location": "New York, NY",
        "rating": 4.9,
        "specialties": ["TIG Welding", "MIG Welding", "Pipe Welding"],
        "hourlyRate": 75,
        "image": "/placeholder.svg?height=300&width=300",
        "verified": true
      },
      // ...more providers
    ]
  }
  \`\`\`

#### Create Provider
- **URL**: `/api/providers`
- **Method**: `POST`
- **Body**:
  \`\`\`json
  {
    "name": "Jane Doe",
    "profession": "Electrician",
    "location": "Denver, CO",
    "specialties": ["Residential Wiring", "Smart Home Installation"],
    "hourlyRate": 85,
    "image": "/placeholder.svg?height=300&width=300"
  }
  \`\`\`
- **Success Response**: Status 201
  \`\`\`json
  {
    "success": true,
    "message": "Provider created successfully",
    "data": {
      "id": 4,
      "name": "Jane Doe",
      "profession": "Electrician",
      "location": "Denver, CO",
      "specialties": ["Residential Wiring", "Smart Home Installation"],
      "hourlyRate": 85,
      "image": "/placeholder.svg?height=300&width=300",
      "rating": 0,
      "verified": false
    }
  }
  \`\`\`

#### Get Provider by ID
- **URL**: `/api/providers/:id`
- **Method**: `GET`
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Provider retrieved successfully",
    "data": {
      "id": 1,
      "name": "John Smith",
      "profession": "Welder",
      "location": "New York, NY",
      "rating": 4.9,
      "specialties": ["TIG Welding", "MIG Welding", "Pipe Welding"],
      "hourlyRate": 75,
      "image": "/placeholder.svg?height=300&width=300",
      "verified": true
    }
  }
  \`\`\`

#### Update Provider
- **URL**: `/api/providers/:id`
- **Method**: `PUT`
- **Body**:
  \`\`\`json
  {
    "hourlyRate": 80,
    "specialties": ["TIG Welding", "MIG Welding", "Pipe Welding", "Aluminum Welding"]
  }
  \`\`\`
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Provider updated successfully",
    "data": {
      "id": 1,
      "name": "John Smith",
      "profession": "Welder",
      "location": "New York, NY",
      "rating": 4.9,
      "specialties": ["TIG Welding", "MIG Welding", "Pipe Welding", "Aluminum Welding"],
      "hourlyRate": 80,
      "image": "/placeholder.svg?height=300&width=300",
      "verified": true
    }
  }
  \`\`\`

#### Delete Provider
- **URL**: `/api/providers/:id`
- **Method**: `DELETE`
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Provider deleted successfully",
    "data": null
  }
  \`\`\`

### Authentication

#### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  \`\`\`json
  {
    "name": "Test User",
    "email": "user@example.com",
    "password": "password123",
    "accountType": "client"
  }
  \`\`\`
- **Success  "user@example.com",
    "password": "password123",
    "accountType": "client"
  }
  \`\`\`
- **Success Response**: Status 201
  \`\`\`json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "name": "Test User",
      "email": "user@example.com",
      "accountType": "client",
      "createdAt": "2023-05-04T00:22:35.000Z"
    }
  }
  \`\`\`

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  \`\`\`json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  \`\`\`
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": 1,
        "name": "Test User",
        "email": "user@example.com",
        "accountType": "client",
        "createdAt": "2023-05-01T00:00:00.000Z"
      },
      "token": "sample-jwt-token"
    }
  }
  \`\`\`

### Services

#### Get All Services
- **URL**: `/api/services`
- **Method**: `GET`
- **Query Parameters**:
  - `category` (optional) - Filter by category (e.g., "electrical")
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Services retrieved successfully",
    "data": [
      {
        "id": "electrical",
        "title": "Electrical Services",
        "description": "Professional electrical installation, repair, and maintenance services.",
        "features": [
          "Residential and commercial wiring",
          "Lighting installation and repair",
          "Panel upgrades and circuit installation",
          "Electrical troubleshooting and safety inspections"
        ],
        "image": "/electrician-working.png"
      },
      // ...more services
    ]
  }
  \`\`\`

#### Create Service
- **URL**: `/api/services`
- **Method**: `POST`
- **Body**:
  \`\`\`json
  {
    "id": "roofing",
    "title": "Roofing Services",
    "description": "Professional roof installation and repair services.",
    "features": [
      "Roof inspections",
      "Shingle replacement",
      "Leak repairs",
      "New roof installation"
    ],
    "image": "/roofing.png"
  }
  \`\`\`
- **Success Response**: Status 201
  \`\`\`json
  {
    "success": true,
    "message": "Service created successfully",
    "data": {
      "id": "roofing",
      "title": "Roofing Services",
      "description": "Professional roof installation and repair services.",
      "features": [
        "Roof inspections",
        "Shingle replacement",
        "Leak repairs",
        "New roof installation"
      ],
      "image": "/roofing.png"
    }
  }
  \`\`\`

### Bookings

#### Get All Bookings
- **URL**: `/api/bookings`
- **Method**: `GET`
- **Query Parameters**:
  - `userId` (optional) - Filter by user ID
  - `providerId` (optional) - Filter by provider ID
  - `status` (optional) - Filter by status (e.g., "pending", "confirmed")
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Bookings retrieved successfully",
    "data": [
      {
        "id": 1,
        "userId": 1,
        "providerId": 2,
        "serviceType": "Electrical",
        "status": "confirmed",
        "date": "2023-08-15",
        "startTime": "10:00",
        "endTime": "12:00",
        "totalPrice": 130,
        "description": "Install new lighting fixtures in kitchen",
        "createdAt": "2023-07-20T14:30:00.000Z"
      },
      // ...more bookings
    ]
  }
  \`\`\`

#### Create Booking
- **URL**: `/api/bookings`
- **Method**: `POST`
- **Body**:
  \`\`\`json
  {
    "userId": 1,
    "providerId": 3,
    "serviceType": "Plumbing",
    "date": "2023-09-01",
    "startTime": "13:00",
    "endTime": "15:00",
    "totalPrice": 150,
    "description": "Replace bathroom sink and faucet"
  }
  \`\`\`
- **Success Response**: Status 201
  \`\`\`json
  {
    "success": true,
    "message": "Booking created successfully",
    "data": {
      "id": 3,
      "userId": 1,
      "providerId": 3,
      "serviceType": "Plumbing",
      "status": "pending",
      "date": "2023-09-01",
      "startTime": "13:00",
      "endTime": "15:00",
      "totalPrice": 150,
      "description": "Replace bathroom sink and faucet",
      "createdAt": "2023-05-04T00:22:35.000Z"
    }
  }
  \`\`\`

#### Get Booking by ID
- **URL**: `/api/bookings/:id`
- **Method**: `GET`
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Booking retrieved successfully",
    "data": {
      "id": 1,
      "userId": 1,
      "providerId": 2,
      "serviceType": "Electrical",
      "status": "confirmed",
      "date": "2023-08-15",
      "startTime": "10:00",
      "endTime": "12:00",
      "totalPrice": 130,
      "description": "Install new lighting fixtures in kitchen",
      "createdAt": "2023-07-20T14:30:00.000Z"
    }
  }
  \`\`\`

#### Update Booking
- **URL**: `/api/bookings/:id`
- **Method**: `PUT`
- **Body**:
  \`\`\`json
  {
    "status": "confirmed",
    "date": "2023-08-16",
    "startTime": "11:00"
  }
  \`\`\`
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Booking updated successfully",
    "data": {
      "id": 1,
      "userId": 1,
      "providerId": 2,
      "serviceType": "Electrical",
      "status": "confirmed",
      "date": "2023-08-16",
      "startTime": "11:00",
      "endTime": "12:00",
      "totalPrice": 130,
      "description": "Install new lighting fixtures in kitchen",
      "createdAt": "2023-07-20T14:30:00.000Z"
    }
  }
  \`\`\`

#### Cancel Booking
- **URL**: `/api/bookings/:id`
- **Method**: `DELETE`
- **Success Response**: Status 200
  \`\`\`json
  {
    "success": true,
    "message": "Booking cancelled successfully",
    "data": null
  }
  \`\`\`

## Error Responses

All API endpoints return a standardized error response format:

\`\`\`json
{
  "success": false,
  "message": "Error message description",
  "statusCode": 400
}
\`\`\`

Common error status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., resource already exists)
- `500` - Internal Server Error

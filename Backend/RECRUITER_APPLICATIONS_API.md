# Recruiter Applications Feature

## Overview
Recruiters can now view all job applications across all their posted jobs in one place, with filtering and statistics.

## New API Endpoint

### GET `/api/v1/application/recruiter/all`
Get all applications for jobs posted by the authenticated recruiter.

**Authorization:** Recruiter only

**Query Parameters:**
- `status` (optional): Filter by status - `applied`, `rejected`, or `accepted`
- `jobId` (optional): Filter by specific job ID

**Response:**
```json
{
  "status": "success",
  "results": 15,
  "stats": {
    "total": 15,
    "applied": 10,
    "accepted": 3,
    "rejected": 2
  },
  "applications": [
    {
      "_id": "app123",
      "status": "applied",
      "appliedDate": "2025-12-27T10:30:00Z",
      "resume": "http://localhost:5001/uploads/resumes/resume-123.pdf",
      "feedback": null,
      "applicant": {
        "_id": "user123",
        "username": "John Doe",
        "email": "john@example.com",
        "phone": 1234567890,
        "city": "New York",
        "skills": ["JavaScript", "React", "Node.js"],
        "profilePhoto": {
          "url": "http://localhost:5001/uploads/profile-photos/photo-123.jpg"
        },
        "resume": {
          "url": "http://localhost:5001/uploads/resumes/resume-123.pdf"
        }
      },
      "job": {
        "_id": "job123",
        "title": "Frontend Developer",
        "location": "New York, NY",
        "salary": "$80,000 - $100,000",
        "timing": "Full Time",
        "company": {
          "_id": "comp123",
          "name": "Tech Corp",
          "logo": "https://example.com/logo.png"
        }
      }
    }
  ]
}
```

## Usage Examples

### 1. Get All Applications
```bash
GET /api/v1/application/recruiter/all
Authorization: Bearer <recruiter_token>
```

### 2. Get Only Pending Applications
```bash
GET /api/v1/application/recruiter/all?status=applied
Authorization: Bearer <recruiter_token>
```

### 3. Get Applications for Specific Job
```bash
GET /api/v1/application/recruiter/all?jobId=job123
Authorization: Bearer <recruiter_token>
```

### 4. Get Accepted Applications
```bash
GET /api/v1/application/recruiter/all?status=accepted
Authorization: Bearer <recruiter_token>
```

## Existing Recruiter Endpoints

### GET `/api/v1/application/:jobId/applications`
Get applications for a specific job.

### GET `/api/v1/application/:applicationId`
Get details of a single application.

### PATCH `/api/v1/application/:applicationId`
Update application status (accept/reject).

**Request Body:**
```json
{
  "status": "accepted",  // or "rejected"
  "feedback": "Great profile! Looking forward to the interview."
}
```

## Frontend Integration Example

```javascript
// Get all applications with statistics
const getAllApplications = async () => {
  try {
    const response = await fetch('/api/v1/application/recruiter/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    console.log('Total Applications:', data.stats.total);
    console.log('Pending:', data.stats.applied);
    console.log('Accepted:', data.stats.accepted);
    console.log('Rejected:', data.stats.rejected);
    
    return data.applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};

// Filter by status
const getPendingApplications = async () => {
  const response = await fetch('/api/v1/application/recruiter/all?status=applied', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Update application status
const updateStatus = async (applicationId, status, feedback) => {
  const response = await fetch(`/api/v1/application/${applicationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status, feedback })
  });
  return await response.json();
};
```

## Features

✅ **View All Applications** - See all applications across all posted jobs  
✅ **Statistics Dashboard** - Get counts by status (applied/accepted/rejected)  
✅ **Filter by Status** - View only pending, accepted, or rejected applications  
✅ **Filter by Job** - View applications for a specific job  
✅ **Complete Applicant Info** - Name, email, phone, skills, resume, profile photo  
✅ **Job Details** - Title, location, salary, company info  
✅ **Sorted by Date** - Most recent applications first  
✅ **Update Status** - Accept or reject applications with feedback  

## Response Fields

### Application Object
- `_id`: Application ID
- `status`: Current status (applied/accepted/rejected)
- `appliedDate`: Date when user applied
- `resume`: Resume URL (if uploaded during application)
- `feedback`: Recruiter's feedback (if provided)

### Populated Applicant Info
- `username`: Applicant's name
- `email`: Contact email
- `phone`: Contact phone
- `city`: Location
- `skills`: Array of skills
- `profilePhoto.url`: Profile picture URL
- `resume.url`: Latest resume URL

### Populated Job Info
- `title`: Job title
- `location`: Job location
- `salary`: Salary range
- `timing`: Full Time/Part Time/etc
- `company.name`: Company name
- `company.logo`: Company logo URL

## Job Seeker Endpoints

### POST `/api/v1/application/:jobId/apply`
Apply for a job.

**Request Body:**
```json
{
  "resume": "optional-resume-url"
}
```

### GET `/api/v1/application/myapplications`
Get all applications submitted by the logged-in job seeker.

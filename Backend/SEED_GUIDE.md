# Database Seeding Guide

## Overview
The database has been successfully populated with dummy data for all collections.

## What Was Seeded

### 📊 Summary
- **Users**: 5 (2 Recruiters + 3 Job Seekers)
- **Companies**: 5 
- **Jobs**: 8
- **Applications**: 15
- **Reviews**: 12

### 👥 User Accounts

#### Recruiters
1. **John Doe**
   - Email: `john.recruiter@example.com`
   - Password: `password123`
   - Location: Mumbai

2. **Sarah Johnson**
   - Email: `sarah.recruiter@example.com`
   - Password: `password123`
   - Location: Bangalore

#### Job Seekers
1. **Alex Smith** (Full Stack Developer)
   - Email: `alex.seeker@example.com`
   - Password: `password123`
   - Location: Pune
   - Skills: JavaScript, React, Node.js, MongoDB, Python

2. **Priya Sharma** (Data Scientist)
   - Email: `priya.seeker@example.com`
   - Password: `password123`
   - Location: Delhi
   - Skills: Python, Machine Learning, TensorFlow, Data Analysis, SQL

3. **Rahul Kumar** (UI/UX Designer)
   - Email: `rahul.seeker@example.com`
   - Password: `password123`
   - Location: Chennai
   - Skills: Figma, Adobe XD, UI Design, UX Research, Prototyping

### 🏢 Companies

1. **TechCorp Solutions**
   - Employees: 5000
   - Branches: 15
   - Focus: Cloud solutions and enterprise software

2. **DataMinds Analytics**
   - Employees: 2000
   - Branches: 8
   - Focus: Data analytics and AI

3. **Creative Designs Studio**
   - Employees: 500
   - Branches: 5
   - Focus: Digital design and creative services

4. **FinTech Innovations**
   - Employees: 3000
   - Branches: 10
   - Focus: Blockchain and fintech solutions

5. **HealthTech Plus**
   - Employees: 1500
   - Branches: 6
   - Focus: Healthcare technology

### 💼 Jobs

Jobs include various positions across:
- Full Stack Development
- Data Science & Machine Learning
- UI/UX Design
- Backend Development
- Business Analysis
- Marketing
- Internships

Jobs are distributed across:
- **Locations**: Bangalore, Mumbai, Delhi, Pune, Chennai
- **Work Types**: Remote, Hybrid, In Office
- **Timing**: Full Time, Internship
- **Domains**: Engineering, Management, Arts

## How to Use

### Run the Seed Script
```bash
cd Backend
npm run seed
```

### Clear and Re-seed Database
The seed script automatically clears all existing data before adding new data. Simply run:
```bash
npm run seed
```

### Login to Test
1. Start the backend server:
   ```bash
   npm start
   ```

2. Start the frontend:
   ```bash
   cd ../Frontend
   npm run dev
   ```

3. Login with any of the credentials above

### Test Different User Roles

#### As a Recruiter:
- Login with `john.recruiter@example.com` or `sarah.recruiter@example.com`
- View your companies
- Post new jobs
- Review applications
- Manage company profile

#### As a Job Seeker:
- Login with any job seeker account
- Browse jobs
- View company details
- Apply to jobs
- Update profile
- Write company reviews

## Database Collections

All MongoDB collections are now populated:

1. **users** - User accounts with profiles
2. **companies** - Company information with details
3. **jobs** - Job postings with requirements
4. **applications** - Job applications with status
5. **reviews** - Company reviews with ratings

## Features You Can Test

✅ User registration and login
✅ Company creation and management
✅ Job posting and listing
✅ Job applications
✅ Company reviews and ratings
✅ Profile management
✅ Search and filters
✅ Authentication and authorization

## Notes

- All passwords are hashed using bcrypt
- All users are pre-verified (isVerified: true)
- Companies have realistic data with logos
- Jobs have proper deadlines (15-45 days from now)
- Applications have varied statuses (applied, accepted, rejected)
- Reviews include ratings (3-5 stars) with text
- Company average ratings are automatically calculated

## Troubleshooting

If you encounter issues:

1. Make sure MongoDB is running
2. Check your `.env` file has correct DATABASE connection string
3. Ensure all dependencies are installed: `npm install`
4. Check the console output for specific errors

## Re-running the Seed

You can run the seed script multiple times. It will:
1. Clear all existing data
2. Create fresh dummy data
3. Maintain referential integrity between collections

This is useful for:
- Testing
- Resetting to a clean state
- Demonstrating features
- Development

## Customization

To add more dummy data, edit `seedDatabase.js`:
- Add more users to `users` array
- Add more companies to `companies` array  
- Add more jobs to `jobsData` array
- Modify review counts or ratings
- Adjust application statuses

Then run `npm run seed` again.

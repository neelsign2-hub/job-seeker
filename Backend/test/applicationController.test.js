const request = require('supertest');
const { describe, it, before, after } = require('mocha');
const app = require('../app');
const { connection } = require('../DB_connect');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
const Company = require('../models/companyModel'); 

let nonExCmpId = "6745b5fd724897e37a957674";
let invalidCmpId = "1234rfgds";

let invalidReviewId = "234322";
let nonExReviewId = "6745df03c55425650b84d634";

let nonExJobId = '607f1f77bcf86cd799439011';
let invalidjobID = "1234";

let nonExApplyID = '674c75f80ed8163c927115e3';
let invalidApplyId = '1234';

let nonExJobSeekerId = '674c53et0ed8163c927115cf';
let invalidJobSeekerId = '12345';

let jobSeekerRegTkn;
let recruiterRegTkn;
let jobseekerLogTkn;
let recruiterLogTkn;
let forgetPswTkn;
let invalidLogTkn;
let jobSeekerId;
let recruiterId;
let validCmpId;
let otherLog;
let validjobID;
let validReviewId;
let validApplyId;

const jobSeeker = {
  username: 'ValidJobSeeker',
  email: 'jobseeker5@gmail.com',
  password: 'Passw0rd@123',
  role: 'Job Seeker',
};

const recruiter = {
  username: 'ValidRecruiter',
  email: 'recruiter5@gmail.com',
  password: 'Passw0rd@123',
  role: 'Recruiter',
};

// Async setup for user registration and login
before(async function () {
    try {
      this.timeout(0);
      await connection();
        
      // Register Job Seeker
      this.timeout(0);
      let response = await request(app).post('/api/v1/user/register').send(jobSeeker);
      jobSeekerRegTkn = response.body.verificationToken;
      jobSeekerId = response.body.user._id;
      await request(app).get(`/api/v1/user/verify-email?token=${jobSeekerRegTkn}`);
      response = await request(app).post('/api/v1/user/login').send(jobSeeker);
      jobseekerLogTkn = response.body.token;
      jobSeekerId = response.body.user._id;

      // Register Recruiter
      this.timeout(0);
      response = await request(app).post('/api/v1/user/register').send(recruiter);
      recruiterRegTkn = response.body.verificationToken;
      recruiterId = response.body.user._id;
      await request(app).get(`/api/v1/user/verify-email?token=${recruiterRegTkn}`);
      response = await request(app).post('/api/v1/user/login').send(recruiter);
      recruiterLogTkn = response.body.token;
      recruiterId = response.body.user._id;

      // Register a Company
      const companyData = {
        name: 'Test Company',
        about: 'This is made for test purpuse.'
      };

      this.timeout(0);
      const cmp = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);
      // console.log(cmp.body);
      validCmpId = cmp.body.company._id;

      const jobData = {
        title: 'Software Engineer',
        description: 'Responsible for developing software',
        requirements: ['3+ years experience'],
        location: 'New York',
        experience: '3 years',
        salary: '100000',
        timing: 'Full Time', 
        perks: ['Health insurance'],
        category: 'IT',
        domain: 'Engineering',  
        workType: 'Remote',  
        userType: 'Professionals',  
        deadline: '2025-01-04'
    };

    this.timeout(0);
    const jobResponse = await request(app).post(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(jobData);

    validjobID = jobResponse.body.job._id;
    // console.log(jobResponse.body);
    // expect(jobResponse.status).to.equal(201);
    // expect(jobResponse.body.status).to.equal('success');
    // expect(jobResponse.body.job).to.have.property('_id');

    } catch (error) {
        console.error('DB connection failed', error);
    }
});

describe('Apply for job Controller', function () {

  describe('Positive Test Cases', function () {

    it('should apply for a job successfully', async function () {
      const response = await request(app).post(`/api/v1/application/${validjobID}/apply`).set('cookie', [`token=${jobseekerLogTkn}`]).send({resume: 'This is my resume'});
  
        // console.log(response.body);

      validApplyId = response.body.application._id;
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message', 'Application submitted successfully');
      expect(response.body.application).to.have.property('job', validjobID);
      expect(response.body.application).to.have.property('applicant');
      expect(response.body.application).to.have.property('resume', 'This is my resume');
    });

});

describe('Negative Test Cases', function () {
  it('should not allow application without being authenticated', async function () {
    const response = await request(app).post(`/api/v1/application/${validjobID}/apply`).send({resume: 'This is my resume'});

    // console.log(response.body);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('message', 'You are not logged in');
  });

  it('should not allow application for a non-existent job', async function () {
     // Example of a valid MongoDB ObjectId format but not existing in DB
    const response = await request(app).post(`/api/v1/application/${nonExJobId}/apply`).set('cookie', [`token=${jobseekerLogTkn}`]).send({resume: 'This is my resume'});

    console.log(response.body);
    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('message', 'Job not found');
  });

  it('should not allow application for a invalid job id', async function () {
    const response = await request(app).post(`/api/v1/application/${invalidjobID}/apply`).set('cookie', [`token=${jobseekerLogTkn}`]).send({resume: 'This is my resume'});

    // console.log(response.body);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('message', `Invalid _id: ${invalidjobID}.`);
  });

  // it('should not allow application without providing a resume', async function () {
  //   const response = await request(app).post(`/api/v1/application/${validjobID}/apply`).set('cookie', [`token=${jobseekerLogTkn}`]).send({resume: ''});

  //   console.log(response.body);
  //   expect(response.status).to.equal(201);
  //   expect(response.body).to.have.property('success', false);
  //   expect(response.body).to.have.property('message', 'Resume is required');
  // });
});

});

describe('GET /applications/:applicationId', async function () {
  describe('Positive Test Cases', function () {
  it('should fetch application by valid ID', async function () {
    const response = await request(app).get(`/api/v1/application/${validApplyId}`).set('cookie', [`token=${recruiterLogTkn}`]);
  
    // console.log(response.body);
    
    // Assertions
    expect(response).to.have.status(200); // Use 'response' here
    expect(response.body.status).to.equal('success');
    expect(response.body).to.have.property('application');
    expect(response.body.application).to.have.property('job');
    expect(response.body.application).to.have.property('applicant');
  });
});


describe('Negative Test Cases', function () {
  it('should return 404 if application does not exist', async function () {
    const response = await request(app).get(`/api/v1/application/${nonExApplyID}`).set('cookie', [`token=${recruiterLogTkn}`]);
  
    console.log(response.body);
    
    expect(response).to.have.status(404); 
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.be.equal('Application not found');
  });

  it('should return 400 for invalid application ID', async function () {
    const response = await request(app).get(`/api/v1/application/${invalidApplyId}`).set('cookie', [`token=${recruiterLogTkn}`]);
  
    // console.log(response.body);
    
    expect(response).to.have.status(400); 
    expect(response.body.success).to.equal(false);
    expect(response.body).to.have.property('message', `Invalid _id: ${invalidApplyId}.`);
  });

  it('should not fetch application if unauthenticated', async function () {
    const response = await request(app).get(`/api/v1/application/${validApplyId}`);
  
    // console.log(response.body);
    
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('message', 'You are not logged in');
  });
});
});

describe('GET /jobs/:jobId/applications', function () {
  describe('Positive Test Cases', function () {
  it('should fetch all applications for a valid job ID', async function () {
    const response = await request(app).get(`/api/v1/application/${validjobID}/applications`).set('cookie', [`token=${recruiterLogTkn}`]);

    // console.log(response.body);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.applications).to.be.an('array');
    expect(response.body.applications[0]).to.have.property('applicant');
  });
});

describe('Negative Test Cases', function () {

  // it('should return 404 if job does not exist', async function () {
  //   const response = await request(app).get(`/api/v1/application/${nonExJobId}/applications`).set('cookie', [`token=${recruiterLogTkn}`]);

  //   console.log(response.body);
  //   expect(response).to.have.status(200);
  //   expect(response.body.success).to.equal(false);
  //   expect(response.body.message).to.be.equal('Application not found');
  // });

  it('should return 400 for invalid job ID format', async function () {
    const response = await request(app).get(`/api/v1/application/${invalidjobID}/applications`).set('cookie', [`token=${recruiterLogTkn}`]);

    expect(response).to.have.status(400); 
    expect(response.body.success).to.equal(false);
    expect(response.body).to.have.property('message', `Invalid job: ${invalidjobID}.`);
  });

  it('should return 401 if unauthenticated', async function () {
    const response = await request(app).get(`/api/v1/application/${validjobID}/applications`);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('message', 'You are not logged in');
  });

  it('should return 403 if unauthorized to access job applications', async function () {
    const response = await request(app).get(`/api/v1/application/${validjobID}/applications`).set('cookie', [`token=${jobseekerLogTkn}`]);

    // console.log(response.body);
    expect(response).to.have.status(400);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('Job Seeker not allowed to access this resource.');
  });

});
});

describe('GET /jobs/:jobId/userID', function () {
  
  describe('Positive Test Cases', function () {
  it('should fetch all applications for a valid user ID', async function () {
    const response = await request(app).get(`/api/v1/application/myapplications`).set('cookie', [`token=${jobseekerLogTkn}`]);

    // console.log(response.body);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.applications).to.be.an('array');
    expect(response.body.applications[0]).to.have.property('applicant');
  });
});

describe('Negative Test Cases', function () {

  it('should return 401 if unauthenticated', async function () {
    const response = await request(app).get(`/api/v1/application/myapplications`);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('message', 'You are not logged in');
  });

  it('should return 403 if unauthorized to access job applications', async function () {
    const response = await request(app).get(`/api/v1/application/myapplications`).set('cookie', [`token=${recruiterLogTkn}`]);

    // console.log(response.body);
    expect(response).to.have.status(400);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('Recruiter not allowed to access this resource.');
  });

});
});

describe('PATCH /applications/:applicationId/status', function () {
  
  it('should update the application status successfully with valid data', async function () {
    const updateData = {
      status: 'accepted',
      feedback: 'Great application!',
    };

    const response = await request(app).patch(`/api/v1/application/${validApplyId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(updateData);

      // console.log(response.body);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('Application status updated successfully');
  });

  it('should return 404 if the application does not exist', async function () {
    const updateData = {
      status: 'accepted',
      feedback: 'Great application!',
    };

    const response = await request(app).patch(`/api/v1/application/${nonExApplyID}`).set('cookie', [`token=${recruiterLogTkn}`]).send(updateData);

    console.log(response.body);

    expect(response).to.have.status(404);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.be.equal('Application not found');
  });

  it('should return 400 if status is invalid', async function () {
    const updateData = {
      status: 'invalid-status',
      feedback: 'Application needs improvement.',
    };

    const response = await request(app).patch(`/api/v1/application/${validApplyId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(updateData);

    // console.log(response.body);
    expect(response).to.have.status(500);
    expect(response.body.success).to.equal(false);
    // expect(response.body.message).to.equal(`Application validation failed: status: ${updateData.status} is not a valid enum value for path status.`);
  });

  it('should return 401 if the user is not authenticated', async function () {
    const updateData = {
      status: 'accepted',
      feedback: 'Great application!',
    };

    const response = await request(app).patch(`/api/v1/application/${validApplyId}`);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('success', false);
    expect(response.body).to.have.property('message', 'You are not logged in');
  });
});
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

let invalidJobID = "6745a56ayt9476a6a51f2c38";

let invalidReviewId = "234322";
let nonExReviewId = "6745df03c55425650b84d634";

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

const jobSeeker = {
  username: 'ValidJobSeeker',
  email: 'jobseeker3@gmail.com',
  password: 'Passw0rd@123',
  role: 'Job Seeker',
};

const recruiter = {
  username: 'ValidRecruiter',
  email: 'recruiter3@gmail.com',
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

      // Register Recruiter
      this.timeout(0);
      response = await request(app).post('/api/v1/user/register').send(recruiter);
      recruiterRegTkn = response.body.verificationToken;
      recruiterId = response.body.user._id;
      await request(app).get(`/api/v1/user/verify-email?token=${recruiterRegTkn}`);
      response = await request(app).post('/api/v1/user/login').send(recruiter);
      recruiterLogTkn = response.body.token;

    } catch (error) {
        console.error('DB connection failed', error);
    }
});

describe('Job Controller - post job', function () {
    describe('Positive Test Cases', function () {

        it('Create a job successfully', async function () {
            this.timeout(0);

            const companyData = {
                name: 'Another Test Company',
                about: 'This is another test company.'
            };
    
            const cmpRegRes = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);
            // console.log('Company Registration cmpRegRes:', cmpRegRes.body);
            expect(cmpRegRes.status).to.be.equal(200);
            expect(cmpRegRes.body).to.have.property('status', 'success');
            expect(cmpRegRes.body.message).to.be.equal('Company registered successfully');
    
            validCmpId = cmpRegRes.body.company._id;

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

            const response = await request(app).post(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(jobData);

            // console.log(response.body);
            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.job).to.have.property('_id');
            validjobID = response.body.job._id;
      });
    });

    describe('Negative Test Cases', function () {

      it('error if i am job seeker', async function () {
        this.timeout(0);

        // const userData = {
        //     username: 'Recruiter',
        //     email: 'emailJS12@gmail.com',
        //     password: 'Passw0rd@123',
        //     role: 'Job Seeker',
        // };

        // // const resReg = await request(app).post('/api/v1/user/register').send(userData);
        // console.log('Registration Response:', resReg.body);
        // // expect(resReg.status).to.equal(200);

        // // token = resReg.body.verificationToken;
        // // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
        // console.log('Verification Response:', res.body);
        // // expect(res.status).to.equal(200);

        // const loginData = {
        //     email: 'emailJS12@gmail.com', // Use the correct email for login
        //     password: 'Passw0rd@123',
        //     role: 'Job Seeker'
        // };

        // const resLog = await request(app).post('/api/v1/user/login').send(loginData);
        // console.log('Login Response:', resLog.body);
        // expect(resLog.status).to.equal(201);
        // expect(resLog.body).to.have.property('status', 'success');
        // expect(resLog.body).to.have.property('message', 'user logged in successfully');

        // jobseekertkn = resLog.body.token;

        // const companyData = {
        //     name: 'Another Test Company',
        //     about: 'This is another test company.'
        // };

        // const cmpRegRes = await request(app).post('/api/v1/company/register').set('cookie', [`token=${logToken}`]).send(companyData);
        // console.log('Company Registration cmpRegRes:', cmpRegRes.body);
        // expect(cmpRegRes.status).to.be.equal(200);
        // expect(cmpRegRes.body).to.have.property('status', 'success');
        // expect(cmpRegRes.body.message).to.be.equal('Company registered successfully');

        // validCompanyId = cmpRegRes.body.company._id;

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

        const response = await request(app).post(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(jobData);

        // console.log(response.body);
        expect(response.status).to.equal(400);
        expect(response.body.success).to.equal(false);
        expect(response.body.message).to.equal('Job Seeker not allowed to access this resource.');
    });

    it('error if missing field', async function () {
        this.timeout(0);

        const jobData = {
            // title: 'Software Engineer',
            description: 'Responsible for developing software',
            requirements: ['3+ years experience'],
            location: 'New York',
            experience: '3 years',
            // salary: '100000',
            timing: 'Full Time', 
            perks: ['Health insurance'],
            category: 'IT',
            domain: 'Engineering',  
            // workType: 'Remote',  
            userType: 'Professionals',  
            deadline: '2025-01-04'
        };

        const response = await request(app).post(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(jobData);

        // console.log(response.body);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Empty required field');
    });

    it('deadline < current date', async function () {
        this.timeout(0);

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
            deadline: '2005-01-04'
        };

        const response = await request(app).post(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(jobData);

        // console.log(response.body);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Deadline cannot be in the past');
    });

    it('invalid company id', async function () {
        this.timeout(0);

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

        const response = await request(app).post(`/api/v1/job/${invalidCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(jobData);

        // console.log(response.body);
        expect(response.status).to.equal(400);
        expect(response.body.success).to.equal(false);
        expect(response.body.message).to.equal(`Invalid _id: ${invalidCmpId}.`);
    });
});
});

describe('Job Controller - get all job', async function () {
    const jobsData = [
        {
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
        },
        {
            title: 'Data Scientist',
            description: 'Analyze large datasets to gain insights',
            requirements: ['2+ years experience'],
            location: 'San Francisco',
            experience: '2 years',
            salary: '120000',
            timing: 'Full Time',
            perks: ['Health insurance'],
            category: 'IT',
            domain: 'Data Science',
            workType: 'Hybrid',
            userType: 'Professionals',
            deadline: '2025-02-04'
        },
        {
            title: 'Product Manager',
            description: 'Manage product development and strategy',
            requirements: ['5+ years experience'],
            location: 'New York',
            experience: '5 years',
            salary: '130000',
            timing: 'Full Time',
            perks: ['Health insurance'],
            category: 'Management',
            domain: 'Product',
            workType: 'Remote',
            userType: 'Professionals',
            deadline: '2025-03-04'
        },
        {
            title: 'Frontend Developer',
            description: 'Develop user-facing features for web applications',
            requirements: ['3+ years experience'],
            location: 'New York',
            experience: '3 years',
            salary: '95000',
            timing: 'Full Time',
            perks: ['Health insurance'],
            category: 'IT',
            domain: 'Engineering',
            workType: 'On-site',
            userType: 'Professionals',
            deadline: '2025-04-04'
        },
        {
            title: 'Backend Developer',
            description: 'Work on server-side logic and architecture',
            requirements: ['4+ years experience'],
            location: 'San Francisco',
            experience: '4 years',
            salary: '110000',
            timing: 'Full Time',
            perks: ['Health insurance'],
            category: 'IT',
            domain: 'Engineering',
            workType: 'Hybrid',
            userType: 'Professionals',
            deadline: '2025-05-04'
        }
    ];

    for (let i = 0; i < jobsData.length; i++) {
        await request(app).post(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(jobsData[i]);
    }

    describe('Positive Test Cases', function () {
        it('should get all jobs with default settings', async function () {
            const res = await request(app).get('/api/v1/jobs/');
            // console.log(res.body);
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.jobs).to.be.an('array');
        });

        it('should sort jobs by salary in descending order', async function () {
            const res = await request(app).get('/api/v1/jobs?sort=-salary');
            // console.log(res.body);
            expect(res.status).to.equal(200);
            expect(res.body.jobs).to.be.an('array');
            for (let i = 1; i < res.body.jobs.length; i++) {
                expect(Number(res.body.jobs[i - 1].salary)).to.be.at.least(Number(res.body.jobs[i].salary));
            }        
        });

        // it('should return paginated jobs', async function () {
        //     const res = await request(app).get('/api/v1/jobs?page=2&limit=1');
            // console.log(res.body);
        //     expect(res.status).to.equal(200);
        //     expect(res.body.results).to.equal(1);
        //     expect(res.body.jobs).to.be.an('array').that.has.lengthOf(1);
        // });

        it('should filter jobs by category', async function () {
            const res = await request(app).get('/api/v1/jobs?category=IT');
            // console.log(res.body);
            expect(res.status).to.equal(200);
            expect(res.body.jobs.every(job => job.category === 'IT')).to.be.true;
        });
    });

    describe('Negative Test Cases for getAllJobs', function () {

        it('should return an error for invalid filter fields', async function () {
            const res = await request(app).get('/api/v1/jobs?salary[gte]=50000&invalidField=true');
            // console.log(res.body);
            expect(res.status).to.equal(400);
            expect(res.body.success).to.equal(false);
            expect(res.body.message).to.include('Invalid field(s)');  // Assuming validation error for invalid filter
        });
    
        it('should return an error for page number exceeding available pages', async function () {
            const res = await request(app).get('/api/v1/jobs?page=1000&limit=10');
            // console.log(res.body);
            expect(res.status).to.equal(404);  // Not Found
            expect(res.body.success).to.equal(false);
            expect(res.body.message).to.include('This page does not exist');
        });
    
        it('should return an error for invalid sort field', async function () {
            const res = await request(app).get('/api/v1/jobs?sort=-nonExistentField');
            // console.log(res.body);
            expect(res.status).to.equal(400);  // Bad Request
            expect(res.body.success).to.equal(false);
            expect(res.body.message).to.include('Invalid sort field');
        });
    
        it('should return an error for non-numeric limit or page', async function () {
            const res = await request(app).get('/api/v1/jobs?page=abc&limit=xyz');
            // console.log(res.body);
            expect(res.status).to.equal(400);  // Bad Request
            expect(res.body.success).to.equal(false);
            expect(res.body.message).to.include('Invalid page parameter');
        });
    
        it('should return an empty result for non-existent filter values', async function () {
            const res = await request(app).get('/api/v1/jobs?salary[gte]=9999999');
            // console.log(res.body);
            expect(res.status).to.equal(200);  // 200 OK for successful request
            expect(res.body.jobs).to.be.an('array').that.is.empty;
        });
    
    });
    
    });

describe('Job Controller - job by id', function () {
        describe('Positive Test Cases', function () {
    
            it('job found successfully', async function () {
                this.timeout(0);
                const jobRes = await request(app).get(`/api/v1/jobs/${validjobID}`);
    
                // console.log(jobRes.body);
                expect(jobRes.status).to.equal(200);
                expect(jobRes.body.status).to.equal('success');
                expect(jobRes.body.job._id).to.equal(`${validjobID}`);
            });
        });
    
        describe('Negative Test Cases', function () {
            it('job not found', async function () {
                this.timeout(0);
    
                
                const jobRes = await request(app).get(`/api/v1/jobs/${invalidJobID}`);
    
                // console.log(jobRes.body);
                expect(jobRes.status).to.equal(400);
                expect(jobRes.body.success).to.equal(false);
                expect(jobRes.body.message).to.equal(`Invalid _id: ${invalidJobID}.`);
            });
    
            });
    
});

describe('Job Controller - by company id', function () {
    describe('Positive Test Cases', function () {
        it('get job by cmp id - rec', async function () {
            this.timeout(0);

            // const userData = {
            //     username: 'Recruiter',
            //     email: 'emailR12@gmail.com',
            //     password: 'Passw0rd@123',
            //     role: 'Recruiter',
            // };
    
            // const resReg = await request(app).post('/api/v1/user/register').send(userData);
            // console.log('Registration Response:', resReg.body);
            // expect(resReg.status).to.equal(200);
    
            // token = resReg.body.verificationToken;
            // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
            // console.log('Verification Response:', res.body);
            // expect(res.status).to.equal(200);
    
            // const loginData = {
            //     email: 'emailR12@gmail.com', // Use the correct email for login
            //     password: 'Passw0rd@123',
            //     role: 'Recruiter'
            // };
    
            // const resLog = await request(app).post('/api/v1/user/login').send(loginData);
            // console.log('Login Response:', resLog.body);
            // expect(resLog.status).to.equal(201);
            // expect(resLog.body).to.have.property('status', 'success');
            // expect(resLog.body).to.have.property('message', 'user logged in successfully');
    
            // logToken = resLog.body.token;

            // const companyData = {
            //     name: 'Another Test Company',
            //     about: 'This is another test company.'
            // };
    
            // const cmpRegRes = await request(app).post('/api/v1/company/register').set('cookie', [`token=${logToken}`]).send(companyData);
            // console.log('Company Registration cmpRegRes:', cmpRegRes.body);
            // expect(cmpRegRes.status).to.be.equal(200);
            // expect(cmpRegRes.body).to.have.property('status', 'success');
            // expect(cmpRegRes.body.message).to.be.equal('Company registered successfully');
    
            // validCompanyId = cmpRegRes.body.company._id;

            const response = await request(app).get(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]);

            // console.log(response.body);
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.jobs).to.be.an('array');
            // jobId = response.body.job._id;
        });
    
        it('get job by cmp id - job seeker', async function () {
            this.timeout(0);

            // const userData = {
            //     username: 'Recruiter',
            //     email: 'emailJS12@gmail.com',
            //     password: 'Passw0rd@123',
            //     role: 'Job Seeker',
            // };
    
            // const resReg = await request(app).post('/api/v1/user/register').send(userData);
            // console.log('Registration Response:', resReg.body);
            // expect(resReg.status).to.equal(200);
    
            // token = resReg.body.verificationToken;
            // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
            // console.log('Verification Response:', res.body);
            // expect(res.status).to.equal(200);
    
            // const loginData = {
            //     email: 'emailJS12@gmail.com', // Use the correct email for login
            //     password: 'Passw0rd@123',
            //     role: 'Job Seeker'
            // };
    
            // const resLog = await request(app).post('/api/v1/user/login').send(loginData);
            // console.log('Login Response:', resLog.body);
            // expect(resLog.status).to.equal(201);
            // expect(resLog.body).to.have.property('status', 'success');
            // expect(resLog.body).to.have.property('message', 'user logged in successfully');
    
            // jobseekertkn = resLog.body.token;

            // const companyData = {
            //     name: 'Another Test Company',
            //     about: 'This is another test company.'
            // };
    
            // const cmpRegRes = await request(app).post('/api/v1/company/register').set('cookie', [`token=${logToken}`]).send(companyData);
            // console.log('Company Registration cmpRegRes:', cmpRegRes.body);
            // expect(cmpRegRes.status).to.be.equal(200);
            // expect(cmpRegRes.body).to.have.property('status', 'success');
            // expect(cmpRegRes.body.message).to.be.equal('Company registered successfully');
    
            // validCompanyId = cmpRegRes.body.company._id;

            const response = await request(app).get(`/api/v1/job/${validCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]);

            // console.log(response.body);
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.jobs).to.be.an('array');
        });
    });
    describe('Negative Test Cases', function () {
        it('error if company not found', async function () {
            this.timeout(0);
            const response = await request(app).get(`/api/v1/job/${invalidCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]);

            // console.log(response.body);
            expect(response.body.success).to.equal(false);
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal(`Invalid company: ${invalidCmpId}.`);
        });
     
    });
});


describe('Job Controller - update job', function () {
    describe('Positive Test Cases', function () {
      it('Update a job successfully', async function () {
        this.timeout(0);

        const jobData = {
            title: 'Hardware Engineer',
            description: 'Responsible for developing software',
            requirements: ['3+ years experience'],
            location: 'New York',
            experience: '3 years',
            salary: '500000',
            timing: 'Full Time', 
            perks: ['Health insurance'],
            category: 'IT',
            domain: 'Engineering',  
            workType: 'Remote',  
            userType: 'Professionals',  
            deadline: '2025-01-04'
        };

        const response = await request(app).put(`/api/v1/job/${validjobID}`).set('cookie', [`token=${recruiterLogTkn}`]).send(jobData);

        // console.log(response.body);
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.be.equal('Job updated successfully');
        });
    });

    describe('Negative Test Cases', function () {

        it('should return 404 if job not found', async () => {
            const dummyid="674ad8b5b8e54e5ec181555e";
            this.timeout(0);
            const res = await request(app).put(`/api/v1/job/${dummyid}`).set('cookie', [`token=${recruiterLogTkn}`]).send({title: 'Updated Job Title',});
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal('Job not found or you do not have permission to update this job');
        });

        it('should return 401 for unauthorized user', async () => {
          const dummyid="674ad8b5b8e54e5ec181555e";
          this.timeout(0);
          const res = await request(app).put(`/api/v1/job/${dummyid}`).send({title: 'Unauthorized Update',});
        //   console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success', false);
          expect(res.body.message).to.be.equal('You are not logged in');
        });

        it('should validate input data', async () => {
          this.timeout(0);
          const res = await request(app).put(`/api/v1/job/${validjobID}`).set('cookie', [`token=${recruiterLogTkn}`]).send({title: '', });
        //   console.log(res.body);
          expect(res).to.have.status(500); 
          expect(res.body).to.have.property('success', false);
          expect(res.body.message).to.include('Validation failed: title: Path `title` is required.');
        });    
        
        it('should validate input data', async () => {
            this.timeout(0);
            const res = await request(app).put(`/api/v1/job/${validjobID}`).set('cookie', [`token=${recruiterLogTkn}`]).send({salary: '', });
            // console.log(res.body);
            expect(res).to.have.status(500); 
            expect(res.body).to.have.property('success', false);
            expect(res.body.message).to.include('Validation failed: salary: Path `salary` is required.');
        });
        
        it('Update by job seeker', async function () {
            this.timeout(0);
    
            const jobData = {
                title: 'Hardware Engineer',
                description: 'Responsible for developing software',
                requirements: ['3+ years experience'],
                location: 'New York',
                experience: '3 years',
                salary: '500000',
                timing: 'Full Time', 
                perks: ['Health insurance'],
                category: 'IT',
                domain: 'Engineering',  
                workType: 'Remote',  
                userType: 'Professionals',  
                deadline: '2025-01-04'
            };
    
            const response = await request(app).put(`/api/v1/job/${validjobID}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(jobData);
    
            // console.log(response.body);
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body.message).to.be.equal('Job Seeker not allowed to access this resource.');
            });
    });

});

describe('Job Controller - delete job', function () {

    describe('Negative Test Cases', function () {

        it('should return 404 if job not found', async () => {
            const dummyid="674ad8b5b8e54e5ec181555e";
            this.timeout(0);
            const res = await request(app).delete(`/api/v1/job/${dummyid}`).set('cookie', [`token=${recruiterLogTkn}`]);
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal('Job not found or you do not have permission to delete this job');
        });

        it('not logged in', async () => {
          const dummyid="674ad8b5b8e54e5ec181555e";
          this.timeout(0);
          const res = await request(app).delete(`/api/v1/job/${dummyid}`);
        //   console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success', false);
          expect(res.body.message).to.be.equal('You are not logged in');
        });
        
        it('delete by job seeker', async function () {
            this.timeout(0);
    
            const response = await request(app).delete(`/api/v1/job/${validjobID}`).set('cookie', [`token=${jobseekerLogTkn}`]);
    
            // console.log(response.body);
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body.message).to.be.equal('Job Seeker not allowed to access this resource.');
        });

        describe('Positive Test Cases', function () {
            it('delete a job successfully', async function () {
                this.timeout(0);
          
                const response = await request(app).delete(`/api/v1/job/${validjobID}`).set('cookie', [`token=${recruiterLogTkn}`]);
          
                // console.log(response.body);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.message).to.be.equal('Job deleted successfully');
                });
            });
    });

});
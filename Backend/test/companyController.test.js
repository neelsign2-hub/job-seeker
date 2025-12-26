const request = require('supertest');
const { describe, it, before, after } = require('mocha');
const app = require('../app');
const { connection } = require('../DB_connect');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
const Company = require('../models/companyModel'); // Assuming you have this model

let nonExCmpId = "6745b5fd724897e37a957674";
let invalidCmpId = "1234rfgds";

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

const jobSeeker = {
    username: 'ValidJobSeeker',
    email: 'jobseeker4@gmail.com',
    password: 'Passw0rd@123',
    role: 'Job Seeker',
  };
  
  const recruiter = {
    username: 'ValidRecruiter',
    email: 'recruiter4@gmail.com',
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

describe('Company Controller - register', function () {
    describe('Positive Test Cases', function () {
        // it('Fetch company by valid ID', async function () {
        //     this.timeout(0);
        //     const response = await request(app).get(`/api/v1/company/${validCompanyId}`);
        //     console.log(response.body);
        //     expect(response.status).to.equal(200);
        //     expect(response.body.status).to.equal('success');
        //     expect(response.body.company).to.be.an('object');
        //     expect(response.body.company._id).to.equal(validCompanyId);
        // });

        it('Register a company - if not logged in', async function () {
            this.timeout(0);

            const companyData = {
                name: 'Another Test Company',
                about: 'This is another test company.'
            };

            const response = await request(app).post('/api/v1/company/register').send(companyData);

            // console.log(response.body);
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('You are not logged in');
        });

        it('Register a company - if logged in as Job Seeker', async function () {
            this.timeout(0);

            // const userData = {
            //     username: 'ValidUser',
            //     email: 'email111@gmail.com',
            //     password: 'Passw0rd@123',
            //     role: 'Job Seeker',
            // };
  
            // const resReg = await request(app).post('/api/v1/user/register').send(userData);
            // console.log(resReg.body);
            // expect(resReg.status).to.equal(200);
  
            // token = resReg.body.verificationToken;
            // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
            // console.log(res.body);
            // expect(res.status).to.equal(200);

            // const userData = {
            //     email: 'email111@gmail.com',
            //     password: 'Passw0rd@123',
            //     role: 'Job Seeker',
            // };
  
            // const resLog = await request(app).post('/api/v1/user/login').send(userData);
            // expect(resLog.status).to.equal(201);
            // expect(resLog.body).to.have.property('status', 'success');
            // expect(resLog.body).to.have.property('message', 'user logged in successfully');
            // console.log(resLog.body);

            // logToken = resLog.body.token;

            const companyData = {
                name: 'Another Test Company',
                about: 'This is another test company.'
            };

            const response = await request(app).post('/api/v1/company/register').set('cookie', [`token=${jobseekerLogTkn}`]).send(companyData);

            expect(response.status).to.be.equal(400);
            expect(response.body.success).to.be.equal(false);
            expect(response.body.message).to.be.equal('Job Seeker not allowed to access this resource.');
            // console.log(response.body);
        });

        it('Register a company - if logged in as Recruiter', async function () {
            this.timeout(0);

            // const userData = {
            //     username: 'Recruiter',
            //     email: 'emailR12@gmail.com',
            //     password: 'Passw0rd@123',
            //     role: 'Recruiter',
            // };
  
            // const resReg = await request(app).post('/api/v1/user/register').send(userData);
            // console.log(resReg.body);
            // expect(resReg.status).to.equal(200);
  
            // token = resReg.body.verificationToken;
            // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
            // console.log(res.body);
            // expect(res.status).to.equal(200);

            // const userData = {
            //     email: 'email111@gmail.com',
            //     password: 'Passw0rd@123',
            //     role: 'Job Seeker',
            // };
  
            // const resLog = await request(app).post('/api/v1/user/login').send(userData);
            // expect(resLog.status).to.equal(201);
            // expect(resLog.body).to.have.property('status', 'success');
            // expect(resLog.body).to.have.property('message', 'user logged in successfully');
            // console.log(resLog.body);

            // logToken = resLog.body.token;

            const companyData = {
                name: 'Another Test Company',
                about: 'This is another test company.'
            };

            const response = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);

            validCmpId = response.body.company._id;
            expect(response.status).to.be.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body.message).to.be.equal('Company registered successfully');
            // console.log(response.body);
        });

        it('Register a company - unsuff input - name', async function () {
            this.timeout(0);

            // logToken = resLog.body.token;
            const companyData = {
                about: 'This is another test company.'
            };

            const response = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);

            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Empty required field');
        });

        it('Register a company - unsuff input - about', async function () {
            this.timeout(0);

            // logToken = resLog.body.token;
            const companyData = {
                about: 'This is another test company.'
            };

            const response = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);

            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Empty required field');
        });

        it('Register a company - unsuff input - not given any', async function () {
            this.timeout(0);

            // logToken = resLog.body.token;
            const companyData = {
            };

            const response = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);

            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Empty required field');
        });
        
    });
});

describe('Company Controller - get all cmp', function () {
    describe('Positive Test Cases', function () {
      it('Fetch all companies - Valid Request', async function () {
        this.timeout(0);
        const response = await request(app).get('/api/v1/company/');

          expect(response.status).to.equal(200);
          expect(response.body.status).to.equal('success');
          expect(response.body.message).to.equal('These are all the registered companies');
          expect(response.body.companies).to.be.an('array');
      });
    });
});


describe('Get Company By ID', async function () {
    describe('Positive Test Cases', async function () {
        it('should retrieve a company by valid ID', async function () {
            this.timeout(0);
            const response = await request(app).get(`/api/v1/company/${validCmpId}`);
            console.log(response.body);
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Here is the company');
            expect(response.body.company).to.be.an('object');
            expect(response.body.company._id).to.equal(validCmpId);
            expect(response.body.company.reviews).to.be.an('array');
        });
    });

    describe('Negative Test Cases', async function () {
        it('should return an error if company not found', async function () {
            this.timeout(0);
            const invalidId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/v1/company/${invalidId}`);
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Company not found');
        });

        it('should return an error for invalid company ID format', async function () {
            this.timeout(0);
            const invalidId = '12345';
            const response = await request(app).get(`/api/v1/company/${invalidId}`);
            expect(response.status).to.equal(400);
            // console.log(response.body);
            expect(response.body.message).to.include(`Invalid _id: ${invalidId}`);
        });
    });
});

describe('update company details', function () {
    
    it('update the company if authorized', async function () {
       
    //     // this.timeout(0);
    //     // const userData = {
    //     //     username: 'Nisahnt',
    //     //     email: 'e1@gmail.com',
    //     //     password: '12345678',
    //     //     role: 'Recruiter',
    //     // };

    //     // const res1 = await request(app).post('/api/v1/user/register').send(userData);
    //     // expect(res1.status).to.equal(200);
    //     // // console.log(response.body);
    //     // token = res1.body.verificationToken;

    //     // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
    //     // expect(res.body.status).to.equal('success');
    //     // expect(res.body.message).to.equal('Email verified successfully.');    
    //     // console.log(res.body);
    //    this.timeout(0);
    //    const userdata = {
    //     email: 'e1@gmail.com',
    //     password: '12345678',
    //     role: 'Recruiter',
    //    };
    //     const resLog = await request(app).post('/api/v1/user/login').send(userdata);

    //     expect(resLog.status).to.equal(201);
    //     expect(resLog.body).to.have.property('status', 'success');
    //     expect(resLog.body).to.have.property('message', 'User logged in successfully');
    //     // console.log(resLog.body);
    //     logToken = resLog.body.token;
    //   this.timeout(0);
    //   const companyData = {
    //       name: 'Google',
    //       about: 'kal exam hai aur hum kam kar rahe hai.'
    //   };

    //   const response = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);

    //   expect(response.status).to.be.equal(200);
    //   expect(response.body).to.have.property('status', 'success');
    //   expect(response.body.message).to.be.equal('Company registered successfully');
    //   // console.log(response.body);
    //   companyid=response.body.company._id;

      const newData = {
        name: 'Google',
        about: 'aur baki sab ash kar rahe hai'
       };

      const res2 = await request(app).put(`/api/v1/company/update/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(newData);
  
      expect(res2).to.have.status(200);
      expect(res2.body.status).to.equal('success');
      expect(res2.body.updatedCompany).to.have.property('name', `${newData.name}`);
    });


     it('update the company if not authorized', async () => {
            this.timeout(0);
            // const userData = {
            //     username: 'Nisahnt',
            //     email: 'e2@gmail.com',
            //     password: '12345678',
            //     role: 'Job Seeker',
            // };

            // const res1 = await request(app).post('/api/v1/user/register').send(userData);
            // expect(res1.status).to.equal(200);
            // // console.log(response.body);
            // token = res1.body.verificationToken;

            // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
            // expect(res.body.status).to.equal('success');
            // expect(res.body.message).to.equal('Email verified successfully.');    
            // console.log(res.body);
        //   this.timeout(0);
        //   const userdata = {
        //     email: 'e2@gmail.com',
        //     password: '12345678',
        //     role: 'Job Seeker',
        //   };
        //     const resLog = await request(app).post('/api/v1/user/login').send(userdata);

        //     expect(resLog.status).to.equal(201);
        //     expect(resLog.body).to.have.property('status', 'success');
        //     expect(resLog.body).to.have.property('message', 'User logged in successfully');
        //     // console.log(resLog.body);
        //     this.timeout(0);
        //     jobseekertoken = resLog.body.token;
           
            const newData = {
              name: 'Google',
              about: 'aur baki sab ash kar rahe hai'
            };
            const res2 = await request(app).put(`/api/v1/company/update/${validCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(newData);
            // console.log(res2);
            expect(res2).to.have.status(400);
            expect(res2.body).to.have.property('message', 'Job Seeker not allowed to access this resource.');
      });

      it('return error if company is not found', async () => {
        
        const fakecompanyid="6745b8b6ccea584d0e349977";
        const res = await request(app).put(`/api/v1/company/update/${fakecompanyid}`).set('cookie', [`token=${recruiterLogTkn}`]);
        // console.log(res.body);
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'Company not found');
    });


});


describe('delete company', function () {

    it('if the user is unauthorized to delete the company', async () => {

        this.timeout(0);
        // const userdata = {
        //   email: 'e2@gmail.com',
        //   password: '12345678',
        //   role: 'Job Seeker',
        // };
        //   const resLog = await request(app).post('/api/v1/user/login').send(userdata);

        //   expect(resLog.status).to.equal(201);
        //   expect(resLog.body).to.have.property('status', 'success');
        //   expect(resLog.body).to.have.property('message', 'User logged in successfully');
        //   // console.log(resLog.body);
        //   this.timeout(0);
        //   jobseekertoken = resLog.body.token;
               

          const res = await request(app).delete(`/api/v1/company/delete/${validCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]);
         
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'Job Seeker not allowed to access this resource.');
});

  it('should return 404 if the company does not exist', async () => {
   
    const fakecompanyid="6745b8b6ccea584d0e349977";
    const res = await request(app).delete(`/api/v1/company/delete/${fakecompanyid}`).set('cookie', [`token=${recruiterLogTkn}`]);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message', 'Company not found');
});

    
it('should delete the company successfully if it exists and is owned by the user', async () => {
  
  this.timeout(0);
    //    const userdata = {
    //     email: 'e1@gmail.com',
    //     password: '12345678',
    //     role: 'Recruiter',
    //     };
    //     const resLog = await request(app).post('/api/v1/user/login').send(userdata);

    //     expect(resLog.status).to.equal(201);
    //     expect(resLog.body).to.have.property('status', 'success');
    //     expect(resLog.body).to.have.property('message', 'User logged in successfully');
    //     // console.log(resLog.body);
    //     logToken = resLog.body.token;
    //     this.timeout(0);
    //     const companyData = {
    //         name: 'Meet katharotiya',
    //         about: 'kal exam hai aur hum kam kar rahe hai.'
    //     };

    //     const response = await request(app).post('/api/v1/company/register').set('cookie', [`token=${logToken}`]).send(companyData);

    //     expect(response.status).to.be.equal(200);
    //     expect(response.body).to.have.property('status', 'success');
    //     expect(response.body.message).to.be.equal('Company registered successfully');
    //    // console.log(response.body);
    //     companyid=response.body.company._id;


        const res = await request(app).delete(`/api/v1/company/delete/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Company deleted successfully');
   });

});


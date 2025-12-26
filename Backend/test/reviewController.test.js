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

let validReviewId;

const jobSeeker = {
  username: 'ValidJobSeeker',
  email: 'jobseeker6@gmail.com',
  password: 'Passw0rd@123',
  role: 'Job Seeker',
};

const recruiter = {
  username: 'ValidRecruiter',
  email: 'recruiter6@gmail.com',
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

      // Register a Company
      const companyData = {
        name: 'Test Company',
        about: 'This is made for test purpuse.'
      };

      this.timeout(0);
      const cmp = await request(app).post('/api/v1/company/register').set('cookie', [`token=${recruiterLogTkn}`]).send(companyData);
      // console.log(cmp.body);
      validCmpId = cmp.body.company._id;

    } catch (error) {
        console.error('DB connection failed', error);
    }
});

describe('Review Controller', function () {

  describe('Positive Test Cases', function () {
  it('Review - if logged in as Job Seeker', async function () {
    this.timeout(0);

    // const userData = {
    //     username: 'ValidUser',
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
    
    const reviewData =  {
      rating: '5',
      reviewText: 'Great company to work with!'
    };

    const response = await request(app).post(`/api/v1/review/${validCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(reviewData);

    // console.log(response.body);
    validReviewId = response.body.review._id;
    
    expect(response.status).to.be.equal(201);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.message).to.be.equal('Review added successfully');
});
  });

describe('Negative Test Cases', function () {
      it('Review - if not logged in', async function () {
          this.timeout(0);

          const reviewData =  {
            rating: '4',
            reviewText: 'Great company to work with!'
          };

          const response = await request(app).post(`/api/v1/review/${validCmpId}`).send(reviewData);

          // console.log(response.body);
          expect(response.status).to.equal(400);
          
          expect(response.body.message).to.equal('You are not logged in');
      });

      it('Review - if logged in as Recruiter', async function () {
          this.timeout(0);

          // const userData = {
          //     username: 'Recruiter',
          //     email: 'emailR12@gmail.com',
          //     password: 'Passw0rd@123',
          //     role: 'Recruiter',
          // };

          // // const resReg = await request(app).post('/api/v1/user/register').send(userData);
          // console.log(resReg.body);
          // // expect(resReg.status).to.equal(200);

          // // token = resReg.body.verificationToken;
          // // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
          // console.log(res.body);
          // // expect(res.status).to.equal(200);

          // // const userData = {
          // //     email: 'email111@gmail.com',
          // //     password: 'Passw0rd@123',
          // //     role: 'Job Seeker',
          // // };

          // const resLog = await request(app).post('/api/v1/user/login').send(userData);
          // expect(resLog.status).to.equal(201);
          // expect(resLog.body).to.have.property('status', 'success');
          // expect(resLog.body).to.have.property('message', 'user logged in successfully');
          // console.log(resLog.body);

          // logToken = resLog.body.token;

          const reviewData =  {
            rating: '3.5',
            reviewText: 'Great company to work with!'
          };

          const response = await request(app).post(`/api/v1/review/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(reviewData);

          // console.log(response.body);
          expect(response.status).to.be.equal(400);
          expect(response.body).to.have.property('success', false);
          expect(response.body.message).to.be.equal('Recruiter not allowed to access this resource.');
          
      });

    it('Same review twice', async function () {
      this.timeout(0);

      const reviewData =  {
        rating: '5',
        reviewText: 'Great company to work with!'
      };

      const response = await request(app).post(`/api/v1/review/${validCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(reviewData);

      // console.log(response.body);
      expect(response.status).to.be.equal(400);
      expect(response.body).to.have.property('success', false);
      expect(response.body.message).to.be.equal('You have already reviewed this company');
    });

    it('Review to non existing company', async function () {

      this.timeout(0);

      const reviewData =  {
        rating: '2',
        reviewText: 'Average company to work with!'
      };

      const response = await request(app).post(`/api/v1/review/${nonExCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(reviewData);

      // console.log(response.body);
      expect(response.status).to.be.equal(404);
      expect(response.body).to.have.property('success', false);
      expect(response.body.message).to.be.equal('Company not found');
      
    });

    it('Review to invalid company id', async function () {

      this.timeout(0);

      const reviewData =  {
        rating: '2',
        reviewText: 'Average company to work with!'
      };

      const response = await request(app).post(`/api/v1/review/${invalidCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(reviewData);

      // console.log(response.body);
      expect(response.status).to.be.equal(400);
      expect(response.body).to.have.property('success', false);
      expect(response.body.message).to.be.equal(`Invalid _id: ${invalidCmpId}.`);
    });
  });
  });


// ------------------------ 


  describe('Review Controller - get ', function () {
    it('Get Review - if not logged in', async function () {
        this.timeout(0);

        const reviewData =  {
          rating: '4',
          reviewText: 'Great company to work with!'
        };

        const response = await request(app).get(`/api/v1/review/${validCmpId}`);

        // console.log(response.body);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('You are not logged in');
    });

    it('Get Review - if logged in as Recruiter', async function () {
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

        const response = await request(app).get(`/api/v1/review/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]);

        // console.log(response.body);
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body.reviews).to.be.an('array');
        
    });

    it('Get Review - if logged in as Job Seeker', async function () {
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

      const response = await request(app).get(`/api/v1/review/${validCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]);

      // console.log(response.body);
      expect(response.status).to.be.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.reviews).to.be.an('array');
  });

  it('Get Review to non existing company', async function () {

    this.timeout(0);

    const response = await request(app).get(`/api/v1/review/${nonExCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]);

    // console.log(response.body);
    expect(response.status).to.be.equal(200);
    expect(response.body).to.have.property('status','success');
    expect(response.body.reviews).to.be.an('array').that.is.empty;
  });

  it('Get Review to invalid company id', async function () {

    this.timeout(0);

    const response = await request(app).get(`/api/v1/review/${invalidCmpId}`).set('cookie', [`token=${jobseekerLogTkn}`]);

    // console.log(response.body);
    expect(response.status).to.be.equal(400);
    expect(response.body).to.have.property('success', false);
    expect(response.body.message).to.be.equal(`Invalid company: ${invalidCmpId}.`);
  });
});


describe('Review Controller - Update Review', function () {

  it('Update Review - if not logged in', async function () {
      this.timeout(0);

      const updReviw = {
          rating: '1',
          reviewText: 'very poor company.'
      }

      const response = await request(app).patch(`/api/v1/review/${validReviewId}`).send(updReviw);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('You are not logged in');
  });

  it('Update - if logged in as recruiter', async function () {
    this.timeout(0);

    // const userData = {
    //     username: 'ValidUser',
    //     email: 'email111@gmail.com',
    //     password: 'Passw0rd@123',
    //     role: 'Job Seeker',
    // };

    // // const resReg = await request(app).post('/api/v1/user/register').send(userData);
    // console.log(resReg.body);
    // // expect(resReg.status).to.equal(200);

    // // token = resReg.body.verificationToken;
    // // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
    // console.log(res.body);
    // // expect(res.status).to.equal(200);

    // // const userData = {
    // //     email: 'email111@gmail.com',
    // //     password: 'Passw0rd@123',
    // //     role: 'Job Seeker',
    // // };

    // const resLog = await request(app).post('/api/v1/user/login').send(userData);
    // expect(resLog.status).to.equal(201);
    // expect(resLog.body).to.have.property('status', 'success');
    // expect(resLog.body).to.have.property('message', 'user logged in successfully');
    // console.log(resLog.body);

    // logToken = resLog.body.token;
    
  //   const reviewData =  {
  //     rating: '5',
  //     reviewText: 'Great company to work with!'
  //   };

  //   const response = await request(app).post(`/api/v1/review/${validCmpId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(reviewData);

  //   console.log(response.body);
  //   expect(response.status).to.be.equal(201);
  //   expect(response.body).to.have.property('status', 'success');
  //   expect(response.body.message).to.be.equal('Review added successfully');

  //   reviewId = response.body.review._id;

  //   const recData = {
  //     username: 'ValidUser',
  //     email: 'email@gmail.com',
  //     password: 'Passw0rd@123',
  //     role: 'Recruiter',
  //  };

  // const resReg = await request(app).post('/api/v1/user/register').send(recData);
  // console.log(resReg.body);
  // expect(resReg.status).to.equal(200);

  // token = resReg.body.verificationToken;
  // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
  // console.log(res.body);
  // expect(res.status).to.equal(200);

  // const recData = {
  //     email: 'email111@gmail.com',
  //     password: 'Passw0rd@123',
  //     role: 'Job Seeker',
  // };

  // const recLog = await request(app).post('/api/v1/user/login').send(recData);
  // expect(recLog.status).to.equal(201);
  // expect(recLog.body).to.have.property('status', 'success');
  // expect(recLog.body).to.have.property('message', 'user logged in successfully');
  // console.log(recLog.body);

  // recTkn = recLog.body.token;

  const updReviw = {
      rating: '1',
      reviewText: 'very poor company.'
  }

  const updRes = await request(app).patch(`/api/v1/review/${validReviewId}`).set('cookie', [`token=${recruiterLogTkn}`]).send(updReviw);

  // console.log(updRes.body);

  expect(updRes.status).to.be.equal(400);
  expect(updRes.body).to.have.property('success', false);
  expect(updRes.body.message).to.be.equal('Recruiter not allowed to access this resource.');

});

  it('Update Review - if review does not exist', async function () {
      this.timeout(0);

      const updReviw = {
          rating: '1',
          reviewText: 'very poor company.'
      }

      const response = await request(app).patch(`/api/v1/review/${nonExReviewId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(updReviw);
      // console.log(response.body);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('No review found with that ID');
  });

   it('Update Review - invalid review ID format', async function () {
      this.timeout(0);
      const updReviw = {
          rating: '1',
          reviewText: 'very poor company.'
      }
      const response = await request(app).patch(`/api/v1/review/${invalidReviewId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(updReviw);
      // console.log(response.body);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal(`Invalid _id: ${invalidReviewId}.`);
  });

  it('Update Review - by otehr user', async function () {
      this.timeout(0);

    const userData = {
        username: 'otheruser',
        email: 'other@gmail.com',
        password: 'Passw0rd@123',
        role: 'Job Seeker',
    };

    // ---> remove comment if running 1st time

    const resReg = await request(app).post('/api/v1/user/register').send(userData);
    // console.log(resReg.body);
    expect(resReg.status).to.equal(200);

    token = resReg.body.verificationToken;
    const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
    // console.log(res.body);
    expect(res.status).to.equal(200);

    const resLog = await request(app).post('/api/v1/user/login').send(userData);
    expect(resLog.status).to.equal(201);
    expect(resLog.body).to.have.property('status', 'success');
    expect(resLog.body).to.have.property('message', 'user logged in successfully');
    // console.log(resLog.body);

    otherLog = resLog.body.token;

      const updReviw = {
      rating: '1',
      reviewText: 'very poor company.'
      }

      // console.log(validReviewId);
      this.timeout(0);
      const response = await request(app).patch(`/api/v1/review/${validReviewId}`).set('cookie', [`token=${otherLog}`]).send(updReviw);
      // console.log(response.body);
      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('You do not have permission to update this review');
  });

  it('Update Review - successfull deletion by the user itself', async function () {
      this.timeout(0);

    const updReviw = {
      rating: '1',
      reviewText: 'very poor company.'
  }
      const response = await request(app).patch(`/api/v1/review/${validReviewId}`).set('cookie', [`token=${jobseekerLogTkn}`]).send(updReviw);

      // console.log(response.body);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.message).to.equal('Review updated successfully');
  });

});


describe('Review Controller - Delete Review', function () {

  it('Delete Review - if not logged in', async function () {
      this.timeout(0);

      const response = await request(app).delete(`/api/v1/review/${validReviewId}`);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('You are not logged in');
  });

  it('Review - if logged in as recruiter', async function () {
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
    
  //   const reviewData =  {
  //     rating: '5',
  //     reviewText: 'Great company to work with!'
  //   };

  //   const response = await request(app).post(`/api/v1/review/${validCmpId}`).set('cookie', [`token=${logToken}`]).send(reviewData);

  //   console.log(response.body);
  //   expect(response.status).to.be.equal(201);
  //   expect(response.body).to.have.property('status', 'success');
  //   expect(response.body.message).to.be.equal('Review added successfully');

  //   reviewId = response.body.review._id;

  //   const recData = {
  //     username: 'ValidUser',
  //     email: 'email@gmail.com',
  //     password: 'Passw0rd@123',
  //     role: 'Recruiter',
  //  };

  // const resReg = await request(app).post('/api/v1/user/register').send(recData);
  // console.log(resReg.body);
  // expect(resReg.status).to.equal(200);

  // token = resReg.body.verificationToken;
  // const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
  // console.log(res.body);
  // expect(res.status).to.equal(200);

  // const recData = {
  //     email: 'email111@gmail.com',
  //     password: 'Passw0rd@123',
  //     role: 'Job Seeker',
  // };

  // const recLog = await request(app).post('/api/v1/user/login').send(recData);
  // expect(recLog.status).to.equal(201);
  // expect(recLog.body).to.have.property('status', 'success');
  // expect(recLog.body).to.have.property('message', 'user logged in successfully');
  // console.log(recLog.body);

  // recTkn = recLog.body.token;

  const delRes = await request(app).delete(`/api/v1/review/${validReviewId}`).set('cookie', [`token=${recruiterLogTkn}`]);

  // console.log(delRes.body);

  expect(delRes.status).to.be.equal(400);
  expect(delRes.body).to.have.property('success', false);
  expect(delRes.body.message).to.be.equal('Recruiter not allowed to access this resource.');

});

  it('Delete Review - if review does not exist', async function () {
      this.timeout(0);

      const response = await request(app).delete(`/api/v1/review/${nonExReviewId}`).set('cookie', [`token=${jobseekerLogTkn}`]);
      // console.log(response.body);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('No review found with that ID');
  });

   it('Delete Review - invalid review ID format', async function () {
      this.timeout(0);

      const response = await request(app).delete(`/api/v1/review/${invalidReviewId}`).set('cookie', [`token=${jobseekerLogTkn}`]);
      // console.log(response.body);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal(`Invalid _id: ${invalidReviewId}.`);
  });

  it('Delete Review - by otehr user', async function () {
      this.timeout(0);

    const userData = {
        username: 'otheruser',
        email: 'other@gmail.com',
        password: 'Passw0rd@123',
        role: 'Job Seeker',
    };

    const resReg = await request(app).post('/api/v1/user/register').send(userData);
    // console.log(resReg.body);

    token = resReg.body.verificationToken;
    const res = await request(app).get(`/api/v1/user/verify-email?token=${token}`);
    // console.log(res.body);

    const resLog = await request(app).post('/api/v1/user/login').send(userData);
    expect(resLog.status).to.equal(201);
    expect(resLog.body).to.have.property('status', 'success');
    expect(resLog.body).to.have.property('message', 'user logged in successfully');
    // console.log(resLog.body);

    const otherLog = resLog.body.token;

      const response = await request(app).delete(`/api/v1/review/${validReviewId}`).set('cookie', [`token=${otherLog}`]);

      // console.log(response.body);
      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('You do not have permission to delete this review');
  });

  it('Delete Review - successfull deletion by the user itself', async function () {
      this.timeout(0);

    //   const userData = {
    //       username: 'ValidUser',
    //       email: 'email111@gmail.com',
    //       password: 'Passw0rd@123',
    //       role: 'Job Seeker',
    //   };

    // const resLog = await request(app).post('/api/v1/user/login').send(userData);
    // expect(resLog.status).to.equal(201);
    // expect(resLog.body).to.have.property('status', 'success');
    // expect(resLog.body).to.have.property('message', 'user logged in successfully');
    // console.log(resLog.body);

    // const myLog = resLog.body.token;

      const response = await request(app).delete(`/api/v1/review/${validReviewId}`).set('cookie', [`token=${jobseekerLogTkn}`]);

      // console.log(response.body);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.message).to.equal('Review deleted successfully');
  });


});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/userModel');
const { Company } = require('./models/companyModel');
const { Job } = require('./models/jobModel');
const { Application } = require('./models/applicationModel');
const { Review } = require('./models/reviewModel');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      dbName: process.env.DBNAME,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Dummy Users Data
const users = [
  {
    username: 'John Doe',
    email: 'john.recruiter@example.com',
    password: 'password123',
    role: 'Recruiter',
    isVerified: true,
    phone: 9876543210,
    city: 'Mumbai',
    address: '123 Marine Drive, Mumbai',
    dob: new Date('1990-05-15'),
    aboutMe: 'Experienced recruiter with 5+ years in tech hiring',
    skills: ['Recruitment', 'HR Management', 'Communication'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      portfolio: 'https://johndoe.com',
      twitter: 'https://twitter.com/johndoe'
    }
  },
  {
    username: 'Sarah Johnson',
    email: 'sarah.recruiter@example.com',
    password: 'password123',
    role: 'Recruiter',
    isVerified: true,
    phone: 9876543211,
    city: 'Bangalore',
    address: '456 MG Road, Bangalore',
    dob: new Date('1988-08-20'),
    aboutMe: 'Senior HR professional specializing in product companies',
    skills: ['Talent Acquisition', 'Interviewing', 'Team Building'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson'
    }
  },
  {
    username: 'Alex Smith',
    email: 'alex.seeker@example.com',
    password: 'password123',
    role: 'Job Seeker',
    isVerified: true,
    phone: 9876543212,
    city: 'Pune',
    address: '789 Koregaon Park, Pune',
    dob: new Date('1998-03-10'),
    aboutMe: 'Full Stack Developer passionate about building scalable applications',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexsmith',
      github: 'https://github.com/alexsmith',
      portfolio: 'https://alexsmith.dev'
    },
    jobPreference: {
      first: 'Full Stack Developer',
      second: 'Backend Developer',
      third: 'Frontend Developer'
    }
  },
  {
    username: 'Priya Sharma',
    email: 'priya.seeker@example.com',
    password: 'password123',
    role: 'Job Seeker',
    isVerified: true,
    phone: 9876543213,
    city: 'Delhi',
    address: '321 Connaught Place, Delhi',
    dob: new Date('1999-11-25'),
    aboutMe: 'Data Scientist with expertise in Machine Learning and AI',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priyasharma',
      github: 'https://github.com/priyasharma'
    },
    jobPreference: {
      first: 'Data Scientist',
      second: 'ML Engineer',
      third: 'AI Researcher'
    }
  },
  {
    username: 'Rahul Kumar',
    email: 'rahul.seeker@example.com',
    password: 'password123',
    role: 'Job Seeker',
    isVerified: true,
    phone: 9876543214,
    city: 'Chennai',
    address: '555 Anna Nagar, Chennai',
    dob: new Date('2000-01-15'),
    aboutMe: 'UI/UX Designer creating delightful user experiences',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rahulkumar',
      portfolio: 'https://rahuldesigns.com'
    },
    jobPreference: {
      first: 'UI/UX Designer',
      second: 'Product Designer',
      third: 'Graphic Designer'
    }
  }
];

// Dummy Companies Data
const companies = [
  {
    name: 'TechCorp Solutions',
    logo: 'https://via.placeholder.com/200/0000FF/FFFFFF?text=TechCorp',
    about: 'Leading technology company specializing in cloud solutions and enterprise software. We empower businesses to transform digitally with cutting-edge technology.',
    website: 'https://techcorp.com',
    employees: 5000,
    branches: 15,
    verified: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      instagram: 'https://instagram.com/techcorp',
      facebook: 'https://facebook.com/techcorp',
      twitter: 'https://twitter.com/techcorp'
    }
  },
  {
    name: 'DataMinds Analytics',
    logo: 'https://via.placeholder.com/200/FF0000/FFFFFF?text=DataMinds',
    about: 'Data analytics and AI company helping businesses make data-driven decisions. We specialize in big data processing, machine learning, and predictive analytics.',
    website: 'https://dataminds.com',
    employees: 2000,
    branches: 8,
    verified: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/dataminds',
      twitter: 'https://twitter.com/dataminds'
    }
  },
  {
    name: 'Creative Designs Studio',
    logo: 'https://via.placeholder.com/200/00FF00/000000?text=Creative',
    about: 'Award-winning design studio creating beautiful digital experiences. We bring brands to life through innovative design and creative storytelling.',
    website: 'https://creativedesigns.com',
    employees: 500,
    branches: 5,
    verified: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/creativedesigns',
      instagram: 'https://instagram.com/creativedesigns',
      facebook: 'https://facebook.com/creativedesigns'
    }
  },
  {
    name: 'FinTech Innovations',
    logo: 'https://via.placeholder.com/200/FFA500/FFFFFF?text=FinTech',
    about: 'Revolutionary fintech company transforming the financial services industry with blockchain and AI-powered solutions.',
    website: 'https://fintechinnovations.com',
    employees: 3000,
    branches: 10,
    verified: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/fintechinnovations',
      twitter: 'https://twitter.com/fintechinnovations'
    }
  },
  {
    name: 'HealthTech Plus',
    logo: 'https://via.placeholder.com/200/800080/FFFFFF?text=HealthTech',
    about: 'Healthcare technology company improving patient care through innovative digital health solutions and telemedicine platforms.',
    website: 'https://healthtechplus.com',
    employees: 1500,
    branches: 6,
    verified: false,
    socialLinks: {
      linkedin: 'https://linkedin.com/company/healthtechplus',
      instagram: 'https://instagram.com/healthtechplus'
    }
  }
];

// Dummy Jobs Data (will be created after companies and users)
const jobsData = [
  {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our engineering team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: ['5+ years experience', 'React.js', 'Node.js', 'MongoDB', 'AWS'],
    location: 'Bangalore',
    experience: '5+ years',
    salary: '₹15-25 LPA',
    timing: 'Full Time',
    perks: ['Health Insurance', 'Stock Options', 'Flexible Hours', 'Remote Work'],
    domain: 'Engineering',
    workType: 'Hybrid',
    userType: 'Professionals',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    title: 'Data Scientist - Machine Learning',
    description: 'Join our AI team to build cutting-edge machine learning models. Work on exciting projects involving NLP, computer vision, and predictive analytics.',
    requirements: ['Python', 'TensorFlow/PyTorch', 'Statistical Analysis', 'SQL', '3+ years experience'],
    location: 'Mumbai',
    experience: '3+ years',
    salary: '₹12-20 LPA',
    timing: 'Full Time',
    perks: ['Learning Budget', 'Conference Attendance', 'Health Insurance', 'Gym Membership'],
    domain: 'Engineering',
    workType: 'In Office',
    userType: 'Professionals',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'UI/UX Designer',
    description: 'Create beautiful and intuitive user interfaces for our products. Collaborate with product managers and engineers to deliver exceptional user experiences.',
    requirements: ['Figma/Sketch', 'User Research', 'Prototyping', 'Portfolio Required', '2+ years experience'],
    location: 'Pune',
    experience: '2+ years',
    salary: '₹8-15 LPA',
    timing: 'Full Time',
    perks: ['Creative Freedom', 'Latest Tools', 'Design Conferences', 'Flexible Hours'],
    domain: 'Arts',
    workType: 'Hybrid',
    userType: 'Professionals',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Frontend Developer Intern',
    description: 'Great opportunity for students to learn and work on real-world projects. Gain hands-on experience with React and modern web technologies.',
    requirements: ['React.js basics', 'HTML/CSS', 'JavaScript', 'Git', 'Eager to learn'],
    location: 'Delhi',
    experience: 'Fresher',
    salary: '₹15,000-25,000/month',
    timing: 'Internship',
    perks: ['Mentorship', 'Certificate', 'Possible Full-time offer', 'Flexible Hours'],
    domain: 'Engineering',
    workType: 'Remote',
    userType: 'College Students',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Backend Developer',
    description: 'Build scalable and secure backend systems. Work with microservices architecture and cloud technologies.',
    requirements: ['Node.js/Python', 'REST APIs', 'Database Design', 'Docker', '3+ years experience'],
    location: 'Bangalore',
    experience: '3+ years',
    salary: '₹10-18 LPA',
    timing: 'Full Time',
    perks: ['Learning Budget', 'Health Insurance', 'Remote Work', 'Performance Bonus'],
    domain: 'Engineering',
    workType: 'Remote',
    userType: 'Professionals',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Business Analyst',
    description: 'Analyze business requirements and translate them into technical specifications. Work closely with stakeholders and development teams.',
    requirements: ['MBA/BBA', 'Data Analysis', 'SQL', 'Communication Skills', '2+ years experience'],
    location: 'Mumbai',
    experience: '2+ years',
    salary: '₹8-14 LPA',
    timing: 'Full Time',
    perks: ['Health Insurance', 'Performance Bonus', 'Training Programs', 'Career Growth'],
    domain: 'Management',
    workType: 'In Office',
    userType: 'Professionals',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Marketing Manager',
    description: 'Lead our marketing initiatives and brand strategy. Drive growth through digital marketing campaigns and customer engagement.',
    requirements: ['Marketing Experience', 'Digital Marketing', 'Analytics', 'Team Leadership', '4+ years'],
    location: 'Delhi',
    experience: '4+ years',
    salary: '₹12-20 LPA',
    timing: 'Full Time',
    perks: ['Performance Bonus', 'Travel Allowance', 'Health Insurance', 'Flexible Hours'],
    domain: 'Management',
    workType: 'Hybrid',
    userType: 'Professionals',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Product Designer Intern',
    description: 'Work on exciting product design projects. Learn from experienced designers and contribute to real products.',
    requirements: ['Design Portfolio', 'Figma', 'Basic UI/UX', 'Creative Thinking', 'Student/Fresher'],
    location: 'Pune',
    experience: 'Fresher',
    salary: '₹20,000/month',
    timing: 'Internship',
    perks: ['Mentorship', 'Design Tools', 'Certificate', 'Learning Opportunities'],
    domain: 'Arts',
    workType: 'Hybrid',
    userType: 'College Students',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  }
];

// Dummy Reviews Data
const reviewsData = [
  {
    rating: 5,
    reviewText: 'Excellent company culture and great learning opportunities. Management is very supportive and the work-life balance is amazing.'
  },
  {
    rating: 4,
    reviewText: 'Good place to work with competitive salary. Some processes could be improved but overall a positive experience.'
  },
  {
    rating: 5,
    reviewText: 'Best decision of my career! The team is fantastic and the projects are very challenging and rewarding.'
  },
  {
    rating: 3,
    reviewText: 'Decent workplace with average facilities. Growth opportunities are limited but salary is competitive.'
  },
  {
    rating: 4,
    reviewText: 'Great company with modern work environment. The benefits package is comprehensive and the team is collaborative.'
  }
];

// Clear existing data
const clearDatabase = async () => {
  await User.deleteMany({});
  await Company.deleteMany({});
  await Job.deleteMany({});
  await Application.deleteMany({});
  await Review.deleteMany({});
  console.log('🗑️  Database cleared');
};

// Seed the database
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    // Create Users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return { ...user, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get recruiters and job seekers
    const recruiters = createdUsers.filter(u => u.role === 'Recruiter');
    const jobSeekers = createdUsers.filter(u => u.role === 'Job Seeker');

    // Create Companies
    console.log('🏢 Creating companies...');
    const companiesWithRecruiters = companies.map((company, index) => ({
      ...company,
      registeredBy: recruiters[index % recruiters.length]._id
    }));
    const createdCompanies = await Company.insertMany(companiesWithRecruiters);
    console.log(`✅ Created ${createdCompanies.length} companies`);

    // Create Jobs
    console.log('💼 Creating jobs...');
    const jobsWithRefs = jobsData.map((job, index) => ({
      ...job,
      company: createdCompanies[index % createdCompanies.length]._id,
      created_by: recruiters[index % recruiters.length]._id
    }));
    const createdJobs = await Job.insertMany(jobsWithRefs);
    console.log(`✅ Created ${createdJobs.length} jobs`);

    // Update companies with job references
    for (let i = 0; i < createdJobs.length; i++) {
      const job = createdJobs[i];
      await Company.findByIdAndUpdate(
        job.company,
        { $push: { opportunities: job._id } }
      );
    }

    // Create Applications
    console.log('📝 Creating applications...');
    const applications = [];
    for (let i = 0; i < createdJobs.length; i++) {
      const job = createdJobs[i];
      const numApplications = Math.floor(Math.random() * 3) + 1; // 1-3 applications per job
      
      for (let j = 0; j < numApplications && j < jobSeekers.length; j++) {
        applications.push({
          job: job._id,
          applicant: jobSeekers[j]._id,
          status: ['applied', 'rejected', 'accepted'][Math.floor(Math.random() * 3)]
        });
      }
    }
    const createdApplications = await Application.insertMany(applications);
    console.log(`✅ Created ${createdApplications.length} applications`);

    // Update jobs with application references
    for (const app of createdApplications) {
      await Job.findByIdAndUpdate(
        app.job,
        { $push: { applications: app._id } }
      );
    }

    // Create Reviews
    console.log('⭐ Creating reviews...');
    const reviews = [];
    for (let i = 0; i < createdCompanies.length; i++) {
      const company = createdCompanies[i];
      const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews per company
      
      for (let j = 0; j < numReviews && j < jobSeekers.length; j++) {
        reviews.push({
          company: company._id,
          user: jobSeekers[j]._id,
          rating: reviewsData[j % reviewsData.length].rating,
          reviewText: reviewsData[j % reviewsData.length].reviewText
        });
      }
    }
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    // Update companies with review references and calculate average rating
    for (const company of createdCompanies) {
      const companyReviews = createdReviews.filter(
        r => r.company.toString() === company._id.toString()
      );
      const avgRating = companyReviews.length > 0
        ? companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length
        : 0;
      
      await Company.findByIdAndUpdate(company._id, {
        reviews: companyReviews.map(r => r._id),
        avgRating: Math.round(avgRating * 10) / 10
      });
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Companies: ${createdCompanies.length}`);
    console.log(`   Jobs: ${createdJobs.length}`);
    console.log(`   Applications: ${createdApplications.length}`);
    console.log(`   Reviews: ${createdReviews.length}`);
    console.log('\n📧 Login Credentials:');
    console.log('   Recruiter: john.recruiter@example.com / password123');
    console.log('   Recruiter: sarah.recruiter@example.com / password123');
    console.log('   Job Seeker: alex.seeker@example.com / password123');
    console.log('   Job Seeker: priya.seeker@example.com / password123');
    console.log('   Job Seeker: rahul.seeker@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Candidate from './models/Candidate';
import Job from './models/Job';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrms-dashboard';

const seedData = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Candidate.deleteMany();
    await Job.deleteMany();

    const candidates = [
      { name: 'Sarah Jenkins', email: 's.jenkins@techcorp.com', role: 'Senior React Developer', experience: '6 Years', status: 'Hired' },
      { name: 'Michael Chen', email: 'm.chen@innovate.io', role: 'Backend Engineer', experience: '4 Years', status: 'In Review' },
      { name: 'Aisha Roberts', email: 'aisha.r@designhub.com', role: 'UI/UX Designer', experience: '3 Years', status: 'Pending' },
      { name: 'David Wilson', email: 'd.wilson@cloudnet.net', role: 'DevOps Specialist', experience: '7 Years', status: 'Hired' },
      { name: 'Elena Rodriguez', email: 'e.rodriguez@datastack.com', role: 'Data Scientist', experience: '5 Years', status: 'In Review' },
      { name: 'James Taylor', email: 'j.taylor@fintech.com', role: 'Full Stack Developer', experience: '4 Years', status: 'Rejected' },
      { name: 'Olivia Brown', email: 'o.brown@creative.co', role: 'Product Designer', experience: '2 Years', status: 'Pending' },
      { name: 'Robert Miller', email: 'r.miller@systematic.io', role: 'QA Engineer', experience: '3 Years', status: 'In Review' },
    ];

    const jobs = [
      { title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Active' },
      { title: 'Backend Engineer (Node.js)', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', status: 'Active' },
      { title: 'UI/UX Designer', department: 'Design', location: 'New York, NY', type: 'Contract', status: 'Active' },
      { title: 'DevOps Specialist', department: 'Infrastructure', location: 'Remote', type: 'Full-time', status: 'Closed' },
      { title: 'Product Manager', department: 'Product', location: 'Austin, TX', type: 'Full-time', status: 'Active' },
    ];

    await Candidate.insertMany(candidates);
    await Job.insertMany(jobs);

    console.log('Database seeded with proper data successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

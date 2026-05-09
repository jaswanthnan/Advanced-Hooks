import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Candidate from './models/Candidate';
import Job from './models/Job';
import User from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrms-dashboard';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Global Logger Middleware
app.use((req, res, next) => {
  console.log(`%c [BACKEND] ${req.method} ${req.url} `, 'color: #10b981');
  next();
});

// Auth Routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    const newUser = new User({ fullName, email, username: email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'password') {
      return res.json({ name: 'Admin', role: 'admin' });
    }

    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }], 
      password: password 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ name: user.fullName, role: user.role });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Candidate Routes
app.get('/api/candidates', async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || req.query.search || '').trim();
    console.log(`[DEBUG] Received search query: "${q}"`);
    
    let query = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      query = {
        $or: [
          { name: regex },
          { email: regex },
          { role: regex }
        ]
      };
    }

    console.log(`[DEBUG] MongoDB Query: ${JSON.stringify(query)}`);
    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    console.log(`[DEBUG] Found ${candidates.length} candidates`);
    res.json(candidates);
  } catch (error: any) {
    console.error(`[ERROR] GET /api/candidates: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/candidates', async (req: Request, res: Response) => {
  try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/candidates/:id', async (req: Request, res: Response) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCandidate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/candidates/:id', async (req: Request, res: Response) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Jobs Routes
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || req.query.search || '').trim();
    console.log(`[DEBUG] Received jobs search query: "${q}"`);
    
    let query = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      query = {
        $or: [
          { title: regex },
          { department: regex },
          { location: regex }
        ]
      };
    }

    console.log(`[DEBUG] Jobs MongoDB Query: ${JSON.stringify(query)}`);
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    console.log(`[DEBUG] Found ${jobs.length} jobs`);
    res.json(jobs);
  } catch (error: any) {
    console.error(`[ERROR] GET /api/jobs: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/jobs', async (req: Request, res: Response) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/jobs/:id', async (req: Request, res: Response) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/jobs/:id', async (req: Request, res: Response) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

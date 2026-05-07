export interface Job {
  _id: string;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  department: string;
  location: string;
  description?: string;
  requirements?: string[];
  status?: string;
  createdAt?: string;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'Pending' | 'In Review' | 'Hired' | 'Rejected';
  experience: string;
  skills?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

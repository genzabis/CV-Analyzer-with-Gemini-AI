
import { Job } from './types';

export const SEEDED_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Engineer (React)',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS', 'Redux', 'Unit Testing'],
    description: 'Developing high-quality user interfaces with modern React practices.'
  },
  {
    id: 'job-2',
    title: 'Backend Developer (Node.js)',
    requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'API Design', 'Microservices', 'Docker', 'Authentication'],
    description: 'Building scalable server-side applications and robust APIs.'
  },
  {
    id: 'job-3',
    title: 'Full Stack Developer',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Git', 'REST API', 'GraphQL'],
    description: 'Handling both client-side and server-side development end-to-end.'
  },
  {
    id: 'job-4',
    title: 'Data Scientist',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'Data Visualization'],
    description: 'Analyzing complex datasets and building predictive models.'
  },
  {
    id: 'job-5',
    title: 'DevOps Engineer',
    requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Linux', 'Bash', 'Networking'],
    description: 'Automating infrastructure and deployment pipelines.'
  }
];

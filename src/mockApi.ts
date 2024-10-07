// Mock data
let users = [
  { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@example.com', name: 'Regular User', role: 'user' },
  { id: 3, email: 'manager@example.com', name: 'Manager User', role: 'manager' },
  { id: 4, email: 'sales@example.com', name: 'Sales User', role: 'sales' },
  { id: 5, email: 'hr@example.com', name: 'HR User', role: 'hr' },
];

let opportunities = [
  { key: 'opp1', company: 'TechCorp', title: 'Software Engineer', status: 'new', blurb: 'Exciting opportunity for a skilled developer', suburb: 'Silicon Valley', state: 'CA', technologies: ['React', 'Node.js'] },
  { key: 'opp2', company: 'DataInc', title: 'Data Scientist', status: 'contacted', blurb: 'Join our data analytics team', suburb: 'New York', state: 'NY', technologies: ['Python', 'Machine Learning'] },
  { key: 'opp3', company: 'WebSolutions', title: 'Frontend Developer', status: 'progressed', blurb: 'Create beautiful user interfaces', suburb: 'Seattle', state: 'WA', technologies: ['Vue.js', 'CSS'] },
  { key: 'opp4', company: 'CloudTech', title: 'DevOps Engineer', status: 'qualified', blurb: 'Manage our cloud infrastructure', suburb: 'Austin', state: 'TX', technologies: ['AWS', 'Docker'] },
  { key: 'opp5', company: 'MobileMasters', title: 'iOS Developer', status: 'followed_up', blurb: 'Develop cutting-edge mobile apps', suburb: 'San Francisco', state: 'CA', technologies: ['Swift', 'iOS'] },
  { key: 'opp6', company: 'AIInnovate', title: 'Machine Learning Engineer', status: 'new', blurb: 'Push the boundaries of AI', suburb: 'Boston', state: 'MA', technologies: ['TensorFlow', 'PyTorch'] },
  { key: 'opp7', company: 'SecureNet', title: 'Cybersecurity Analyst', status: 'contacted', blurb: 'Protect our digital assets', suburb: 'Washington', state: 'DC', technologies: ['Network Security', 'Ethical Hacking'] },
  { key: 'opp8', company: 'HealthTech', title: 'Biomedical Engineer', status: 'progressed', blurb: 'Innovate in healthcare technology', suburb: 'San Diego', state: 'CA', technologies: ['Medical Devices', 'Signal Processing'] },
  { key: 'opp9', company: 'EcoSolutions', title: 'Environmental Data Analyst', status: 'qualified', blurb: 'Help save the planet with data', suburb: 'Portland', state: 'OR', technologies: ['R', 'GIS'] },
  { key: 'opp10', company: 'FinTechFuture', title: 'Blockchain Developer', status: 'followed_up', blurb: 'Build the future of finance', suburb: 'Miami', state: 'FL', technologies: ['Solidity', 'Ethereum'] },
  { key: 'opp11', company: 'RoboticsPro', title: 'Robotics Engineer', status: 'new', blurb: 'Design the next generation of robots', suburb: 'Detroit', state: 'MI', technologies: ['ROS', 'C++'] },
  { key: 'opp12', company: 'VRVision', title: 'VR/AR Developer', status: 'contacted', blurb: 'Create immersive virtual experiences', suburb: 'Los Angeles', state: 'CA', technologies: ['Unity', 'C#'] },
  { key: 'opp13', company: 'SmartHome', title: 'IoT Systems Architect', status: 'progressed', blurb: 'Connect the world of smart devices', suburb: 'Chicago', state: 'IL', technologies: ['MQTT', 'Embedded Systems'] },
  { key: 'opp14', company: 'GenomeX', title: 'Bioinformatics Specialist', status: 'qualified', blurb: 'Analyze genetic data for breakthroughs', suburb: 'Cambridge', state: 'MA', technologies: ['Python', 'Bioconductor'] },
  { key: 'opp15', company: 'AutoDrive', title: 'Autonomous Vehicle Engineer', status: 'followed_up', blurb: 'Shape the future of transportation', suburb: 'Pittsburgh', state: 'PA', technologies: ['Computer Vision', 'LIDAR'] },
  { key: 'opp16', company: 'SpaceX', title: 'Aerospace Engineer', status: 'new', blurb: 'Join the mission to Mars', suburb: 'Hawthorne', state: 'CA', technologies: ['Propulsion Systems', 'Aerodynamics'] },
  { key: 'opp17', company: 'QuantumLeap', title: 'Quantum Computing Researcher', status: 'contacted', blurb: 'Push the boundaries of computing', suburb: 'Boulder', state: 'CO', technologies: ['Quantum Algorithms', 'Qiskit'] },
  { key: 'opp18', company: 'NanoTech', title: 'Nanotechnology Engineer', status: 'progressed', blurb: 'Innovate at the molecular level', suburb: 'Albany', state: 'NY', technologies: ['Nanomaterials', 'Microscopy'] },
  { key: 'opp19', company: 'CleanEnergy', title: 'Renewable Energy Systems Designer', status: 'qualified', blurb: 'Design sustainable energy solutions', suburb: 'Denver', state: 'CO', technologies: ['Solar Technology', 'Wind Energy'] },
  { key: 'opp20', company: 'BrainWave', title: 'Neural Interface Developer', status: 'followed_up', blurb: 'Connect minds and machines', suburb: 'San Jose', state: 'CA', technologies: ['BCI', 'Signal Processing'] },
  { key: 'opp21', company: 'CyberDefense', title: 'Penetration Tester', status: 'new', blurb: 'Identify and exploit security vulnerabilities', suburb: 'Arlington', state: 'VA', technologies: ['Kali Linux', 'Metasploit'] },
  { key: 'opp22', company: 'GeneSplice', title: 'CRISPR Researcher', status: 'contacted', blurb: 'Advance gene editing technologies', suburb: 'Baltimore', state: 'MD', technologies: ['Molecular Biology', 'Gene Sequencing'] },
  { key: 'opp23', company: 'FutureFood', title: 'Food Technology Scientist', status: 'progressed', blurb: 'Develop sustainable food solutions', suburb: 'St. Louis', state: 'MO', technologies: ['Food Chemistry', 'Biotechnology'] },
  { key: 'opp24', company: 'OceanTech', title: 'Marine Robotics Engineer', status: 'qualified', blurb: 'Explore the depths with autonomous vehicles', suburb: 'Woods Hole', state: 'MA', technologies: ['Underwater Robotics', 'Sonar'] },
  { key: 'opp25', company: 'MindMeld', title: 'Natural Language Processing Engineer', status: 'followed_up', blurb: 'Improve human-computer interactions', suburb: 'Montreal', state: 'QC', technologies: ['NLP', 'Deep Learning'] },
];

let companies = [
  { id: 1, key: 'comp1', name: 'TechCorp', website_url: 'https://techcorp.com', linkedin_url: 'https://linkedin.com/company/techcorp', blurb: 'Innovative tech solutions', suburb: 'Silicon Valley', state: 'CA', employees: 500 },
  { id: 2, key: 'comp2', name: 'DataInc', website_url: 'https://datainc.com', linkedin_url: 'https://linkedin.com/company/datainc', blurb: 'Big data analytics', suburb: 'New York', state: 'NY', employees: 200 },
  { id: 3, key: 'comp3', name: 'WebSolutions', website_url: 'https://websolutions.com', linkedin_url: 'https://linkedin.com/company/websolutions', blurb: 'Web development experts', suburb: 'Seattle', state: 'WA', employees: 150 },
  { id: 4, key: 'comp4', name: 'CloudTech', website_url: 'https://cloudtech.com', linkedin_url: 'https://linkedin.com/company/cloudtech', blurb: 'Cloud computing solutions', suburb: 'Austin', state: 'TX', employees: 300 },
  { id: 5, key: 'comp5', name: 'MobileMasters', website_url: 'https://mobilemasters.com', linkedin_url: 'https://linkedin.com/company/mobilemasters', blurb: 'Mobile app development', suburb: 'San Francisco', state: 'CA', employees: 100 },
  { id: 6, key: 'comp6', name: 'AIInnovate', website_url: 'https://aiinnovate.com', linkedin_url: 'https://linkedin.com/company/aiinnovate', blurb: 'Artificial intelligence research', suburb: 'Boston', state: 'MA', employees: 250 },
  { id: 7, key: 'comp7', name: 'SecureNet', website_url: 'https://securenet.com', linkedin_url: 'https://linkedin.com/company/securenet', blurb: 'Cybersecurity solutions', suburb: 'Washington', state: 'DC', employees: 180 },
  { id: 8, key: 'comp8', name: 'HealthTech', website_url: 'https://healthtech.com', linkedin_url: 'https://linkedin.com/company/healthtech', blurb: 'Healthcare technology innovations', suburb: 'San Diego', state: 'CA', employees: 220 },
  { id: 9, key: 'comp9', name: 'EcoSolutions', website_url: 'https://ecosolutions.com', linkedin_url: 'https://linkedin.com/company/ecosolutions', blurb: 'Environmental technology', suburb: 'Portland', state: 'OR', employees: 80 },
  { id: 10, key: 'comp10', name: 'FinTechFuture', website_url: 'https://fintechfuture.com', linkedin_url: 'https://linkedin.com/company/fintechfuture', blurb: 'Financial technology solutions', suburb: 'Miami', state: 'FL', employees: 150 },
];

let contacts = [
  { id: 1, key: 'cont1', name: 'John Doe', role: 'HR Manager', sex: 'Male', linkedin_url: 'https://linkedin.com/in/johndoe', email_address: 'john@techcorp.com', blurb: 'Experienced HR professional' },
  { id: 2, key: 'cont2', name: 'Jane Smith', role: 'CTO', sex: 'Female', linkedin_url: 'https://linkedin.com/in/janesmith', email_address: 'jane@datainc.com', blurb: 'Tech visionary' },
  { id: 3, key: 'cont3', name: 'Mike Johnson', role: 'Senior Developer', sex: 'Male', linkedin_url: 'https://linkedin.com/in/mikejohnson', email_address: 'mike@websolutions.com', blurb: 'Full-stack expert' },
  { id: 4, key: 'cont4', name: 'Emily Brown', role: 'Product Manager', sex: 'Female', linkedin_url: 'https://linkedin.com/in/emilybrown', email_address: 'emily@cloudtech.com', blurb: 'Agile enthusiast' },
  { id: 5, key: 'cont5', name: 'David Lee', role: 'Mobile Developer', sex: 'Male', linkedin_url: 'https://linkedin.com/in/davidlee', email_address: 'david@mobilemasters.com', blurb: 'iOS and Android specialist' },
  { id: 6, key: 'cont6', name: 'Sarah Wilson', role: 'Data Scientist', sex: 'Female', linkedin_url: 'https://linkedin.com/in/sarahwilson', email_address: 'sarah@aiinnovate.com', blurb: 'Machine learning expert' },
  { id: 7, key: 'cont7', name: 'Tom Baker', role: 'Security Analyst', sex: 'Male', linkedin_url: 'https://linkedin.com/in/tombaker', email_address: 'tom@securenet.com', blurb: 'Cybersecurity specialist' },
  { id: 8, key: 'cont8', name: 'Lisa Chen', role: 'Biomedical Engineer', sex: 'Female', linkedin_url: 'https://linkedin.com/in/lisachen', email_address: 'lisa@healthtech.com', blurb: 'Medical device innovator' },
  { id: 9, key: 'cont9', name: 'Alex Green', role: 'Environmental Scientist', sex: 'Non-binary', linkedin_url: 'https://linkedin.com/in/alexgreen', email_address: 'alex@ecosolutions.com', blurb: 'Sustainability advocate' },
  { id: 10, key: 'cont10', name: 'Rachel Taylor', role: 'Blockchain Developer', sex: 'Female', linkedin_url: 'https://linkedin.com/in/racheltaylor', email_address: 'rachel@fintechfuture.com', blurb: 'Cryptocurrency expert' },
];

// Helper function to simulate async behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate a simple incrementing key
let keyCounter = opportunities.length + 1;
const generateKey = (prefix: string) => `${prefix}${keyCounter++}`;

// Mock API functions
export const mockApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    const user = users.find(u => u.email === email);
    if (user && (password === 'password' || (email === 'admin@example.com' && password === 'admin123'))) {
      return { access_token: 'mock_jwt_token' };
    }
    throw new Error('Invalid credentials');
  },

  getCurrentUser: async () => {
    await delay(300);
    return users[0];
  },

  getOpportunities: async () => {
    await delay(300);
    return opportunities;
  },

  createOpportunity: async (opportunity: any) => {
    await delay(300);
    const newOpportunity = { ...opportunity, key: generateKey('opp') };
    opportunities.push(newOpportunity);
    return newOpportunity;
  },

  getOpportunity: async (key: string) => {
    await delay(300);
    const opportunity = opportunities.find(o => o.key === key);
    if (!opportunity) throw new Error('Opportunity not found');
    return opportunity;
  },

  updateOpportunity: async (key: string, updates: any) => {
    await delay(300);
    const index = opportunities.findIndex(o => o.key === key);
    if (index === -1) throw new Error('Opportunity not found');
    opportunities[index] = { ...opportunities[index], ...updates };
    return opportunities[index];
  },

  deleteOpportunity: async (key: string) => {
    await delay(300);
    const index = opportunities.findIndex(o => o.key === key);
    if (index === -1) throw new Error('Opportunity not found');
    opportunities.splice(index, 1);
    return { message: 'Opportunity deleted successfully' };
  },

  getCompanies: async () => {
    await delay(300);
    return companies;
  },

  createCompany: async (company: any) => {
    await delay(300);
    const newCompany = { ...company, id: companies.length + 1, key: generateKey('comp') };
    companies.push(newCompany);
    return newCompany;
  },

  getCompany: async (id: number) => {
    await delay(300);
    const company = companies.find(c => c.id === id);
    if (!company) throw new Error('Company not found');
    return company;
  },

  updateCompany: async (id: number, updates: any) => {
    await delay(300);
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    companies[index] = { ...companies[index], ...updates };
    return companies[index];
  },

  getContacts: async () => {
    await delay(300);
    return contacts;
  },

  createContact: async (contact: any) => {
    await delay(300);
    const newContact = { ...contact, id: contacts.length + 1, key: generateKey('cont') };
    contacts.push(newContact);
    return newContact;
  },

  getContact: async (id: number) => {
    await delay(300);
    const contact = contacts.find(c => c.id === id);
    if (!contact) throw new Error('Contact not found');
    return contact;
  },

  updateContact: async (id: number, updates: any) => {
    await delay(300);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    contacts[index] = { ...contacts[index], ...updates };
    return contacts[index];
  },

  deleteContact: async (id: number) => {
    await delay(300);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    contacts.splice(index, 1);
    return { message: 'Contact deleted successfully' };
  },

  logout: async () => {
    await delay(300);
    return { message: 'Logged out successfully' };
  },
};
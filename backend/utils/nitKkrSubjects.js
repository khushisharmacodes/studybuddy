// Curated branch/semester subject mapping based on NIT Kurukshetra curriculum.
// Used as fallback when official site does not expose clean subject data.

const branchSubjectMap = {
  CSE: {
    1: ['Mathematics I', 'Physics', 'Programming in C', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Data Structures', 'Digital Electronics', 'Environmental Studies'],
    3: ['Discrete Mathematics', 'Object Oriented Programming', 'Computer Organization', 'Operating Systems', 'Probability & Statistics'],
    4: ['Design & Analysis of Algorithms', 'Database Management Systems', 'Computer Networks', 'Theory of Computation', 'Economics'],
    5: ['Software Engineering', 'Compiler Design', 'Web Technologies', 'Machine Learning', 'Cloud Computing'],
    6: ['Artificial Intelligence', 'Data Mining', 'Cyber Security', 'Mobile Computing', 'Computer Graphics'],
    7: ['Big Data Analytics', 'Distributed Systems', 'Natural Language Processing', 'Information Retrieval'],
    8: ['Project Work', 'Professional Ethics', 'Internet of Things'],
  },
  IT: {
    1: ['Mathematics I', 'Physics', 'Programming in C', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Data Structures', 'Digital Electronics', 'Environmental Studies'],
    3: ['Discrete Mathematics', 'Java Programming', 'Computer Organization', 'Operating Systems', 'Probability & Statistics'],
    4: ['Design & Analysis of Algorithms', 'Database Management Systems', 'Computer Networks', 'Web Technologies', 'Economics'],
    5: ['Software Engineering', 'Data Mining', 'Cloud Computing', 'Machine Learning', 'Information Security'],
    6: ['Artificial Intelligence', 'Big Data Analytics', 'Mobile Application Development', 'Internet of Things', 'Human Computer Interaction'],
    7: ['Blockchain Technology', 'Distributed Systems', 'Natural Language Processing', 'Software Testing'],
    8: ['Project Work', 'Professional Ethics', 'Digital Marketing'],
  },
  ECE: {
    1: ['Mathematics I', 'Physics', 'Basic Electrical Engineering', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Electronic Devices', 'Network Analysis', 'Environmental Studies'],
    3: ['Signals & Systems', 'Digital Electronics', 'Analog Circuits', 'Electromagnetic Theory', 'Probability & Statistics'],
    4: ['Control Systems', 'Communication Systems', 'Microprocessors', 'VLSI Design', 'Economics'],
    5: ['Digital Signal Processing', 'Antenna & Wave Propagation', 'Microwave Engineering', 'Optical Communication', 'Embedded Systems'],
    6: ['Wireless Communication', 'Satellite Communication', 'RF Circuit Design', 'Image Processing', 'Robotics'],
    7: ['Mobile Communication', 'Radar Systems', 'IoT', 'Nanotechnology'],
    8: ['Project Work', 'Professional Ethics', 'Telecommunication Networks'],
  },
  EE: {
    1: ['Mathematics I', 'Physics', 'Basic Electrical Engineering', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Circuit Theory', 'Analog Electronics', 'Environmental Studies'],
    3: ['Electrical Machines I', 'Digital Electronics', 'Signals & Systems', 'Electromagnetic Fields', 'Probability & Statistics'],
    4: ['Electrical Machines II', 'Power Systems I', 'Control Systems', 'Power Electronics', 'Economics'],
    5: ['Power Systems II', 'Electrical Drives', 'Renewable Energy', 'Microprocessors', 'Instrumentation'],
    6: ['Switchgear & Protection', 'High Voltage Engineering', 'Digital Signal Processing', 'Energy Auditing', 'Smart Grid'],
    7: ['Power System Analysis', 'HVDC Transmission', 'Electric Vehicles', 'Robotics'],
    8: ['Project Work', 'Professional Ethics', 'Power Quality'],
  },
  ME: {
    1: ['Mathematics I', 'Physics', 'Engineering Mechanics', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Strength of Materials', 'Thermodynamics', 'Environmental Studies'],
    3: ['Fluid Mechanics', 'Manufacturing Processes', 'Kinematics of Machines', 'Metrology', 'Probability & Statistics'],
    4: ['Heat Transfer', 'Dynamics of Machines', 'Machine Design I', 'Industrial Engineering', 'Economics'],
    5: ['Machine Design II', 'Automobile Engineering', 'Refrigeration & Air Conditioning', 'CAD/CAM', 'Robotics'],
    6: ['Finite Element Analysis', 'Mechanical Vibrations', 'Turbo Machinery', 'Composite Materials', 'Supply Chain Management'],
    7: ['Operations Research', 'Quality Control', 'Industrial Automation', 'Tool Design'],
    8: ['Project Work', 'Professional Ethics', 'Entrepreneurship'],
  },
  CE: {
    1: ['Mathematics I', 'Physics', 'Engineering Mechanics', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Strength of Materials', 'Surveying', 'Environmental Studies'],
    3: ['Fluid Mechanics', 'Concrete Technology', 'Structural Analysis I', 'Geology', 'Probability & Statistics'],
    4: ['Structural Analysis II', 'Geotechnical Engineering', 'Transportation Engineering', 'Hydrology', 'Economics'],
    5: ['Design of Concrete Structures', 'Design of Steel Structures', 'Irrigation Engineering', 'Environmental Engineering', 'GIS'],
    6: ['Construction Management', 'Earthquake Engineering', 'Pavement Design', 'Water Resources', 'Remote Sensing'],
    7: ['Bridge Engineering', 'Foundation Engineering', 'Town Planning', 'Sustainable Construction'],
    8: ['Project Work', 'Professional Ethics', 'Contract Management'],
  },
  PIE: {
    1: ['Mathematics I', 'Physics', 'Engineering Mechanics', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Strength of Materials', 'Manufacturing Processes', 'Environmental Studies'],
    3: ['Fluid Mechanics', 'Engineering Metallurgy', 'Kinematics of Machines', 'Industrial Engineering', 'Probability & Statistics'],
    4: ['Heat Transfer', 'Dynamics of Machines', 'Machine Design', 'Production Planning', 'Economics'],
    5: ['Tool Design', 'CAD/CAM', 'Quality Control', 'Operations Research', 'Supply Chain Management'],
    6: ['Lean Manufacturing', 'Six Sigma', 'Automation', 'Industrial Robotics', 'Ergonomics'],
    7: ['Project Management', 'Maintenance Engineering', 'Advanced Manufacturing', 'Logistics'],
    8: ['Project Work', 'Professional Ethics', 'Entrepreneurship'],
  },
  CHE: {
    1: ['Mathematics I', 'Physics', 'Engineering Chemistry', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Fluid Mechanics', 'Thermodynamics', 'Environmental Studies'],
    3: ['Heat Transfer', 'Chemical Process Calculations', 'Mechanical Operations', 'Organic Chemistry', 'Probability & Statistics'],
    4: ['Mass Transfer', 'Chemical Reaction Engineering', 'Process Instrumentation', 'Transport Phenomena', 'Economics'],
    5: ['Process Control', 'Petroleum Refining', 'Polymer Technology', 'Environmental Engineering', 'Plant Design'],
    6: ['Biochemical Engineering', 'Fertilizer Technology', 'Catalysis', 'Process Optimization', 'Safety Engineering'],
    7: ['Process Modeling', 'Membrane Technology', 'Nanotechnology', 'Energy Engineering'],
    8: ['Project Work', 'Professional Ethics', 'Process Economics'],
  },
  'M&C': {
    1: ['Mathematics I', 'Physics', 'Programming in C', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Chemistry', 'Data Structures', 'Discrete Mathematics', 'Environmental Studies'],
    3: ['Real Analysis', 'Linear Algebra', 'Probability & Statistics', 'Algorithms', 'Operating Systems'],
    4: ['Numerical Methods', 'Complex Analysis', 'Database Management Systems', 'Computer Networks', 'Economics'],
    5: ['Optimization Techniques', 'Machine Learning', 'Cryptography', 'Graph Theory', 'Financial Mathematics'],
    6: ['Deep Learning', 'Stochastic Processes', 'Data Mining', 'Game Theory', 'Computer Graphics'],
    7: ['Natural Language Processing', 'Big Data Analytics', 'Computer Vision', 'Operations Research'],
    8: ['Project Work', 'Professional Ethics', 'Quantitative Finance'],
  },
  Physics: {
    1: ['Mathematics I', 'Mechanics', 'Electromagnetism', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Quantum Mechanics', 'Thermodynamics', 'Optics', 'Environmental Studies'],
    3: ['Statistical Mechanics', 'Electrodynamics', 'Solid State Physics', 'Computational Physics', 'Probability & Statistics'],
    4: ['Nuclear Physics', 'Atomic & Molecular Physics', 'Laser Physics', 'Electronics', 'Economics'],
    5: ['Condensed Matter Physics', 'Particle Physics', 'Plasma Physics', 'Astrophysics', 'Nanophysics'],
    6: ['Quantum Field Theory', 'General Relativity', 'Semiconductor Physics', 'Biophysics', 'Materials Science'],
    7: ['Advanced Quantum Mechanics', 'Optoelectronics', 'Superconductivity', 'Surface Physics'],
    8: ['Project Work', 'Professional Ethics', 'Research Methodology'],
  },
  Chemistry: {
    1: ['Mathematics I', 'Physical Chemistry', 'Organic Chemistry', 'Engineering Drawing', 'English'],
    2: ['Mathematics II', 'Inorganic Chemistry', 'Analytical Chemistry', 'Spectroscopy', 'Environmental Studies'],
    3: ['Organic Synthesis', 'Quantum Chemistry', 'Thermodynamics', 'Polymer Chemistry', 'Probability & Statistics'],
    4: ['Coordination Chemistry', 'Electrochemistry', 'Surface Chemistry', 'Green Chemistry', 'Economics'],
    5: ['Medicinal Chemistry', 'Nanochemistry', 'Catalysis', 'Bioinorganic Chemistry', 'Materials Chemistry'],
    6: ['Photochemistry', 'Natural Products', 'Computational Chemistry', 'Environmental Chemistry', 'Industrial Chemistry'],
    7: ['Organometallic Chemistry', 'Supramolecular Chemistry', 'Heterocyclic Chemistry', 'Corrosion Science'],
    8: ['Project Work', 'Professional Ethics', 'Chemical Safety'],
  },
  MCA: {
    1: ['Mathematical Foundations', 'Problem Solving & Programming in C', 'Computer Organization', 'Data Structures', 'Communication Skills'],
    2: ['Object Oriented Programming in Java', 'Database Management Systems', 'Operating Systems', 'Software Engineering', 'Web Technologies'],
    3: ['Design & Analysis of Algorithms', 'Computer Networks', 'Python Programming', 'Data Mining', 'Cloud Computing'],
    4: ['Artificial Intelligence', 'Machine Learning', 'Cyber Security', 'Mobile Application Development', 'Big Data Analytics'],
    5: ['Natural Language Processing', 'Internet of Things', 'Blockchain Technology', 'Distributed Systems'],
    6: ['Project Work', 'Professional Ethics', 'Software Testing'],
  },
  Humanities: {
    1: ['Communication Skills', 'Sociology', 'Psychology', 'Economics', 'English'],
    2: ['Professional Communication', 'Philosophy', 'Political Science', 'History', 'Environmental Studies'],
    3: ['Organizational Behavior', 'Marketing Management', 'Financial Accounting', 'Business Law', 'Research Methods'],
    4: ['Human Resource Management', 'Managerial Economics', 'Entrepreneurship', 'Business Ethics', 'Operations Management'],
    5: ['Strategic Management', 'Consumer Behavior', 'Brand Management', 'Digital Marketing', 'Project Management'],
    6: ['International Business', 'Leadership', 'Supply Chain Management', 'Innovation Management', 'E-Commerce'],
    7: ['Corporate Governance', 'Talent Management', 'Sales Management', 'Public Relations'],
    8: ['Project Work', 'Professional Ethics', 'Business Analytics'],
  },
  BARCH: {
    1: ['Architectural Design I', 'Building Materials', 'Engineering Drawing', 'English', 'Environmental Science'],
    2: ['Architectural Design II', 'Structural Mechanics', 'History of Architecture', 'Surveying', 'Model Workshop'],
    3: ['Architectural Design III', 'Concrete Technology', 'Theory of Design', 'Climatology', 'Computer Aided Design'],
    4: ['Architectural Design IV', 'Construction Technology', 'Landscape Architecture', 'Water Supply & Sanitation', 'Sociology'],
    5: ['Architectural Design V', 'Steel & Timber Structures', 'Working Drawing', 'Specifications & Estimation', 'Urban Design'],
    6: ['Architectural Design VI', 'Housing', 'Interior Design', 'Professional Practice', 'Electrical & HVAC'],
    7: ['Architectural Design VII', 'Sustainable Architecture', 'Building Economics', 'Construction Management', 'Thesis Prep'],
    8: ['Architectural Design VIII', 'Town Planning', 'Conservation', 'Project Work', 'Professional Ethics'],
    9: ['Architectural Design IX', 'Advanced Construction', 'Research Methodology', 'Thesis I'],
    10: ['Thesis II', 'Professional Training', 'Seminar'],
  },
  MTechCSE: {
    1: ['Advanced Algorithms', 'Advanced Computer Networks', 'Research Methodology', 'Elective I'],
    2: ['Advanced Operating Systems', 'Advanced DBMS', 'Cyber Security', 'Elective II'],
    3: ['Dissertation Part I', 'Seminar', 'Elective III'],
    4: ['Dissertation Part II', 'Comprehensive Viva'],
  },
  MTechECE: {
    1: ['Advanced Digital Signal Processing', 'VLSI Design', 'Research Methodology', 'Elective I'],
    2: ['Wireless Communication', 'Embedded Systems', 'RF Circuit Design', 'Elective II'],
    3: ['Dissertation Part I', 'Seminar', 'Elective III'],
    4: ['Dissertation Part II', 'Comprehensive Viva'],
  },
  MTechEE: {
    1: ['Advanced Power Systems', 'Power Electronics', 'Research Methodology', 'Elective I'],
    2: ['Electrical Drives', 'Renewable Energy Systems', 'Smart Grid', 'Elective II'],
    3: ['Dissertation Part I', 'Seminar', 'Elective III'],
    4: ['Dissertation Part II', 'Comprehensive Viva'],
  },
  MTechME: {
    1: ['Advanced Engineering Mathematics', 'Advanced Manufacturing', 'Research Methodology', 'Elective I'],
    2: ['Finite Element Methods', 'Machine Design', 'Robotics', 'Elective II'],
    3: ['Dissertation Part I', 'Seminar', 'Elective III'],
    4: ['Dissertation Part II', 'Comprehensive Viva'],
  },
  MTechCE: {
    1: ['Advanced Structural Analysis', 'Construction Management', 'Research Methodology', 'Elective I'],
    2: ['Advanced Geotechnical Engineering', 'Transportation Planning', 'Environmental Engineering', 'Elective II'],
    3: ['Dissertation Part I', 'Seminar', 'Elective III'],
    4: ['Dissertation Part II', 'Comprehensive Viva'],
  },
  MTechPIE: {
    1: ['Advanced Manufacturing Processes', 'Industrial Engineering', 'Research Methodology', 'Elective I'],
    2: ['Quality Engineering', 'Operations Research', 'Supply Chain Management', 'Elective II'],
    3: ['Dissertation Part I', 'Seminar', 'Elective III'],
    4: ['Dissertation Part II', 'Comprehensive Viva'],
  },
  MTechCHE: {
    1: ['Advanced Transport Phenomena', 'Chemical Reaction Engineering', 'Research Methodology', 'Elective I'],
    2: ['Process Control', 'Process Optimization', 'Petroleum Refining', 'Elective II'],
    3: ['Dissertation Part I', 'Seminar', 'Elective III'],
    4: ['Dissertation Part II', 'Comprehensive Viva'],
  },
  MBA: {
    1: ['Organizational Behavior', 'Managerial Economics', 'Financial Accounting', 'Marketing Management', 'Business Statistics'],
    2: ['Human Resource Management', 'Financial Management', 'Operations Management', 'Business Research Methods', 'Business Law'],
    3: ['Strategic Management', 'Consumer Behavior', 'Entrepreneurship', 'Digital Marketing', 'Elective I'],
    4: ['International Business', 'Leadership & Ethics', 'Project Management', 'Elective II', 'Summer Internship Report'],
  },
  MScMath: {
    1: ['Real Analysis', 'Linear Algebra', 'Abstract Algebra', 'Differential Equations', 'Probability Theory'],
    2: ['Complex Analysis', 'Topology', 'Numerical Analysis', 'Discrete Mathematics', 'Statistics'],
    3: ['Functional Analysis', 'Optimization Techniques', 'Number Theory', 'Elective I'],
    4: ['Project Work', 'Seminar', 'Elective II'],
  },
  MScPhysics: {
    1: ['Mathematical Physics', 'Classical Mechanics', 'Quantum Mechanics I', 'Electronics', 'Lab I'],
    2: ['Electrodynamics', 'Statistical Mechanics', 'Quantum Mechanics II', 'Solid State Physics', 'Lab II'],
    3: ['Nuclear & Particle Physics', 'Laser Physics', 'Elective I', 'Lab III'],
    4: ['Project Work', 'Seminar', 'Elective II'],
  },
  MScChemistry: {
    1: ['Inorganic Chemistry I', 'Organic Chemistry I', 'Physical Chemistry I', 'Analytical Chemistry', 'Lab I'],
    2: ['Inorganic Chemistry II', 'Organic Chemistry II', 'Physical Chemistry II', 'Spectroscopy', 'Lab II'],
    3: ['Medicinal Chemistry', 'Green Chemistry', 'Elective I', 'Lab III'],
    4: ['Project Work', 'Seminar', 'Elective II'],
  },
};

const normalizeBranch = (branch) => {
  if (!branch) return '';
  const lower = branch.toLowerCase();

  // Architecture
  if (lower.includes('barch') || lower.includes('architecture')) return 'BARCH';

  // Postgraduate engineering - check before generic branch names
  if (lower.includes('m.tech') || lower.includes('mtech')) {
    if (lower.includes('computer')) return 'MTechCSE';
    if (lower.includes('electronics') || lower.includes('communication')) return 'MTechECE';
    if (lower.includes('electrical')) return 'MTechEE';
    if (lower.includes('mechanical')) return 'MTechME';
    if (lower.includes('civil')) return 'MTechCE';
    if (lower.includes('production') || lower.includes('industrial')) return 'MTechPIE';
    if (lower.includes('chemical')) return 'MTechCHE';
  }

  // Sciences and management
  if (lower.includes('m.sc') || lower.includes('msc')) {
    if (lower.includes('math')) return 'MScMath';
    if (lower.includes('physics')) return 'MScPhysics';
    if (lower.includes('chem')) return 'MScChemistry';
  }
  if (lower.includes('mba') || lower.includes('business administration')) return 'MBA';

  // Undergraduate and existing branches
  if (lower.includes('cse') || lower.includes('computer science')) return 'CSE';
  if (lower.includes('it') || lower.includes('information technology')) return 'IT';
  if (lower.includes('ece') || lower.includes('electronics') || lower.includes('communication')) return 'ECE';
  if (lower === 'ee' || lower.includes('electrical engineering') || lower.includes('electrical')) return 'EE';
  if (lower === 'me' || lower.includes('mechanical engineering') || lower.includes('mechanical')) return 'ME';
  if (lower === 'ce' || lower.includes('civil engineering') || lower.includes('civil')) return 'CE';
  if (lower.includes('pie') || lower.includes('production')) return 'PIE';
  if (lower.includes('chemical') || lower.includes(' che')) return 'CHE';
  if (lower.includes('m&c') || lower.includes('mathematics & computing')) return 'M&C';
  if (lower.includes('physics')) return 'Physics';
  if (lower.includes('chemistry')) return 'Chemistry';
  if (lower.includes('mca') || lower.includes('computer applications')) return 'MCA';
  if (lower.includes('humanities') || lower.includes('management')) return 'Humanities';
  return '';
};

const getSubjectsForUser = (branch, semester) => {
  const key = normalizeBranch(branch);
  if (!key) return [];
  const branchData = branchSubjectMap[key] || {};
  const availableSems = Object.keys(branchData).map(Number);
  const maxSem = availableSems.length > 0 ? Math.max(...availableSems) : 8;
  const sem = Math.min(Math.max(Number(semester) || 1, 1), maxSem);
  return branchData[sem] || [];
};

const getAllBranchSubjects = (branch) => {
  const key = normalizeBranch(branch);
  if (!key) return [];
  const branchData = branchSubjectMap[key] || {};
  return Object.values(branchData).flat();
};

export { branchSubjectMap, normalizeBranch, getSubjectsForUser, getAllBranchSubjects };

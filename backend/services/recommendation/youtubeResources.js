// Curated YouTube channels and standalone videos for NIT Kurukshetra subjects.
// All links point to publicly available YouTube content.

const youtubeResources = [
  // DSA & Interview Prep
  {
    title: 'NeetCode',
    description: 'Blind 75, NeetCode 150 and System Design.',
    type: 'channel',
    url: 'https://www.youtube.com/@NeetCode',
    category: 'DSA',
    tags: ['dsa', 'interview', 'system design', 'youtube'],
  },
  {
    title: 'Abdul Bari - Algorithms',
    description: 'Visual algorithms and data structures explanations.',
    type: 'channel',
    url: 'https://www.youtube.com/@abdul_bari',
    category: 'DSA',
    tags: ['dsa', 'algorithms', 'youtube'],
  },
  {
    title: 'CodeWithHarry',
    description: 'DSA, Python, Web Dev and C/C++ in Hindi.',
    type: 'channel',
    url: 'https://www.youtube.com/@CodeWithHarry',
    category: 'DSA',
    tags: ['dsa', 'coding', 'web dev', 'youtube'],
  },
  {
    title: "Jenny's Lectures CS IT",
    description: 'Core CS subjects, DSA and GATE content.',
    type: 'channel',
    url: 'https://www.youtube.com/@JennysLecturesCSIT',
    category: 'DSA',
    tags: ['dsa', 'computer networks', 'os', 'dbms', 'youtube'],
  },

  // Operating Systems
  {
    title: 'Neso Academy - Operating Systems',
    description: 'Animated OS concepts for semester exams.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O',
    category: 'Operating Systems',
    tags: ['os', 'college', 'youtube'],
  },
  {
    title: 'KnowledgeGate - Operating Systems',
    description: 'OS lectures aligned with GATE and university exams.',
    type: 'channel',
    url: 'https://www.youtube.com/@KnowledgeGate',
    category: 'Operating Systems',
    tags: ['os', 'gate', 'youtube'],
  },
  {
    title: 'Gate Smashers - Operating Systems',
    description: 'Quick OS revision for GATE and semester exams.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
    category: 'Operating Systems',
    tags: ['os', 'gate', 'youtube'],
  },

  // Computer Networks
  {
    title: 'Neso Academy - Computer Networks',
    description: 'Concept-by-concept networking playlist.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78A8IvdtXTDm',
    category: 'Computer Networks',
    tags: ['computer networks', 'cn', 'youtube'],
  },
  {
    title: 'Gate Smashers - Computer Networks',
    description: 'CN revision for GATE and semesters.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGj6zJ4jJ1hJ9a7dX9wN',
    category: 'Computer Networks',
    tags: ['computer networks', 'cn', 'gate', 'youtube'],
  },

  // DBMS
  {
    title: 'Gate Smashers - DBMS',
    description: 'DBMS concepts and SQL for exams.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y',
    category: 'Database Management Systems',
    tags: ['dbms', 'sql', 'youtube'],
  },
  {
    title: 'Neso Academy - DBMS',
    description: 'Structured DBMS playlist for beginners.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqR69yx5UwfLxHwZPFDk0a1BU',
    category: 'Database Management Systems',
    tags: ['dbms', 'sql', 'youtube'],
  },

  // Object Oriented Programming / Java
  {
    title: 'Telusko',
    description: 'Java, Python, Kotlin and software concepts.',
    type: 'channel',
    url: 'https://www.youtube.com/@telusko',
    category: 'Object Oriented Programming',
    tags: ['java', 'oops', 'programming', 'youtube'],
  },
  {
    title: 'Programming with Mosh',
    description: 'OOP, Java, Python and software engineering tutorials.',
    type: 'channel',
    url: 'https://www.youtube.com/@programmingwithmosh',
    category: 'Object Oriented Programming',
    tags: ['java', 'oops', 'python', 'youtube'],
  },

  // Web Technologies
  {
    title: 'Traversy Media',
    description: 'Web development crash courses and projects.',
    type: 'channel',
    url: 'https://www.youtube.com/@TraversyMedia',
    category: 'Web Technologies',
    tags: ['web dev', 'react', 'node', 'youtube'],
  },
  {
    title: 'The Net Ninja',
    description: 'Modern web frameworks and CSS tutorials.',
    type: 'channel',
    url: 'https://www.youtube.com/@thenetninja',
    category: 'Web Technologies',
    tags: ['web dev', 'react', 'css', 'youtube'],
  },
  {
    title: 'Web Dev Simplified',
    description: 'Simplified web development explanations.',
    type: 'channel',
    url: 'https://www.youtube.com/@WebDevSimplified',
    category: 'Web Technologies',
    tags: ['web dev', 'javascript', 'youtube'],
  },
  {
    title: 'freeCodeCamp',
    description: 'Full-length coding courses including web dev.',
    type: 'channel',
    url: 'https://www.youtube.com/@freecodecamp',
    category: 'Web Technologies',
    tags: ['web dev', 'coding', 'course', 'youtube'],
  },

  // Machine Learning / AI / Data Science
  {
    title: 'Krish Naik',
    description: 'ML, Deep Learning and data science projects.',
    type: 'channel',
    url: 'https://www.youtube.com/@krishnaik06',
    category: 'Machine Learning',
    tags: ['ml', 'data science', 'ai', 'youtube'],
  },
  {
    title: 'Codebasics',
    description: 'Data science, ML and Python fundamentals.',
    type: 'channel',
    url: 'https://www.youtube.com/@codebasics',
    category: 'Machine Learning',
    tags: ['ml', 'data science', 'python', 'youtube'],
  },
  {
    title: 'StatQuest with Josh Starmer',
    description: 'Statistics and ML concepts explained simply.',
    type: 'channel',
    url: 'https://www.youtube.com/@statquest',
    category: 'Machine Learning',
    tags: ['ml', 'statistics', 'youtube'],
  },
  {
    title: 'MIT OpenCourseWare - AI',
    description: 'MIT lectures on AI and algorithms.',
    type: 'channel',
    url: 'https://www.youtube.com/@MITOCW',
    category: 'Artificial Intelligence',
    tags: ['ai', 'ml', 'course', 'youtube'],
  },
  {
    title: 'Stanford Online',
    description: 'Stanford CS and AI courses.',
    type: 'channel',
    url: 'https://www.youtube.com/@StanfordOnline',
    category: 'Artificial Intelligence',
    tags: ['ai', 'ml', 'course', 'youtube'],
  },

  // Cyber Security / Cloud / Blockchain / IoT
  {
    title: 'freeCodeCamp - Cyber Security',
    description: 'Security, ethical hacking and networking courses.',
    type: 'channel',
    url: 'https://www.youtube.com/@freecodecamp',
    category: 'Cyber Security',
    tags: ['cyber security', 'networking', 'youtube'],
  },
  {
    title: 'Simplilearn - Cloud Computing',
    description: 'AWS, Azure and cloud fundamentals.',
    type: 'channel',
    url: 'https://www.youtube.com/@SimplilearnOfficial',
    category: 'Cloud Computing',
    tags: ['cloud computing', 'aws', 'youtube'],
  },
  {
    title: 'Whiteboard Crypto',
    description: 'Blockchain and cryptocurrency explained visually.',
    type: 'channel',
    url: 'https://www.youtube.com/@WhiteboardCrypto',
    category: 'Blockchain Technology',
    tags: ['blockchain', 'youtube'],
  },
  {
    title: 'IoT Projects by Neso Academy',
    description: 'IoT concepts and embedded systems.',
    type: 'channel',
    url: 'https://www.youtube.com/@nesoacademy',
    category: 'Internet of Things',
    tags: ['iot', 'electronics', 'youtube'],
  },

  // Mathematics / Statistics
  {
    title: '3Blue1Brown',
    description: 'Visual, intuitive mathematics.',
    type: 'channel',
    url: 'https://www.youtube.com/@3blue1brown',
    category: 'Mathematics',
    tags: ['maths', 'mathematics', 'youtube'],
  },
  {
    title: 'Khan Academy - Mathematics',
    description: 'Comprehensive math lessons from basics to advanced.',
    type: 'channel',
    url: 'https://www.youtube.com/@khanacademy',
    category: 'Mathematics',
    tags: ['maths', 'mathematics', 'youtube'],
  },
  {
    title: 'MIT OpenCourseWare - Probability',
    description: 'MIT probability and statistics lectures.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP60hI9ATjfrb0pLLHxUOxaK0',
    category: 'Probability & Statistics',
    tags: ['probability', 'statistics', 'maths', 'youtube'],
  },

  // Physics
  {
    title: 'Walter Lewin Lectures',
    description: 'Classic MIT physics lectures.',
    type: 'channel',
    url: 'https://www.youtube.com/@WalterLewin',
    category: 'Physics',
    tags: ['physics', 'mechanics', 'youtube'],
  },
  {
    title: 'Physics Wallah',
    description: 'Physics for JEE, GATE and university exams.',
    type: 'channel',
    url: 'https://www.youtube.com/@PhysicsWallah',
    category: 'Physics',
    tags: ['physics', 'gate', 'youtube'],
  },
  {
    title: 'Khan Academy - Physics',
    description: 'Physics lessons from high school to early undergrad.',
    type: 'channel',
    url: 'https://www.youtube.com/@khanacademy',
    category: 'Physics',
    tags: ['physics', 'youtube'],
  },

  // Chemistry
  {
    title: 'Professor Dave Explains',
    description: 'Organic, inorganic and physical chemistry.',
    type: 'channel',
    url: 'https://www.youtube.com/@ProfessorDaveExplains',
    category: 'Chemistry',
    tags: ['chemistry', 'organic chemistry', 'youtube'],
  },
  {
    title: 'Physics Wallah - Chemistry',
    description: 'Chemistry lectures for university and competitive exams.',
    type: 'channel',
    url: 'https://www.youtube.com/@PhysicsWallah',
    category: 'Chemistry',
    tags: ['chemistry', 'youtube'],
  },
  {
    title: 'CrashCourse Chemistry',
    description: 'Fast and fun chemistry overview.',
    type: 'playlist',
    url: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oGr',
    category: 'Chemistry',
    tags: ['chemistry', 'youtube'],
  },

  // MBA / Management
  {
    title: 'Study IQ Education',
    description: 'Management, current affairs and competitive exam content.',
    type: 'channel',
    url: 'https://www.youtube.com/@StudyIQEducation',
    category: 'Management',
    tags: ['mba', 'management', 'youtube'],
  },
  {
    title: 'Wall Street Mojo',
    description: 'Finance, accounting and valuation concepts.',
    type: 'channel',
    url: 'https://www.youtube.com/@wallstreetmojo',
    category: 'Finance',
    tags: ['finance', 'mba', 'youtube'],
  },
  {
    title: 'Gary Vaynerchuk',
    description: 'Marketing, entrepreneurship and leadership mindset.',
    type: 'channel',
    url: 'https://www.youtube.com/@garyvee',
    category: 'Marketing',
    tags: ['marketing', 'entrepreneurship', 'youtube'],
  },
  {
    title: 'Simon Sinek',
    description: 'Leadership and organizational behaviour.',
    type: 'channel',
    url: 'https://www.youtube.com/@SimonSinek',
    category: 'Organizational Behavior',
    tags: ['hr', 'leadership', 'management', 'youtube'],
  },

  // Architecture
  {
    title: '30X40 Design Workshop',
    description: 'Architecture design, drawing and presentation.',
    type: 'channel',
    url: 'https://www.youtube.com/@30X40DesignWorkshop',
    category: 'Architecture',
    tags: ['architecture', 'design', 'youtube'],
  },
  {
    title: 'Architecture Daily Sketches',
    description: 'Architectural sketching and visualization.',
    type: 'channel',
    url: 'https://www.youtube.com/@ArchitectureDailySketches',
    category: 'Architecture',
    tags: ['architecture', 'drawing', 'youtube'],
  },

  // General Coding / Productivity
  {
    title: 'Fireship',
    description: 'Quick, practical coding tutorials and tech news.',
    type: 'channel',
    url: 'https://www.youtube.com/@Fireship',
    category: 'Coding',
    tags: ['coding', 'web dev', 'youtube'],
  },
  {
    title: 'Ali Abdaal',
    description: 'Study techniques and productivity systems.',
    type: 'channel',
    url: 'https://www.youtube.com/@aliabdaal',
    category: 'Productivity',
    tags: ['productivity', 'study', 'youtube'],
  },
];

export default youtubeResources;

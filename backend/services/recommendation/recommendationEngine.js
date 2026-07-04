import youtubeResources from './youtubeResources.js';
import extraResources from './extraResources.js';
import {
  normalize,
  expandSubject,
  resourceMatchesSubjects,
} from '../../utils/subjectMatcher.js';

// Core static resources (notes, sheets, practice sites). YouTube content is imported separately.
const baseResourceDatabase = [
  // DSA
  {
    title: 'NeetCode 150',
    description: 'A better way to prepare for coding interviews.',
    type: 'playlist',
    url: 'https://neetcode.io/roadmap',
    category: 'DSA',
    tags: ['dsa', 'interview', 'placement'],
  },
  {
    title: 'Love Babbar DSA Sheet',
    description: '450+ DSA questions crunched for beginners.',
    type: 'sheet',
    url: 'https://www.geeksforgeeks.org/dsa-sheet-by-love-babbar/',
    category: 'DSA',
    tags: ['dsa', 'interview'],
  },

  // Web Dev
  {
    title: 'Full Stack Open',
    description: 'Deep dive into modern web development with React and Node.',
    type: 'course',
    url: 'https://fullstackopen.com/en/',
    category: 'Web Technologies',
    tags: ['web dev', 'fullstack', 'react', 'node'],
  },

  // OS
  {
    title: 'Operating System Notes',
    description: 'Quick revision notes for OS exams.',
    type: 'notes',
    url: 'https://www.geeksforgeeks.org/operating-systems/',
    category: 'Operating Systems',
    tags: ['os', 'college'],
  },

  // DBMS
  {
    title: 'DBMS Notes by Gate Smashers',
    description: 'Concise DBMS notes for placements and exams.',
    type: 'notes',
    url: 'https://www.geeksforgeeks.org/dbms/',
    category: 'Database Management Systems',
    tags: ['dbms', 'college', 'interview'],
  },
  {
    title: 'SQLZoo',
    description: 'Interactive SQL practice problems.',
    type: 'practice',
    url: 'https://sqlzoo.net/wiki/SQL_Tutorial',
    category: 'Database Management Systems',
    tags: ['dbms', 'sql', 'practice'],
  },

  // ML / Data Science
  {
    title: 'Machine Learning by Andrew Ng',
    description: 'The classic ML course on Coursera.',
    type: 'course',
    url: 'https://www.coursera.org/learn/machine-learning',
    category: 'Machine Learning',
    tags: ['ml', 'data science', 'ai'],
  },
  {
    title: 'Kaggle Learn',
    description: 'Micro-courses for data science and ML.',
    type: 'course',
    url: 'https://www.kaggle.com/learn',
    category: 'Machine Learning',
    tags: ['ml', 'data science', 'practice'],
  },

  // Interview / Placement
  {
    title: 'InterviewBit',
    description: 'Coding interview preparation platform.',
    type: 'practice',
    url: 'https://www.interviewbit.com/',
    category: 'Interview Prep',
    tags: ['interview', 'placement', 'dsa'],
  },
  {
    title: 'System Design Primer',
    description: 'Learn system design for interviews.',
    type: 'article',
    url: 'https://github.com/donnemartin/system-design-primer',
    category: 'Interview Prep',
    tags: ['interview', 'system design'],
  },
];

const resourceDatabase = [...baseResourceDatabase, ...youtubeResources, ...extraResources];

const matchesFocusSubject = (resource, focusSubject) => {
  if (!focusSubject) return false;
  const terms = new Set([normalize(resource.category), ...(resource.tags || []).map(normalize)]);
  const expanded = expandSubject(focusSubject);
  return expanded.some((term) => terms.has(term));
};

const matchesWeakSubject = (resource, weakSubjects) => {
  if (!weakSubjects || weakSubjects.length === 0) return { matched: false };
  for (const subject of weakSubjects) {
    if (resourceMatchesSubjects(resource, [subject])) {
      return { matched: true, subject };
    }
  }
  return { matched: false };
};

const matchesUpcomingExam = (resource, upcomingExams) => {
  if (!upcomingExams || upcomingExams.length === 0) return { matched: false };
  for (const exam of upcomingExams) {
    if (resourceMatchesSubjects(resource, [exam])) {
      return { matched: true, exam };
    }
  }
  return { matched: false };
};

const matchesCurrentSubject = (resource, subjects) => {
  if (!subjects || subjects.length === 0) return { matched: false };
  for (const subject of subjects) {
    if (resourceMatchesSubjects(resource, [subject])) {
      return { matched: true, subject };
    }
  }
  return { matched: false };
};

const matchesTopCategory = (resource, topCategories) => {
  if (!topCategories || topCategories.length === 0) return { matched: false };
  const terms = new Set([normalize(resource.category), ...(resource.tags || []).map(normalize)]);
  for (const cat of topCategories) {
    if (terms.has(normalize(cat))) {
      return { matched: true, cat };
    }
  }
  return { matched: false };
};

const isRelevantToUser = (resource, signals) => {
  if (matchesFocusSubject(resource, signals.focusSubject)) return true;
  if (matchesCurrentSubject(resource, signals.subjects).matched) return true;
  if (matchesWeakSubject(resource, signals.weakSubjects).matched) return true;
  if (matchesUpcomingExam(resource, signals.upcomingExams).matched) return true;
  if (matchesTopCategory(resource, signals.topCategories).matched) return true;
  return false;
};

const scoreResource = (resource, signals) => {
  let score = 0;
  let reasons = [];

  // 1. Explicit subject chosen on the Focus page gets highest priority.
  if (matchesFocusSubject(resource, signals.focusSubject)) {
    score += 50;
    reasons.push(`Hand-picked for ${signals.focusSubject}.`);
  }

  // 2. Weak subjects the user is struggling with.
  const weakMatch = matchesWeakSubject(resource, signals.weakSubjects);
  if (weakMatch.matched) {
    score += 40;
    reasons.push(`Strengthen your weak subject: ${weakMatch.subject}.`);
  }

  // 3. Upcoming exams relevant to the user's subjects.
  const examMatch = matchesUpcomingExam(resource, signals.upcomingExams);
  if (examMatch.matched) {
    score += 35;
    reasons.push(`Exam coming up: ${examMatch.exam}.`);
  }

  // 4. Subjects in the user's current semester syllabus.
  const subjectMatch = matchesCurrentSubject(resource, signals.subjects);
  if (subjectMatch.matched) {
    score += 30;
    reasons.push(`Part of your current syllabus: ${subjectMatch.subject}.`);
  }

  // 5. Subjects the user has been studying frequently via Pomodoro.
  const categoryMatch = matchesTopCategory(resource, signals.topCategories);
  if (categoryMatch.matched) {
    score += 15;
    reasons.push(`You have been studying ${categoryMatch.cat} frequently.`);
  }

  score = Math.min(score, 100);

  return {
    ...resource,
    relevanceScore: score,
    reason: reasons[0] || 'Recommended based on your course and subjects.',
  };
};

const buildRecommendations = (signals, limit = 8) => {
  const relevant = resourceDatabase
    .filter((resource) => isRelevantToUser(resource, signals))
    .map((resource) => scoreResource(resource, signals));

  relevant.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const seen = new Set();
  const unique = [];
  for (const rec of relevant) {
    if (!seen.has(rec.url)) {
      seen.add(rec.url);
      unique.push(rec);
    }
    if (unique.length >= limit) break;
  }

  return unique;
};

export { buildRecommendations };

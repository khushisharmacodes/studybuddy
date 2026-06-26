export const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Production & Industrial Engineering (PIE)',
  'Chemical Engineering (CHE)',
  'Mathematics & Computing (M&C)',
  'Master of Computer Applications (MCA)',
  'Bachelor of Architecture (BArch)',
  'M.Tech Computer Engineering',
  'M.Tech Electronics & Communication Engineering',
  'M.Tech Electrical Engineering',
  'M.Tech Mechanical Engineering',
  'M.Tech Civil Engineering',
  'M.Tech Production & Industrial Engineering',
  'M.Tech Chemical Engineering',
  'Master of Business Administration (MBA)',
  'M.Sc. Mathematics',
  'M.Sc. Physics',
  'M.Sc. Chemistry',
  'Physics',
  'Chemistry',
  'Humanities & Management',
];

export const BRANCH_OPTIONS = BRANCHES.map((b) => ({ value: b, label: b }));

export const normalizeBranch = (branch) => {
  if (!branch) return '';
  const lower = branch.toLowerCase();

  if (lower.includes('barch') || lower.includes('architecture')) return 'BARCH';

  if (lower.includes('m.tech') || lower.includes('mtech')) {
    if (lower.includes('computer')) return 'MTechCSE';
    if (lower.includes('electronics') || lower.includes('communication')) return 'MTechECE';
    if (lower.includes('electrical')) return 'MTechEE';
    if (lower.includes('mechanical')) return 'MTechME';
    if (lower.includes('civil')) return 'MTechCE';
    if (lower.includes('production') || lower.includes('industrial')) return 'MTechPIE';
    if (lower.includes('chemical')) return 'MTechCHE';
  }

  if (lower.includes('m.sc') || lower.includes('msc')) {
    if (lower.includes('math')) return 'MScMath';
    if (lower.includes('physics')) return 'MScPhysics';
    if (lower.includes('chem')) return 'MScChemistry';
  }
  if (lower.includes('mba') || lower.includes('business administration')) return 'MBA';

  if (lower.includes('cse') || lower.includes('computer science')) return 'CSE';
  if (lower.includes('it') || lower.includes('information')) return 'IT';
  if (lower.includes('ece') || lower.includes('electronics')) return 'ECE';
  if (lower === 'ee' || lower.includes('electrical engineering') || lower.includes('electrical')) return 'EE';
  if (lower === 'me' || lower.includes('mechanical engineering') || lower.includes('mechanical')) return 'ME';
  if (lower === 'ce' || lower.includes('civil engineering') || lower.includes('civil')) return 'CE';
  if (lower.includes('pie') || lower.includes('production')) return 'PIE';
  if (lower.includes('che') || lower.includes('chemical')) return 'CHE';
  if (lower.includes('m&c') || lower.includes('mathematics')) return 'M&C';
  if (lower.includes('mca') || lower.includes('computer applications')) return 'MCA';
  if (lower.includes('physics')) return 'Physics';
  if (lower.includes('chemistry')) return 'Chemistry';
  if (lower.includes('humanities') || lower.includes('management')) return 'Humanities';
  return branch;
};

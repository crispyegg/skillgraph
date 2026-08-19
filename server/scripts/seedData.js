// Plain JS data. Kept separate from seed.js so the data itself is easy to
// read/extend without touching the insertion logic.

const skills = [
  // Frontend
  { id: 's_react', name: 'React', category: 'Frontend' },
  { id: 's_js', name: 'JavaScript', category: 'Frontend' },
  { id: 's_ts', name: 'TypeScript', category: 'Frontend' },
  { id: 's_redux', name: 'Redux', category: 'Frontend' },
  { id: 's_html', name: 'HTML', category: 'Frontend' },
  { id: 's_css', name: 'CSS', category: 'Frontend' },
  { id: 's_tailwind', name: 'Tailwind CSS', category: 'Frontend' },
  { id: 's_vue', name: 'Vue.js', category: 'Frontend' },
  // Backend
  { id: 's_node', name: 'Node.js', category: 'Backend' },
  { id: 's_express', name: 'Express', category: 'Backend' },
  { id: 's_python', name: 'Python', category: 'Backend' },
  { id: 's_django', name: 'Django', category: 'Backend' },
  { id: 's_java', name: 'Java', category: 'Backend' },
  { id: 's_spring', name: 'Spring Boot', category: 'Backend' },
  { id: 's_graphql', name: 'GraphQL', category: 'Backend' },
  // Data
  { id: 's_mongo', name: 'MongoDB', category: 'Data' },
  { id: 's_postgres', name: 'PostgreSQL', category: 'Data' },
  { id: 's_neo4j', name: 'Neo4j / Cypher', category: 'Data' },
  { id: 's_redis', name: 'Redis', category: 'Data' },
  { id: 's_sql', name: 'SQL', category: 'Data' },
  // DevOps
  { id: 's_docker', name: 'Docker', category: 'DevOps' },
  { id: 's_k8s', name: 'Kubernetes', category: 'DevOps' },
  { id: 's_aws', name: 'AWS', category: 'DevOps' },
  { id: 's_ci', name: 'CI/CD', category: 'DevOps' },
  { id: 's_git', name: 'Git', category: 'DevOps' },
  // Data Science
  { id: 's_ml', name: 'Machine Learning', category: 'Data Science' },
  { id: 's_pandas', name: 'Pandas', category: 'Data Science' },
  { id: 's_tf', name: 'TensorFlow', category: 'Data Science' },
  // Mobile
  { id: 's_reactnative', name: 'React Native', category: 'Mobile' },
  { id: 's_flutter', name: 'Flutter', category: 'Mobile' },
];

// Skill-to-skill relationships with a "strength" property.
// This is what powers the multi-hop RELATED_TO traversal.
const skillRelations = [
  ['s_react', 's_js', 0.9],
  ['s_react', 's_redux', 0.8],
  ['s_react', 's_ts', 0.7],
  ['s_js', 's_ts', 0.8],
  ['s_js', 's_html', 0.6],
  ['s_js', 's_css', 0.6],
  ['s_react', 's_tailwind', 0.5],
  ['s_vue', 's_js', 0.8],
  ['s_vue', 's_ts', 0.5],
  ['s_node', 's_js', 0.9],
  ['s_node', 's_express', 0.9],
  ['s_express', 's_mongo', 0.6],
  ['s_node', 's_ts', 0.6],
  ['s_python', 's_django', 0.8],
  ['s_python', 's_ml', 0.7],
  ['s_python', 's_pandas', 0.8],
  ['s_ml', 's_pandas', 0.7],
  ['s_ml', 's_tf', 0.8],
  ['s_java', 's_spring', 0.9],
  ['s_node', 's_graphql', 0.5],
  ['s_express', 's_graphql', 0.5],
  ['s_mongo', 's_postgres', 0.3],
  ['s_postgres', 's_sql', 0.9],
  ['s_mongo', 's_sql', 0.2],
  ['s_neo4j', 's_sql', 0.3],
  ['s_neo4j', 's_mongo', 0.3],
  ['s_redis', 's_mongo', 0.3],
  ['s_docker', 's_k8s', 0.9],
  ['s_docker', 's_aws', 0.6],
  ['s_k8s', 's_aws', 0.7],
  ['s_ci', 's_docker', 0.6],
  ['s_ci', 's_git', 0.5],
  ['s_aws', 's_node', 0.4],
  ['s_reactnative', 's_react', 0.9],
  ['s_reactnative', 's_js', 0.7],
  ['s_flutter', 's_reactnative', 0.3],
];

const companies = [
  { id: 'co_nimbus', name: 'Nimbus Cloud Systems', industry: 'Cloud Infrastructure' },
  { id: 'co_finwise', name: 'FinWise Technologies', industry: 'FinTech' },
  { id: 'co_healthly', name: 'Healthly Inc.', industry: 'HealthTech' },
  { id: 'co_shopstream', name: 'ShopStream', industry: 'E-commerce' },
  { id: 'co_dataforge', name: 'DataForge Analytics', industry: 'Data & AI' },
  { id: 'co_pixelcraft', name: 'PixelCraft Studios', industry: 'Design & Media' },
  { id: 'co_edulearn', name: 'EduLearn', industry: 'EdTech' },
  { id: 'co_greenroute', name: 'GreenRoute Logistics', industry: 'Logistics' },
];

const jobs = [
  {
    id: 'j_frontend_nimbus', title: 'Frontend Engineer', companyId: 'co_nimbus',
    description: 'Build dashboards for our cloud monitoring product.', minExperience: 1,
    skillRequirements: [
      { skillId: 's_react', mandatory: true, weight: 3 },
      { skillId: 's_ts', mandatory: true, weight: 2 },
      { skillId: 's_tailwind', mandatory: false, weight: 1 },
    ],
  },
  {
    id: 'j_fullstack_finwise', title: 'Full Stack Developer', companyId: 'co_finwise',
    description: 'MERN stack developer for our payments platform.', minExperience: 1,
    skillRequirements: [
      { skillId: 's_react', mandatory: true, weight: 3 },
      { skillId: 's_node', mandatory: true, weight: 3 },
      { skillId: 's_mongo', mandatory: true, weight: 2 },
      { skillId: 's_express', mandatory: false, weight: 1 },
    ],
  },
  {
    id: 'j_backend_healthly', title: 'Backend Engineer', companyId: 'co_healthly',
    description: 'Design APIs for patient record systems.', minExperience: 2,
    skillRequirements: [
      { skillId: 's_node', mandatory: true, weight: 3 },
      { skillId: 's_postgres', mandatory: true, weight: 2 },
      { skillId: 's_docker', mandatory: false, weight: 1 },
    ],
  },
  {
    id: 'j_graph_dataforge', title: 'Graph Database Engineer', companyId: 'co_dataforge',
    description: 'Build recommendation systems on graph data.', minExperience: 2,
    skillRequirements: [
      { skillId: 's_neo4j', mandatory: true, weight: 3 },
      { skillId: 's_python', mandatory: true, weight: 2 },
      { skillId: 's_ml', mandatory: false, weight: 1 },
    ],
  },
  {
    id: 'j_react_shopstream', title: 'React Developer', companyId: 'co_shopstream',
    description: 'Own the checkout flow UI for our storefront.', minExperience: 1,
    skillRequirements: [
      { skillId: 's_react', mandatory: true, weight: 3 },
      { skillId: 's_redux', mandatory: false, weight: 1 },
      { skillId: 's_css', mandatory: true, weight: 1 },
    ],
  },
  {
    id: 'j_devops_greenroute', title: 'DevOps Engineer', companyId: 'co_greenroute',
    description: 'Own our CI/CD pipelines and container infra.', minExperience: 2,
    skillRequirements: [
      { skillId: 's_docker', mandatory: true, weight: 3 },
      { skillId: 's_k8s', mandatory: true, weight: 3 },
      { skillId: 's_aws', mandatory: false, weight: 1 },
    ],
  },
  {
    id: 'j_mobile_pixelcraft', title: 'React Native Developer', companyId: 'co_pixelcraft',
    description: 'Build our cross-platform creative app.', minExperience: 1,
    skillRequirements: [
      { skillId: 's_reactnative', mandatory: true, weight: 3 },
      { skillId: 's_js', mandatory: true, weight: 1 },
    ],
  },
  {
    id: 'j_ml_edulearn', title: 'ML Engineer', companyId: 'co_edulearn',
    description: 'Build adaptive learning recommendation models.', minExperience: 2,
    skillRequirements: [
      { skillId: 's_python', mandatory: true, weight: 3 },
      { skillId: 's_ml', mandatory: true, weight: 3 },
      { skillId: 's_pandas', mandatory: false, weight: 1 },
    ],
  },
];

const projects = [
  { id: 'p_dashboard_revamp', name: 'Dashboard Revamp' },
  { id: 'p_payment_gateway', name: 'Payment Gateway Integration' },
  { id: 'p_patient_portal', name: 'Patient Portal' },
  { id: 'p_recommendation_engine', name: 'Recommendation Engine' },
  { id: 'p_checkout_redesign', name: 'Checkout Redesign' },
  { id: 'p_infra_migration', name: 'Infra Migration to K8s' },
];

// Each candidate: skills = [{skillId, proficiency, yearsUsed}], workHistory,
// projectIds (for the colleague-network query to have real overlaps).
const candidates = [
  {
    id: 'c_asif', name: 'Asif Khan', email: 'asif@example.com', bio: 'Full stack MERN developer.', experienceYears: 1,
    skills: [
      { skillId: 's_react', proficiency: 'advanced', yearsUsed: 1 },
      { skillId: 's_node', proficiency: 'advanced', yearsUsed: 1 },
      { skillId: 's_mongo', proficiency: 'intermediate', yearsUsed: 1 },
      { skillId: 's_express', proficiency: 'intermediate', yearsUsed: 1 },
      { skillId: 's_js', proficiency: 'advanced', yearsUsed: 2 },
    ],
    workHistory: [{ companyId: 'co_finwise', role: 'Full Stack Intern', from: '2025-12', to: '2026-06' }],
    projectIds: ['p_payment_gateway'],
  },
  {
    id: 'c_priya', name: 'Priya Sharma', email: 'priya@example.com', bio: 'Frontend specialist, design-minded.', experienceYears: 2,
    skills: [
      { skillId: 's_react', proficiency: 'expert', yearsUsed: 2 },
      { skillId: 's_ts', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_tailwind', proficiency: 'advanced', yearsUsed: 1 },
      { skillId: 's_css', proficiency: 'expert', yearsUsed: 3 },
    ],
    workHistory: [{ companyId: 'co_nimbus', role: 'Frontend Engineer', from: '2024-01', to: 'present' }],
    projectIds: ['p_dashboard_revamp'],
  },
  {
    id: 'c_rahul', name: 'Rahul Verma', email: 'rahul@example.com', bio: 'Backend engineer, Node & Python.', experienceYears: 3,
    skills: [
      { skillId: 's_node', proficiency: 'expert', yearsUsed: 3 },
      { skillId: 's_postgres', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_docker', proficiency: 'intermediate', yearsUsed: 1 },
      { skillId: 's_express', proficiency: 'expert', yearsUsed: 3 },
    ],
    workHistory: [{ companyId: 'co_healthly', role: 'Backend Engineer', from: '2023-06', to: 'present' }],
    projectIds: ['p_patient_portal'],
  },
  {
    id: 'c_sneha', name: 'Sneha Reddy', email: 'sneha@example.com', bio: 'Data & ML engineer.', experienceYears: 2,
    skills: [
      { skillId: 's_python', proficiency: 'expert', yearsUsed: 3 },
      { skillId: 's_ml', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_pandas', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_neo4j', proficiency: 'intermediate', yearsUsed: 1 },
    ],
    workHistory: [{ companyId: 'co_dataforge', role: 'Data Engineer', from: '2024-03', to: 'present' }],
    projectIds: ['p_recommendation_engine'],
  },
  {
    id: 'c_arjun', name: 'Arjun Mehta', email: 'arjun@example.com', bio: 'DevOps and cloud infra.', experienceYears: 4,
    skills: [
      { skillId: 's_docker', proficiency: 'expert', yearsUsed: 4 },
      { skillId: 's_k8s', proficiency: 'expert', yearsUsed: 3 },
      { skillId: 's_aws', proficiency: 'advanced', yearsUsed: 3 },
      { skillId: 's_ci', proficiency: 'advanced', yearsUsed: 3 },
    ],
    workHistory: [{ companyId: 'co_greenroute', role: 'DevOps Engineer', from: '2022-01', to: 'present' }],
    projectIds: ['p_infra_migration'],
  },
  {
    id: 'c_neha', name: 'Neha Kapoor', email: 'neha@example.com', bio: 'React Native mobile developer.', experienceYears: 2,
    skills: [
      { skillId: 's_reactnative', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_js', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_react', proficiency: 'intermediate', yearsUsed: 1 },
    ],
    workHistory: [{ companyId: 'co_pixelcraft', role: 'Mobile Developer', from: '2024-06', to: 'present' }],
    projectIds: [],
  },
  {
    id: 'c_vikram', name: 'Vikram Singh', email: 'vikram@example.com', bio: 'Full stack, MongoDB heavy.', experienceYears: 1,
    skills: [
      { skillId: 's_js', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_mongo', proficiency: 'advanced', yearsUsed: 1 },
      { skillId: 's_html', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_css', proficiency: 'advanced', yearsUsed: 2 },
    ],
    workHistory: [{ companyId: 'co_finwise', role: 'Junior Developer', from: '2025-08', to: 'present' }],
    // Shares the payment gateway project with Asif -> enables colleague match
    projectIds: ['p_payment_gateway'],
  },
  {
    id: 'c_ananya', name: 'Ananya Iyer', email: 'ananya@example.com', bio: 'Frontend developer, Vue background.', experienceYears: 2,
    skills: [
      { skillId: 's_vue', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_js', proficiency: 'advanced', yearsUsed: 2 },
      { skillId: 's_css', proficiency: 'intermediate', yearsUsed: 2 },
    ],
    workHistory: [{ companyId: 'co_shopstream', role: 'Frontend Developer', from: '2024-02', to: 'present' }],
    projectIds: ['p_checkout_redesign'],
  },
  {
    id: 'c_karan', name: 'Karan Malhotra', email: 'karan@example.com', bio: 'Java backend engineer.', experienceYears: 3,
    skills: [
      { skillId: 's_java', proficiency: 'expert', yearsUsed: 4 },
      { skillId: 's_spring', proficiency: 'advanced', yearsUsed: 3 },
      { skillId: 's_sql', proficiency: 'advanced', yearsUsed: 3 },
    ],
    workHistory: [{ companyId: 'co_healthly', role: 'Backend Engineer', from: '2022-07', to: 'present' }],
    // Shares patient portal project with Rahul -> colleague match candidate
    projectIds: ['p_patient_portal'],
  },
  {
    id: 'c_divya', name: 'Divya Nair', email: 'divya@example.com', bio: 'Junior full stack developer.', experienceYears: 0,
    skills: [
      { skillId: 's_html', proficiency: 'intermediate', yearsUsed: 1 },
      { skillId: 's_css', proficiency: 'intermediate', yearsUsed: 1 },
      { skillId: 's_js', proficiency: 'beginner', yearsUsed: 1 },
    ],
    workHistory: [],
    // Shares dashboard revamp project with Priya -> colleague match candidate for React job
    projectIds: ['p_dashboard_revamp'],
  },
];

module.exports = { skills, skillRelations, companies, jobs, projects, candidates };

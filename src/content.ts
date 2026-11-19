export const siteContent = {
  brand: 'ibtVerse',
  nav: [
    { label: 'About', href: '#about' }, { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' }, { label: 'Projects', href: '#projects' },
    { label: 'Journey', href: '#journey' }, { label: 'Contact', href: '#contact' },
  ],
  hero: {
    name: 'Khobizi Ibtessam', role: 'Veterinarian & Computer Science Student',
    instruction: 'Move cursor to call me!', scroll: 'Scroll to explore',
    messages: { left: 'Anyone here on the left?', right: 'Anyone here on the right?', greeting: ["Hey, it’s you!", 'Hiiii!', 'Check out the portfolio'] },
    placeholder: 'Photo placeholder · replace with character animation frames',
    loading: 'Preparing the portrait',
    statusIdle: 'STANDBY', statusContact: 'CONTACT',
    hud: { system: 'SYS.ONLINE', scan: 'SCAN 01', location: 'CA / DZ', timecode: '00:00:00:00' },
  },
  about: {
    eyebrow: 'ORIGIN', title: ['Science taught me to look closer.', 'Technology lets me ask what’s next.'],
    paragraphs: [
      'I am Khobizi Ibtessam, a Doctor of Veterinary Medicine with an Academic Master’s degree in Veterinary Pathology, and a third-year Computer Science student at Akli Mohand Oulhadj University in Bouira.',
      'Moving between animal health, scientific research, and computing has shaped how I approach problems: with care for evidence, patience with complexity, and curiosity about useful new tools. I am now building practical experience in programming and cybersecurity.',
    ],
    statA: { value: '02', label: 'academic disciplines' }, statB: { value: '14', label: 'cybersecurity modules completed' },
  },
  education: {
    eyebrow: 'EDUCATION', title: ['A foundation in science,', 'expanding into computing.'],
    entries: [
      { period: '2024 — Present', degree: 'Bachelor’s degree in Computer Science · Third year', school: 'Akli Mohand Oulhadj University · Bouira, Algeria', detail: 'Faculty of Exact Sciences · Department of Computer Science. Coursework in French and English.' },
      { period: '2022', degree: 'Academic Master’s degree · Veterinary Pathology', school: 'Institute of Veterinary Sciences · Saad Dahlab University, Blida 1', detail: 'Veterinary Sciences, with a specialization in Pathology.' },
      { period: '2022', degree: 'Doctor of Veterinary Medicine', school: 'Institute of Veterinary Sciences · Saad Dahlab University, Blida 1', detail: 'Professional training in animal health, clinical practice, and veterinary sciences.' },
    ],
  },
  skills: {
    eyebrow: 'SYSTEMS', title: ['Learning by building,', 'observing, and asking.'],
    groups: [
      { number: '01', title: 'Programming', tags: ['Java', 'Python', 'Object-oriented programming', 'Data structures'] },
      { number: '02', title: 'Cybersecurity', tags: ['Technoformat training · 2026', 'TryHackMe', 'Hack The Box', 'Network security', 'Web application security'] },
      { number: '03', title: 'Veterinary sciences', tags: ['Veterinary pathology', 'Scientific research', 'Cell biology', 'Animal biology'] },
    ],
  },
  projects: {
    terminal: { title: 'SECURITY ANALYSIS // LIVE PREVIEW', status: 'SCANNING INPUT STREAM', command: 'analyze(target)', result: 'RISK SIGNALS: REVIEW' },
    eyebrow: 'MISSIONS', title: ['Ideas becoming', 'practical projects.'],
    featured: { name: 'CyberShield AI', category: 'Security awareness · Featured concept', description: 'A security analysis concept that helps people examine URLs, email content, and password strength for common risk signals. The project brings together cybersecurity learning and practical, accessible guidance.', tags: ['Python', 'AI-assisted analysis', 'Cybersecurity'], repo: '', demo: '' },
    others: [
      { name: 'Interactive Portfolio', category: 'Personal website', description: 'A responsive portfolio that brings together my academic story, projects, and learning journey.', tags: ['React', 'TypeScript', 'GSAP'] },
      { name: 'Learning Lab', category: 'In progress', description: 'A growing collection of small programming and security exercises built through guided practice.', tags: ['Java', 'Python', 'Security'] },
    ],
    placeholder: 'Project link placeholder',
  },
  journey: {
    eyebrow: 'FIELD NOTES', title: ['Turning study', 'into steady practice.'],
    entries: [
      { date: '2026', title: 'IT internship · Banking environment', detail: 'Observed computer network architecture, routing and switching, access controls, IT procedures, documentation, and professional confidentiality practices.' },
      { date: '2026', title: 'Cybersecurity training · Technoformat', detail: 'Completed a 14-module qualifying program covering network security, cryptography, ethical hacking, web security, forensics, cloud security, and a final security audit project.' },
      { date: 'Ongoing', title: 'Independent learning · SoloLearn', detail: 'Developing programming fundamentals through Intermediate Java and Python coursework, including object-oriented design, collections, exceptions, and file operations.' },
      { date: 'University', title: 'Teaching practical and tutorial sessions', detail: 'Supported Cell Biology and Animal Biology practical and tutorial sessions at Akli Mohand Oulhadj University.' },
    ],
  },
  goals: {
    eyebrow: 'VISION', title: 'Why Canada?',
    body: 'I hope to continue learning in an environment that values research, interdisciplinary study, and thoughtful use of technology. My interests include cybersecurity, data-informed research, and the ways computing can support scientific and health-focused work. This statement is a starting point that I will refine as my academic goals develop.',
    note: 'Research interests and study plans · personal statement in progress',
  },
  contact: {
    eyebrow: 'CONTACT', title: 'Let’s start a conversation.',
    intro: 'For university applications, research conversations, or professional opportunities, I would be glad to connect.',
    email: 'khobiziibtessam@gmail.com', linkedin: 'https://www.linkedin.com/in/khobizi-ibtessam-482781307', github: '',
    placeholder: 'Profile link placeholder', cv: 'CV available on request',
  },
  labels: {
    navAria: 'Main navigation', homeAria: 'ibtVerse, back to top', menuOpen: 'Open menu', menuClose: 'Close menu',
    themeLight: 'light', themeDark: 'dark', themeLabelLight: 'Light', themeLabelDark: 'Dark', themeSwitch: 'Switch to', systemActive: 'ACTIVE', mailtoName: 'Name', mailtoEmail: 'Email', heroAria: 'Interactive portrait. Move across the left, center, or right area to select a reaction; press Enter to greet.',
    canvasAria: 'Portrait animation placeholder', attribution: 'A portfolio by Khobizi Ibtessam', tapInstruction: 'Tap to say hello',
    caption: ['SCIENCE', 'CURIOSITY'], scroll: 'Scroll to explore', scrollAria: 'Scroll to About',
    backTop: 'Back to top', sections: ['CHAPTER 01', 'CHAPTER 02', 'CHAPTER 03', 'CHAPTER 04', 'CHAPTER 05', 'CHAPTER 06', 'CHAPTER 07'],
    formName: 'Your name', formEmail: 'Email address', formMessage: 'Your message', send: 'Send a message',
    loaderSkip: 'Skip intro', loaderLabel: 'INITIALIZING IBTVERSE', loaderSub: 'A portfolio by Khobizi Ibtessam',
    mailtoReady: 'Your email app should open with the message ready to send.', mailtoHelp: 'The form opens your email application; it does not store messages.', mailtoSubject: 'Portfolio enquiry from',
    linkedIn: 'LinkedIn', github: 'GitHub', liveDemo: 'Live demo', cyberShieldMark: 'CYBERSHIELD\nAI', footerCopyright: '©',
  },
  footer: 'A scientific mind. A curious future.',
  footerCredit: 'END OF TRANSMISSION',
} as const

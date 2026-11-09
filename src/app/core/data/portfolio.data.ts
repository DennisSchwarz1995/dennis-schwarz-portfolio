import { ProjectItem, SkillItem, TestimonialItem } from '../models/portfolio.models';

export const PORTFOLIO_PROJECTS: readonly ProjectItem[] = [
  {
    id: 1,
    indexLabel: '01',
    title: 'Join',
    descriptionKey: 'PROJECT_JOIN',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    previewImage: 'assets/img/join.png',
    githubUrl: 'https://github.com/DennisSchwarz1995/join',
    liveUrl: 'https://join.dennis-schwarz.dev',
    subdomainLabel: 'join.dennis-schwarz.dev',
  },
  {
    id: 2,
    indexLabel: '02',
    title: 'DA Bubble',
    descriptionKey: 'PROJECT_DA_BUBBLE',
    technologies: ['Angular', 'TypeScript', 'Firebase'],
    previewImage: 'assets/img/da_bubble.png',
    githubUrl: 'https://github.com/DennisSchwarz1995/DABubble',
    liveUrl: 'https://dabubble.dennis-schwarz.dev',
    subdomainLabel: 'dabubble.dennis-schwarz.dev',
  },
  {
    id: 3,
    indexLabel: '03',
    title: 'Sharkie',
    descriptionKey: 'PROJECT_SHARKIE',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    previewImage: 'assets/img/sharkie.png',
    githubUrl: 'https://github.com/DennisSchwarz1995/Sharkie',
    liveUrl: 'https://sharkie.dennis-schwarz.dev',
    subdomainLabel: 'sharkie.dennis-schwarz.dev',
  },
];

export const PORTFOLIO_SKILLS: readonly SkillItem[] = [
  { name: 'Angular', icon: 'assets/img/angular.png', category: 'core' },
  { name: 'TypeScript', icon: 'assets/img/typescript.png', category: 'core' },
  { name: 'JavaScript', icon: 'assets/img/javascript.png', category: 'core' },
  { name: 'HTML5', icon: 'assets/img/html.png', category: 'core' },
  { name: 'SCSS / CSS3', icon: 'assets/img/css.png', category: 'core' },
  { name: 'Firebase', icon: 'assets/img/firebase.png', category: 'core' },
  { name: 'REST API', icon: 'assets/img/rest_api.png', category: 'core' },
  { name: 'Material Design', icon: 'assets/img/material_design.png', category: 'core' },
  { name: 'Git', icon: 'assets/img/git.png', category: 'core' },
  { name: 'Scrum', icon: 'assets/img/scrum.png', category: 'core' },
  { name: 'Growth Mindset', icon: 'assets/img/growth_mindset.png', category: 'core' },
  { name: 'React', icon: 'assets/img/react.png', category: 'exploring' },
  { name: 'Vue.js', icon: 'assets/img/vue_js.png', category: 'exploring' },
];

export const PORTFOLIO_TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: 1,
    quoteKey: 'COLLEAGUE_H_JANISCH',
    author: 'H. Janisch',
    roleKey: 'TEAM_PARTNER',
  },
  {
    id: 2,
    quoteKey: 'COLLEAGUE_T_SCHULZ',
    author: 'T. Schulz',
    roleKey: 'FRONTEND_DEVELOPER',
  },
  {
    id: 3,
    quoteKey: 'COLLEAGUE_P_BRAUN',
    author: 'P. Braun',
    roleKey: 'BACKEND_DEVELOPER',
  },
];


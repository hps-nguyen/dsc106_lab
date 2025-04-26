import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h3');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle && (projectsTitle.textContent = 
  projects.length === 0 ? 'No Projects' :
  projects.length === 1 ? '1 Project' :
  `${projects.length} Projects`
);

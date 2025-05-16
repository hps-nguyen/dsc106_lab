import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h3');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle && (projectsTitle.textContent =
  projects.length === 0 ? 'No Projects' :
    projects.length === 1 ? '1 Project' :
      `${projects.length} Projects`
);



function renderPieChart(projectsGiven) {
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  // Retrieving data for the pie chart
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let data = rolledData
    .sort(([yearA], [yearB]) => yearB - yearA) // Descending order
    .map(([year, count]) => {
      return { value: count, label: year };
    });

  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  // Clear previous paths and legend
  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  let selectedIndex = -1;
  arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        svg
          .selectAll('path')
          .attr('class', (_, i) => (
            i === selectedIndex ? 'selected-path' : ''
          ))
          .attr('d', (_, i) => {
            return i === selectedIndex
              ? d3.arc().innerRadius(0).outerRadius(55)(arcData[i])
              : d3.arc().innerRadius(0).outerRadius(50)(arcData[i]);
          });
        legend
          .selectAll('li')
          .attr('class', (_, i) => (
            i === selectedIndex ? 'selected-path' : ''
          ));

        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h3');
        }
        else {
          let selectedYear = data[selectedIndex].label;
          let filteredProjects = projectsGiven.filter((project) => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h3');
        }
      })
  });


  data.forEach((d, idx) => {
    legend
      .append('li')
      .html(
        `
          <span class="swatch" style="background-color: ${colors(idx)};"></span>
          ${d.label} <em>(${d.value})</em>
        `
      );
  });
}

renderPieChart(projects);



let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  // Clear previous paths and legend (bug fix)
  renderPieChart(projects);

  // Update query value
  query = event.target.value;
  // Filter the projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  if (filteredProjects.length !== 0) {
    renderPieChart(filteredProjects);
  }
  renderProjects(filteredProjects, projectsContainer, 'h3');
});




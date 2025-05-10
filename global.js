console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}



let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'meta/', title: 'Meta' },
    { url: 'dsc106/', title: 'DSC 106'},
    { url: 'https://github.com/hps-nguyen', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === 'localhost' || location.hostname === "127.0.0.1")
    ? '/'                                         // Local server
    : 'https://hps-nguyen.github.io/dsc106_lab/'; // GitHub Pages

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith('http') ? BASE_PATH + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host !== location.host) {
        a.target = '_blank';
    }
    nav.append(a);
}



let head = document.querySelector('head');
head.insertAdjacentHTML(
    'beforeend',
    `
        <link rel="apple-touch-icon" sizes="180x180" href="${BASE_PATH}images/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="${BASE_PATH}images/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="${BASE_PATH}images/favicon/favicon-16x16.png">
    `
);


document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic (${matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light"})</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
      </label>`,
);

let select = document.querySelector('select');
function updateDefinedColors(themeValue) {
    if (themeValue === 'light dark') {
        const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', themeValue);
    }
}



select.addEventListener('input', function (event) {
    const value = event.target.value;
    console.log('color scheme changed to', value);
    document.documentElement.style.setProperty('color-scheme', value);
    localStorage.colorScheme = value;

    updateDefinedColors(value);
});

document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.colorScheme) {
        document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
        select.value = localStorage.colorScheme;
        updateDefinedColors(localStorage.colorScheme);
    }
    else {
        defaultTheme = 'light';
        document.documentElement.style.setProperty('color-scheme', defaultTheme);
        select.value = defaultTheme;
        localStorage.colorScheme = defaultTheme;
        updateDefinedColors(defaultTheme);
    }
});



let contactForm = document.querySelector('form');
contactForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    let data = new FormData(contactForm);
    let url = contactForm.action + '?';
    for (let [name, value] of data) {
        url += `${name}=${encodeURIComponent(value)}&`;
    }
    location.href = url;
});



export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    for (let project of projects) {
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src=${project.image} alt="${project.title}" />
            <p>${project.description}</p>
            <time>${project.year}</time>
        `;
        containerElement?.appendChild(article);
    }
}

export async function fetchGithubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

import { escapeHtml, labels, lines, safePhoto, safeUrl } from "./data.js";


const joinText = (values) => values.filter(Boolean).map(escapeHtml).join(" · ");
const range = (start, end) => [start, end].filter(Boolean).map(escapeHtml).join(" — ");

function contactList(resume, copy) {
  const website = safeUrl(resume.basics.website);
  const linkedin = safeUrl(resume.basics.linkedin);
  const items = [
    resume.basics.email && `<li><span>${copy.email}</span><a href="mailto:${encodeURIComponent(resume.basics.email)}">${escapeHtml(resume.basics.email)}</a></li>`,
    resume.basics.phone && `<li><span>${copy.phone}</span><a href="tel:${encodeURIComponent(resume.basics.phone)}">${escapeHtml(resume.basics.phone)}</a></li>`,
    resume.basics.location && `<li><span>${copy.location}</span><b>${escapeHtml(resume.basics.location)}</b></li>`,
    website && `<li><span>${copy.website}</span><a href="${escapeHtml(website)}">${escapeHtml(resume.basics.website)}</a></li>`,
    linkedin && `<li><span>LinkedIn</span><a href="${escapeHtml(linkedin)}">${escapeHtml(resume.basics.linkedin)}</a></li>`,
  ].filter(Boolean).join("");
  return `<section class="resume-block contact-block"><h2>${copy.contact}</h2><ul>${items}</ul></section>`;
}

function skillsBlock(resume, copy) {
  const skills = resume.skills.filter((item) => item.name);
  if (!skills.length) return "";
  return `<section class="resume-block"><h2>${copy.skills}</h2><div class="skill-list">${skills.map((item) => `<span>${escapeHtml(item.name)}</span>`).join("")}</div></section>`;
}

function languagesBlock(resume, copy) {
  const languages = resume.languages.filter((item) => item.name);
  if (!languages.length) return "";
  return `<section class="resume-block"><h2>${copy.languages}</h2><ul class="language-list">${languages.map((item) => `<li><b>${escapeHtml(item.name)}</b><span>${escapeHtml(item.level)}</span></li>`).join("")}</ul></section>`;
}

function experienceBlock(resume, copy) {
  if (!resume.experience.length) return "";
  const entries = resume.experience.map((item) => `
    <div class="resume-entry">
      <div class="resume-entry-head">
        <div><h3>${escapeHtml(item.role || copy.jobPlaceholder)}</h3><p>${joinText([item.company, item.location])}</p></div>
        <time>${range(item.start, item.current ? copy.current : item.end)}</time>
      </div>
      ${item.description ? `<ul>${lines(item.description).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` : ""}
    </div>`).join("");
  return `<section class="resume-block"><h2>${copy.experience}</h2>${entries}</section>`;
}

function educationBlock(resume, copy) {
  if (!resume.education.length) return "";
  const entries = resume.education.map((item) => `
    <div class="resume-entry">
      <div class="resume-entry-head">
        <div><h3>${escapeHtml(item.degree || copy.degreePlaceholder)}</h3><p>${joinText([item.school, item.location])}</p></div>
        <time>${range(item.start, item.end)}</time>
      </div>
      ${item.description ? `<p class="entry-description">${escapeHtml(item.description)}</p>` : ""}
    </div>`).join("");
  return `<section class="resume-block"><h2>${copy.education}</h2>${entries}</section>`;
}

function projectsBlock(resume, copy) {
  if (!resume.projects.length) return "";
  const entries = resume.projects.map((item) => {
    const url = safeUrl(item.link);
    return `
      <div class="resume-entry project-entry">
        <div class="resume-entry-head"><div><h3>${escapeHtml(item.name || copy.projectPlaceholder)}</h3>${url ? `<a href="${escapeHtml(url)}">${escapeHtml(item.link)}</a>` : ""}</div></div>
        ${item.description ? `<p class="entry-description">${escapeHtml(item.description)}</p>` : ""}
      </div>`;
  }).join("");
  return `<section class="resume-block"><h2>${copy.projects}</h2>${entries}</section>`;
}

export function renderPreview(article, resume) {
  const language = resume.settings.language;
  const copy = labels[language];
  const photo = safePhoto(resume.basics.photo);
  const accent = /^#[0-9a-f]{6}$/i.test(resume.settings.accent) ? resume.settings.accent : "#176b5b";

  article.className = `resume-sheet template-${resume.settings.template} font-${resume.settings.font} density-${resume.settings.density}`;
  article.dir = resume.settings.direction;
  article.lang = language;
  article.style.setProperty("--accent", accent);
  article.innerHTML = `
    <header class="resume-header">
      ${photo ? `<img class="resume-photo" src="${photo}" alt="">` : ""}
      <div class="resume-identity"><h1>${escapeHtml(resume.basics.name || copy.namePlaceholder)}</h1><p>${escapeHtml(resume.basics.role || copy.rolePlaceholder)}</p></div>
    </header>
    <div class="resume-layout">
      <aside class="resume-sidebar">
        ${contactList(resume, copy)}
        ${skillsBlock(resume, copy)}
        ${languagesBlock(resume, copy)}
      </aside>
      <div class="resume-main">
        ${resume.basics.summary ? `<section class="resume-block summary-block"><h2>${copy.profile}</h2><p>${escapeHtml(resume.basics.summary)}</p></section>` : ""}
        ${experienceBlock(resume, copy)}
        ${educationBlock(resume, copy)}
        ${projectsBlock(resume, copy)}
      </div>
    </div>
    <footer class="resume-footer">${copy.footer}</footer>`;
}

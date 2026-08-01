/* eslint-disable @next/next/no-img-element -- user-selected data URLs cannot use the image optimizer */

import { CSSProperties } from "react";
import { lines, ResumeData, resumeLabels, safeUrl } from "./model";

export function ResumePreview({ resume }: { resume: ResumeData }) {
  const language = resume.settings.language ?? "fa";
  const labels = resumeLabels[language];
  const websiteUrl = safeUrl(resume.basics.website);
  const linkedinUrl = safeUrl(resume.basics.linkedin);

  return (
    <section className="preview-panel" aria-label="پیش‌نمایش رزومه">
      <div className="preview-toolbar">
        <span><i />پیش‌نمایش زنده</span>
        <small>A4</small>
      </div>
      <div className="paper-stage">
        <article
          data-testid="resume-sheet"
          className={`resume-sheet template-${resume.settings.template} font-${resume.settings.font} density-${resume.settings.density}`}
          dir={resume.settings.direction}
          lang={language}
          style={{ "--accent": resume.settings.accent } as CSSProperties}
        >
          <header className="resume-header">
            {resume.basics.photo ? <img className="resume-photo" src={resume.basics.photo} alt="" /> : null}
            <div className="resume-identity">
              <h1>{resume.basics.name || labels.namePlaceholder}</h1>
              <p>{resume.basics.role || labels.rolePlaceholder}</p>
            </div>
          </header>

          <div className="resume-layout">
            <aside className="resume-sidebar">
              <section className="resume-block contact-block">
                <h2>{labels.contact}</h2>
                <ul>
                  {resume.basics.email ? <li><span>{labels.email}</span><a href={`mailto:${resume.basics.email}`}>{resume.basics.email}</a></li> : null}
                  {resume.basics.phone ? <li><span>{labels.phone}</span><a href={`tel:${resume.basics.phone}`}>{resume.basics.phone}</a></li> : null}
                  {resume.basics.location ? <li><span>{labels.location}</span><b>{resume.basics.location}</b></li> : null}
                  {websiteUrl ? <li><span>{labels.website}</span><a href={websiteUrl}>{resume.basics.website}</a></li> : null}
                  {linkedinUrl ? <li><span>LinkedIn</span><a href={linkedinUrl}>{resume.basics.linkedin}</a></li> : null}
                </ul>
              </section>

              {resume.skills.some((item) => item.name) ? (
                <section className="resume-block">
                  <h2>{labels.skills}</h2>
                  <div className="skill-list">
                    {resume.skills.filter((item) => item.name).map((item) => <span key={item.id}>{item.name}</span>)}
                  </div>
                </section>
              ) : null}

              {resume.languages.some((item) => item.name) ? (
                <section className="resume-block">
                  <h2>{labels.languages}</h2>
                  <ul className="language-list">
                    {resume.languages.filter((item) => item.name).map((item) => (
                      <li key={item.id}><b>{item.name}</b><span>{item.level}</span></li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </aside>

            <div className="resume-main">
              {resume.basics.summary ? (
                <section className="resume-block summary-block"><h2>{labels.profile}</h2><p>{resume.basics.summary}</p></section>
              ) : null}

              {resume.experience.length ? (
                <section className="resume-block">
                  <h2>{labels.experience}</h2>
                  {resume.experience.map((item) => (
                    <div className="resume-entry" key={item.id}>
                      <div className="resume-entry-head">
                        <div><h3>{item.role || labels.jobPlaceholder}</h3><p>{[item.company, item.location].filter(Boolean).join(" · ")}</p></div>
                        <time>{[item.start, item.current ? labels.current : item.end].filter(Boolean).join(" — ")}</time>
                      </div>
                      {item.description ? <ul>{lines(item.description).map((line, index) => <li key={index}>{line}</li>)}</ul> : null}
                    </div>
                  ))}
                </section>
              ) : null}

              {resume.education.length ? (
                <section className="resume-block">
                  <h2>{labels.education}</h2>
                  {resume.education.map((item) => (
                    <div className="resume-entry" key={item.id}>
                      <div className="resume-entry-head">
                        <div><h3>{item.degree || labels.degreePlaceholder}</h3><p>{[item.school, item.location].filter(Boolean).join(" · ")}</p></div>
                        <time>{[item.start, item.end].filter(Boolean).join(" — ")}</time>
                      </div>
                      {item.description ? <p className="entry-description">{item.description}</p> : null}
                    </div>
                  ))}
                </section>
              ) : null}

              {resume.projects.length ? (
                <section className="resume-block">
                  <h2>{labels.projects}</h2>
                  {resume.projects.map((item) => (
                    <div className="resume-entry project-entry" key={item.id}>
                      <div className="resume-entry-head">
                        <div><h3>{item.name || labels.projectPlaceholder}</h3>{safeUrl(item.link) ? <a href={safeUrl(item.link)}>{item.link}</a> : null}</div>
                      </div>
                      {item.description ? <p className="entry-description">{item.description}</p> : null}
                    </div>
                  ))}
                </section>
              ) : null}
            </div>
          </div>
          <footer className="resume-footer">{labels.footer}</footer>
        </article>
      </div>
    </section>
  );
}

import { escapeHtml, safePhoto } from "./data.js";


export const tabs = [
  ["profile", "مشخصات"],
  ["experience", "تجربه"],
  ["education", "تحصیلات"],
  ["projects", "پروژه‌ها"],
  ["skills", "مهارت‌ها"],
  ["design", "ظاهر"],
];

const field = (label, value, attributes, type = "text") => `
  <label class="field">
    <span>${escapeHtml(label)}</span>
    <input type="${type}" ${attributes} value="${escapeHtml(value)}">
  </label>`;

const textarea = (label, value, attributes, hint = "") => `
  <label class="field field-wide">
    <span>${escapeHtml(label)}</span>
    <textarea rows="4" ${attributes}>${escapeHtml(value)}</textarea>
    ${hint ? `<small>${escapeHtml(hint)}</small>` : ""}
  </label>`;

const basicField = (label, key, value, type) =>
  field(label, value, `data-path="basics.${key}"`, type);

const listAttributes = (list, item, key) =>
  `data-list="${list}" data-id="${escapeHtml(item.id)}" data-field="${key}"`;

const listField = (label, list, item, key) =>
  field(label, item[key], listAttributes(list, item, key));

const listTextarea = (label, list, item, key, hint) =>
  textarea(label, item[key], listAttributes(list, item, key), hint);

const removeButton = (list, item, label = "حذف") => `
  <button class="text-button danger" type="button" data-action="remove" data-list="${list}" data-id="${escapeHtml(item.id)}">${label}</button>`;

function profileSection(resume) {
  const photo = safePhoto(resume.basics.photo);
  return `
    <section class="editor-section">
      <h2>مشخصات فردی</h2>
      <div class="photo-control">
        <div class="photo-placeholder">${photo ? `<img src="${photo}" alt="تصویر انتخاب‌شده">` : "<span>عکس</span>"}</div>
        <div>
          <label class="button button-soft photo-button">انتخاب تصویر<input id="photo-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label>
          ${photo ? '<button class="text-button danger" type="button" data-action="remove-photo">حذف تصویر</button>' : ""}
          <small>اختیاری، حداکثر ۲ مگابایت</small>
        </div>
      </div>
      <div class="field-grid">
        ${basicField("نام و نام خانوادگی", "name", resume.basics.name)}
        ${basicField("عنوان حرفه‌ای", "role", resume.basics.role)}
        ${basicField("ایمیل", "email", resume.basics.email, "email")}
        ${basicField("شماره تماس", "phone", resume.basics.phone)}
        ${basicField("موقعیت", "location", resume.basics.location)}
        ${basicField("وب‌سایت", "website", resume.basics.website)}
        ${basicField("LinkedIn", "linkedin", resume.basics.linkedin)}
        ${textarea("درباره من", resume.basics.summary, 'data-path="basics.summary"')}
      </div>
    </section>`;
}

function experienceSection(resume) {
  const cards = resume.experience.map((item, index) => `
    <div class="entry-card">
      <div class="entry-title"><strong>تجربه ${index + 1}</strong>${removeButton("experience", item)}</div>
      <div class="field-grid">
        ${listField("سمت", "experience", item, "role")}
        ${listField("شرکت", "experience", item, "company")}
        ${listField("موقعیت", "experience", item, "location")}
        ${listField("شروع", "experience", item, "start")}
        ${listField("پایان", "experience", item, "end")}
        <label class="check-field"><input type="checkbox" ${listAttributes("experience", item, "current")} ${item.current ? "checked" : ""}>تاکنون مشغول هستم</label>
        ${listTextarea("دستاوردها", "experience", item, "description", "هر دستاورد را در یک خط بنویسید.")}
      </div>
    </div>`).join("");

  return `
    <section class="editor-section">
      <h2>سوابق کاری</h2>
      <div class="card-list">${cards}</div>
      <button class="button button-soft add-button" type="button" data-action="add" data-list="experience">+ افزودن تجربه</button>
    </section>`;
}

function educationSection(resume) {
  const cards = resume.education.map((item, index) => `
    <div class="entry-card">
      <div class="entry-title"><strong>تحصیلات ${index + 1}</strong>${removeButton("education", item)}</div>
      <div class="field-grid">
        ${listField("مدرک / رشته", "education", item, "degree")}
        ${listField("دانشگاه / مؤسسه", "education", item, "school")}
        ${listField("موقعیت", "education", item, "location")}
        ${listField("شروع", "education", item, "start")}
        ${listField("پایان", "education", item, "end")}
        ${listTextarea("توضیحات", "education", item, "description")}
      </div>
    </div>`).join("");

  return `
    <section class="editor-section">
      <h2>تحصیلات</h2>
      <div class="card-list">${cards}</div>
      <button class="button button-soft add-button" type="button" data-action="add" data-list="education">+ افزودن تحصیلات</button>
    </section>`;
}

function projectsSection(resume) {
  const cards = resume.projects.map((item, index) => `
    <div class="entry-card">
      <div class="entry-title"><strong>پروژه ${index + 1}</strong>${removeButton("projects", item)}</div>
      <div class="field-grid">
        ${listField("نام پروژه", "projects", item, "name")}
        ${listField("لینک", "projects", item, "link")}
        ${listTextarea("توضیحات", "projects", item, "description")}
      </div>
    </div>`).join("");

  return `
    <section class="editor-section">
      <h2>پروژه‌ها</h2>
      <div class="card-list">${cards}</div>
      <button class="button button-soft add-button" type="button" data-action="add" data-list="projects">+ افزودن پروژه</button>
    </section>`;
}

function skillsSection(resume) {
  const skills = resume.skills.map((item) => `
    <div class="simple-row">
      ${listField("مهارت", "skills", item, "name")}
      <button class="remove-button" aria-label="حذف مهارت" type="button" data-action="remove" data-list="skills" data-id="${escapeHtml(item.id)}">×</button>
    </div>`).join("");
  const languages = resume.languages.map((item) => `
    <div class="simple-row language-row">
      ${listField("زبان", "languages", item, "name")}
      ${listField("سطح", "languages", item, "level")}
      <button class="remove-button" aria-label="حذف زبان" type="button" data-action="remove" data-list="languages" data-id="${escapeHtml(item.id)}">×</button>
    </div>`).join("");

  return `
    <section class="editor-section">
      <h2>مهارت‌ها و زبان‌ها</h2>
      <h3 class="subheading">مهارت‌ها</h3>
      <div class="simple-list">${skills}</div>
      <button class="button button-soft add-button" type="button" data-action="add" data-list="skills">+ افزودن مهارت</button>
      <h3 class="subheading spaced">زبان‌ها</h3>
      <div class="simple-list">${languages}</div>
      <button class="button button-soft add-button" type="button" data-action="add" data-list="languages">+ افزودن زبان</button>
    </section>`;
}

function selectField(label, setting, value, options, testId = "") {
  return `
    <label class="field">
      <span>${label}</span>
      <select data-setting="${setting}" ${testId ? `data-testid="${testId}"` : ""}>
        ${options.map(([optionValue, optionLabel]) => `<option value="${optionValue}" ${value === optionValue ? "selected" : ""}>${optionLabel}</option>`).join("")}
      </select>
    </label>`;
}

function designSection(resume) {
  const colors = ["#176b5b", "#2457a7", "#7a3e65", "#9a4d20", "#2f3b52"];
  return `
    <section class="editor-section">
      <h2>ظاهر رزومه</h2>
      <div class="design-group">
        <span class="design-label">قالب</span>
        <div class="option-grid">
          <button data-testid="template-modern" type="button" class="template-option ${resume.settings.template === "modern" ? "active" : ""}" data-action="setting" data-setting="template" data-value="modern"><span class="template-thumb modern-thumb"><i></i><b></b></span>مدرن</button>
          <button data-testid="template-classic" type="button" class="template-option ${resume.settings.template === "classic" ? "active" : ""}" data-action="setting" data-setting="template" data-value="classic"><span class="template-thumb classic-thumb"><i></i><b></b></span>کلاسیک</button>
        </div>
      </div>
      <div class="design-group">
        <label class="design-label" for="accent-color">رنگ اصلی</label>
        <div class="color-options">
          ${colors.map((color) => `<button type="button" aria-label="انتخاب رنگ ${color}" class="${resume.settings.accent === color ? "active" : ""}" style="background:${color}" data-action="setting" data-setting="accent" data-value="${color}"></button>`).join("")}
          <input id="accent-color" aria-label="رنگ دلخواه" type="color" value="${escapeHtml(resume.settings.accent)}" data-setting="accent">
        </div>
      </div>
      <div class="field-grid design-fields">
        ${selectField("زبان عنوان‌های رزومه", "language", resume.settings.language, [["fa", "فارسی"], ["en", "English"]], "resume-language")}
        ${selectField("جهت متن", "direction", resume.settings.direction, [["rtl", "راست‌به‌چپ"], ["ltr", "چپ‌به‌راست"]])}
        ${selectField("فونت", "font", resume.settings.font, [["sans", "ساده"], ["serif", "رسمی"], ["mono", "فنی"]])}
        ${selectField("فاصله‌گذاری", "density", resume.settings.density, [["comfortable", "راحت"], ["compact", "فشرده"]])}
      </div>
      <div class="privacy-note"><strong>اطلاعات شما خصوصی می‌ماند.</strong><span>همه داده‌ها فقط روی همین مرورگر ذخیره می‌شوند و به سرور Django ارسال نمی‌شوند.</span></div>
      <button class="text-button danger reset-button" type="button" data-action="reset">بازگردانی نمونه اولیه</button>
    </section>`;
}

const sections = {
  profile: profileSection,
  experience: experienceSection,
  education: educationSection,
  projects: projectsSection,
  skills: skillsSection,
  design: designSection,
};

export function renderTabs(container, activeTab) {
  container.innerHTML = tabs.map(([id, label]) => `
    <button type="button" class="${activeTab === id ? "active" : ""}" data-tab="${id}">${label}</button>`).join("");
}

export function renderEditor(container, resume, activeTab) {
  container.innerHTML = sections[activeTab](resume);
}

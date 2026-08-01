/* eslint-disable @next/next/no-img-element -- user-selected data URLs cannot use the image optimizer */

import { ChangeEvent, ReactNode } from "react";
import {
  Basics,
  Density,
  Direction,
  Font,
  ListKey,
  ResumeData,
  ResumeLanguage,
  Tab,
} from "./model";

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "مشخصات" },
  { id: "experience", label: "تجربه" },
  { id: "education", label: "تحصیلات" },
  { id: "projects", label: "پروژه‌ها" },
  { id: "skills", label: "مهارت‌ها" },
  { id: "design", label: "ظاهر" },
];

type Props = {
  resume: ResumeData;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  updateBasics: (field: keyof Basics, value: string) => void;
  updateList: (key: ListKey, itemId: string, field: string, value: string | boolean) => void;
  addItem: (key: ListKey) => void;
  removeItem: (key: ListKey, itemId: string) => void;
  updateSetting: <K extends keyof ResumeData["settings"]>(
    key: K,
    value: ResumeData["settings"][K],
  ) => void;
  handlePhoto: (event: ChangeEvent<HTMLInputElement>) => void;
  resetResume: () => void;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="field field-wide">
      <span>{label}</span>
      <textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function EditorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="editor-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function EditorPanel({
  resume,
  activeTab,
  setActiveTab,
  updateBasics,
  updateList,
  addItem,
  removeItem,
  updateSetting,
  handlePhoto,
  resetResume,
}: Props) {
  const sections: Record<Tab, ReactNode> = {
    profile: (
      <EditorSection title="مشخصات فردی">
        <div className="photo-control">
          <div className="photo-placeholder">
            {resume.basics.photo ? <img src={resume.basics.photo} alt="تصویر انتخاب‌شده" /> : <span>عکس</span>}
          </div>
          <div>
            <label className="button button-soft photo-button">
              انتخاب تصویر
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </label>
            {resume.basics.photo ? (
              <button className="text-button danger" type="button" onClick={() => updateBasics("photo", "")}>
                حذف تصویر
              </button>
            ) : null}
            <small>اختیاری، حداکثر ۲ مگابایت</small>
          </div>
        </div>
        <div className="field-grid">
          <Field label="نام و نام خانوادگی" value={resume.basics.name} onChange={(v) => updateBasics("name", v)} />
          <Field label="عنوان حرفه‌ای" value={resume.basics.role} onChange={(v) => updateBasics("role", v)} />
          <Field label="ایمیل" type="email" value={resume.basics.email} onChange={(v) => updateBasics("email", v)} />
          <Field label="شماره تماس" value={resume.basics.phone} onChange={(v) => updateBasics("phone", v)} />
          <Field label="موقعیت" value={resume.basics.location} onChange={(v) => updateBasics("location", v)} />
          <Field label="وب‌سایت" value={resume.basics.website} onChange={(v) => updateBasics("website", v)} />
          <Field label="LinkedIn" value={resume.basics.linkedin} onChange={(v) => updateBasics("linkedin", v)} />
          <TextArea label="درباره من" value={resume.basics.summary} onChange={(v) => updateBasics("summary", v)} />
        </div>
      </EditorSection>
    ),
    experience: (
      <EditorSection title="سوابق کاری">
        <div className="card-list">
          {resume.experience.map((item, index) => (
            <div className="entry-card" key={item.id}>
              <div className="entry-title">
                <strong>تجربه {index + 1}</strong>
                <button className="text-button danger" type="button" onClick={() => removeItem("experience", item.id)}>حذف</button>
              </div>
              <div className="field-grid">
                <Field label="سمت" value={item.role} onChange={(v) => updateList("experience", item.id, "role", v)} />
                <Field label="شرکت" value={item.company} onChange={(v) => updateList("experience", item.id, "company", v)} />
                <Field label="موقعیت" value={item.location} onChange={(v) => updateList("experience", item.id, "location", v)} />
                <Field label="شروع" value={item.start} onChange={(v) => updateList("experience", item.id, "start", v)} />
                <Field label="پایان" value={item.end} onChange={(v) => updateList("experience", item.id, "end", v)} />
                <label className="check-field">
                  <input type="checkbox" checked={item.current} onChange={(event) => updateList("experience", item.id, "current", event.target.checked)} />
                  تاکنون مشغول هستم
                </label>
                <TextArea label="دستاوردها" value={item.description} onChange={(v) => updateList("experience", item.id, "description", v)} hint="هر دستاورد را در یک خط بنویسید." />
              </div>
            </div>
          ))}
        </div>
        <button className="button button-soft add-button" type="button" onClick={() => addItem("experience")}>+ افزودن تجربه</button>
      </EditorSection>
    ),
    education: (
      <EditorSection title="تحصیلات">
        <div className="card-list">
          {resume.education.map((item, index) => (
            <div className="entry-card" key={item.id}>
              <div className="entry-title">
                <strong>تحصیلات {index + 1}</strong>
                <button className="text-button danger" type="button" onClick={() => removeItem("education", item.id)}>حذف</button>
              </div>
              <div className="field-grid">
                <Field label="مدرک / رشته" value={item.degree} onChange={(v) => updateList("education", item.id, "degree", v)} />
                <Field label="دانشگاه / مؤسسه" value={item.school} onChange={(v) => updateList("education", item.id, "school", v)} />
                <Field label="موقعیت" value={item.location} onChange={(v) => updateList("education", item.id, "location", v)} />
                <Field label="شروع" value={item.start} onChange={(v) => updateList("education", item.id, "start", v)} />
                <Field label="پایان" value={item.end} onChange={(v) => updateList("education", item.id, "end", v)} />
                <TextArea label="توضیحات" value={item.description} onChange={(v) => updateList("education", item.id, "description", v)} />
              </div>
            </div>
          ))}
        </div>
        <button className="button button-soft add-button" type="button" onClick={() => addItem("education")}>+ افزودن تحصیلات</button>
      </EditorSection>
    ),
    projects: (
      <EditorSection title="پروژه‌ها">
        <div className="card-list">
          {resume.projects.map((item, index) => (
            <div className="entry-card" key={item.id}>
              <div className="entry-title">
                <strong>پروژه {index + 1}</strong>
                <button className="text-button danger" type="button" onClick={() => removeItem("projects", item.id)}>حذف</button>
              </div>
              <div className="field-grid">
                <Field label="نام پروژه" value={item.name} onChange={(v) => updateList("projects", item.id, "name", v)} />
                <Field label="لینک" value={item.link} onChange={(v) => updateList("projects", item.id, "link", v)} />
                <TextArea label="توضیحات" value={item.description} onChange={(v) => updateList("projects", item.id, "description", v)} />
              </div>
            </div>
          ))}
        </div>
        <button className="button button-soft add-button" type="button" onClick={() => addItem("projects")}>+ افزودن پروژه</button>
      </EditorSection>
    ),
    skills: (
      <EditorSection title="مهارت‌ها و زبان‌ها">
        <h3 className="subheading">مهارت‌ها</h3>
        <div className="simple-list">
          {resume.skills.map((item) => (
            <div className="simple-row" key={item.id}>
              <Field label="مهارت" value={item.name} onChange={(v) => updateList("skills", item.id, "name", v)} />
              <button className="remove-button" aria-label="حذف مهارت" type="button" onClick={() => removeItem("skills", item.id)}>×</button>
            </div>
          ))}
        </div>
        <button className="button button-soft add-button" type="button" onClick={() => addItem("skills")}>+ افزودن مهارت</button>

        <h3 className="subheading spaced">زبان‌ها</h3>
        <div className="simple-list">
          {resume.languages.map((item) => (
            <div className="simple-row language-row" key={item.id}>
              <Field label="زبان" value={item.name} onChange={(v) => updateList("languages", item.id, "name", v)} />
              <Field label="سطح" value={item.level} onChange={(v) => updateList("languages", item.id, "level", v)} />
              <button className="remove-button" aria-label="حذف زبان" type="button" onClick={() => removeItem("languages", item.id)}>×</button>
            </div>
          ))}
        </div>
        <button className="button button-soft add-button" type="button" onClick={() => addItem("languages")}>+ افزودن زبان</button>
      </EditorSection>
    ),
    design: (
      <EditorSection title="ظاهر رزومه">
        <div className="design-group">
          <span className="design-label">قالب</span>
          <div className="option-grid">
            <button data-testid="template-modern" type="button" className={`template-option ${resume.settings.template === "modern" ? "active" : ""}`} onClick={() => updateSetting("template", "modern")}>
              <span className="template-thumb modern-thumb"><i /><b /></span>
              مدرن
            </button>
            <button data-testid="template-classic" type="button" className={`template-option ${resume.settings.template === "classic" ? "active" : ""}`} onClick={() => updateSetting("template", "classic")}>
              <span className="template-thumb classic-thumb"><i /><b /></span>
              کلاسیک
            </button>
          </div>
        </div>

        <div className="design-group">
          <label className="design-label" htmlFor="accent-color">رنگ اصلی</label>
          <div className="color-options">
            {["#176b5b", "#2457a7", "#7a3e65", "#9a4d20", "#2f3b52"].map((color) => (
              <button key={color} type="button" aria-label={`انتخاب رنگ ${color}`} className={resume.settings.accent === color ? "active" : ""} style={{ background: color }} onClick={() => updateSetting("accent", color)} />
            ))}
            <input id="accent-color" aria-label="رنگ دلخواه" type="color" value={resume.settings.accent} onChange={(event) => updateSetting("accent", event.target.value)} />
          </div>
        </div>

        <div className="field-grid design-fields">
          <label className="field">
            <span>زبان عنوان‌های رزومه</span>
            <select data-testid="resume-language" value={resume.settings.language ?? "fa"} onChange={(event) => updateSetting("language", event.target.value as ResumeLanguage)}>
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className="field">
            <span>جهت متن</span>
            <select value={resume.settings.direction} onChange={(event) => updateSetting("direction", event.target.value as Direction)}>
              <option value="rtl">راست‌به‌چپ</option>
              <option value="ltr">چپ‌به‌راست</option>
            </select>
          </label>
          <label className="field">
            <span>فونت</span>
            <select value={resume.settings.font} onChange={(event) => updateSetting("font", event.target.value as Font)}>
              <option value="sans">ساده</option>
              <option value="serif">رسمی</option>
              <option value="mono">فنی</option>
            </select>
          </label>
          <label className="field">
            <span>فاصله‌گذاری</span>
            <select value={resume.settings.density} onChange={(event) => updateSetting("density", event.target.value as Density)}>
              <option value="comfortable">راحت</option>
              <option value="compact">فشرده</option>
            </select>
          </label>
        </div>

        <div className="privacy-note">
          <strong>اطلاعات شما خصوصی می‌ماند.</strong>
          <span>همه داده‌ها فقط روی همین مرورگر ذخیره می‌شوند و به سروری ارسال نمی‌شوند.</span>
        </div>
        <button className="text-button danger reset-button" type="button" onClick={resetResume}>بازگردانی نمونه اولیه</button>
      </EditorSection>
    ),
  };

  return (
    <aside className="editor-panel">
      <div className="editor-heading">
        <div><small>ویرایش رزومه</small><h1>{resume.basics.name || "رزومه بدون نام"}</h1></div>
        <span>{tabs.findIndex((tab) => tab.id === activeTab) + 1} / {tabs.length}</span>
      </div>
      <nav className="editor-tabs" aria-label="بخش‌های رزومه">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </nav>
      <div className="editor-scroll">{sections[activeTab]}</div>
    </aside>
  );
}

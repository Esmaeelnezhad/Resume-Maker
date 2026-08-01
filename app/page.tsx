"use client";

/* eslint-disable @next/next/no-img-element -- user-selected data URLs cannot use the image optimizer */

import { ChangeEvent, CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type Direction = "ltr" | "rtl";
type Template = "modern" | "classic";
type Font = "sans" | "serif" | "mono";
type Density = "comfortable" | "compact";
type Tab = "profile" | "experience" | "education" | "projects" | "skills" | "design";
type ListKey = "experience" | "education" | "projects" | "skills" | "languages";

type Basics = {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  photo: string;
};

type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

type Education = {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  description: string;
};

type Project = {
  id: string;
  name: string;
  link: string;
  description: string;
};

type Skill = { id: string; name: string };
type Language = { id: string; name: string; level: string };

type ResumeData = {
  basics: Basics;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  settings: {
    accent: string;
    direction: Direction;
    template: Template;
    font: Font;
    density: Density;
  };
};

const STORAGE_KEY = "resume-maker-v1";
const id = () => Math.random().toString(36).slice(2, 10);

const sampleResume: ResumeData = {
  basics: {
    name: "سارا احمدی",
    role: "طراح محصول",
    email: "sara@example.com",
    phone: "+98 912 000 0000",
    location: "تهران، ایران",
    website: "sara.design",
    linkedin: "linkedin.com/in/sara-ahmadi",
    summary:
      "طراح محصول با بیش از ۵ سال تجربه در ساخت تجربه‌های ساده و انسانی برای محصولات دیجیتال. متخصص در تحقیق کاربر، طراحی رابط و همکاری نزدیک با تیم‌های محصول و فنی.",
    photo: "",
  },
  experience: [
    {
      id: "sample-experience-1",
      role: "طراح ارشد محصول",
      company: "استودیو نقطه",
      location: "تهران",
      start: "۱۴۰۲",
      end: "اکنون",
      current: true,
      description:
        "بازطراحی مسیر فعال‌سازی و افزایش ۲۸٪ نرخ تکمیل ثبت‌نام\nساخت و مستندسازی سیستم طراحی مشترک برای سه محصول\nهدایت جلسات تحقیق و تست کاربردپذیری با بیش از ۴۰ کاربر",
    },
    {
      id: "sample-experience-2",
      role: "طراح تجربه کاربر",
      company: "راهکار آبی",
      location: "دورکار",
      start: "۱۳۹۹",
      end: "۱۴۰۲",
      current: false,
      description:
        "طراحی داشبورد تحلیل داده برای مشتریان سازمانی\nهمکاری با تیم فنی برای تحویل دقیق و دسترس‌پذیر رابط‌ها",
    },
  ],
  education: [
    {
      id: "sample-education-1",
      degree: "کارشناسی طراحی صنعتی",
      school: "دانشگاه هنر تهران",
      location: "تهران",
      start: "۱۳۹۵",
      end: "۱۳۹۹",
      description: "پروژه پایانی: طراحی تجربه خدمات شهری برای شهروندان کم‌توان",
    },
  ],
  projects: [
    {
      id: "sample-project-1",
      name: "کتابخانه رابط نقطه",
      link: "github.com/sara/dot-ui",
      description: "مجموعه متن‌باز اجزای رابط راست‌به‌چپ با تمرکز بر دسترس‌پذیری.",
    },
  ],
  skills: [
    { id: "sample-skill-1", name: "طراحی محصول" },
    { id: "sample-skill-2", name: "Figma" },
    { id: "sample-skill-3", name: "تحقیق کاربر" },
    { id: "sample-skill-4", name: "سیستم طراحی" },
    { id: "sample-skill-5", name: "نمونه‌سازی" },
  ],
  languages: [
    { id: "sample-language-1", name: "فارسی", level: "زبان مادری" },
    { id: "sample-language-2", name: "انگلیسی", level: "حرفه‌ای" },
  ],
  settings: {
    accent: "#176b5b",
    direction: "rtl",
    template: "modern",
    font: "sans",
    density: "comfortable",
  },
};

const emptyItems = {
  experience: (): Experience => ({
    id: id(),
    role: "",
    company: "",
    location: "",
    start: "",
    end: "",
    current: false,
    description: "",
  }),
  education: (): Education => ({
    id: id(),
    degree: "",
    school: "",
    location: "",
    start: "",
    end: "",
    description: "",
  }),
  projects: (): Project => ({ id: id(), name: "", link: "", description: "" }),
  skills: (): Skill => ({ id: id(), name: "" }),
  languages: (): Language => ({ id: id(), name: "", level: "" }),
};

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "مشخصات" },
  { id: "experience", label: "تجربه" },
  { id: "education", label: "تحصیلات" },
  { id: "projects", label: "پروژه‌ها" },
  { id: "skills", label: "مهارت‌ها" },
  { id: "design", label: "ظاهر" },
];

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
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

function safeUrl(value: string) {
  if (!value.trim()) return "";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function Home() {
  const [resume, setResume] = useState<ResumeData>(sampleResume);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [hydrated, setHydrated] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // Loading device-local data after hydration avoids a server/client mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setResume(JSON.parse(saved) as ResumeData);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  }, [resume, hydrated]);

  const updateBasics = (field: keyof Basics, value: string) => {
    setResume((current) => ({
      ...current,
      basics: { ...current.basics, [field]: value },
    }));
  };

  const updateList = (key: ListKey, itemId: string, field: string, value: string | boolean) => {
    setResume((current) => ({
      ...current,
      [key]: current[key].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    }) as ResumeData);
  };

  const addItem = (key: ListKey) => {
    setResume((current) => ({
      ...current,
      [key]: [...current[key], emptyItems[key]()],
    }) as ResumeData);
  };

  const removeItem = (key: ListKey, itemId: string) => {
    setResume((current) => ({
      ...current,
      [key]: current[key].filter((item) => item.id !== itemId),
    }) as ResumeData);
  };

  const updateSetting = <K extends keyof ResumeData["settings"]>(
    key: K,
    value: ResumeData["settings"][K],
  ) => {
    setResume((current) => ({
      ...current,
      settings: { ...current.settings, [key]: value },
    }));
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("لطفاً یک فایل تصویری انتخاب کنید.");
      return;
    }
    if (file.size > 2_000_000) {
      window.alert("حجم تصویر باید کمتر از ۲ مگابایت باشد.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateBasics("photo", String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `resume-${resume.basics.name || "untitled"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ResumeData;
        if (!parsed.basics || !Array.isArray(parsed.experience) || !parsed.settings) {
          throw new Error("invalid resume");
        }
        setResume(parsed);
      } catch {
        window.alert("این فایل، خروجی معتبر رزومه‌ساز نیست.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const resetResume = () => {
    if (!window.confirm("همه تغییرات پاک و نمونه اولیه جایگزین شود؟")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setResume(sampleResume);
  };

  const renderProfile = () => (
    <EditorSection title="مشخصات فردی">
      <div className="photo-control">
        <div className="photo-placeholder">
          {resume.basics.photo ? (
            <img src={resume.basics.photo} alt="تصویر انتخاب‌شده" />
          ) : (
            <span>عکس</span>
          )}
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
  );

  const renderExperience = () => (
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
  );

  const renderEducation = () => (
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
  );

  const renderProjects = () => (
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
  );

  const renderSkills = () => (
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
  );

  const renderDesign = () => (
    <EditorSection title="ظاهر رزومه">
      <div className="design-group">
        <span className="design-label">قالب</span>
        <div className="option-grid">
          <button type="button" className={`template-option ${resume.settings.template === "modern" ? "active" : ""}`} onClick={() => updateSetting("template", "modern")}>
            <span className="template-thumb modern-thumb"><i /><b /></span>
            مدرن
          </button>
          <button type="button" className={`template-option ${resume.settings.template === "classic" ? "active" : ""}`} onClick={() => updateSetting("template", "classic")}>
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
  );

  const activeEditor = {
    profile: renderProfile,
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    skills: renderSkills,
    design: renderDesign,
  }[activeTab];

  const websiteUrl = safeUrl(resume.basics.website);
  const linkedinUrl = safeUrl(resume.basics.linkedin);

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="brand" href="#top" aria-label="رزومه‌ساز، صفحه اصلی">
          <span className="brand-mark">ر</span>
          <span><strong>رزومه‌ساز</strong><small>ساده، حرفه‌ای، خصوصی</small></span>
        </a>
        <div className="header-actions">
          <span className="save-state"><i />ذخیره خودکار</span>
          <button className="button button-ghost" type="button" onClick={exportData}>دریافت پشتیبان</button>
          <button className="button button-ghost" type="button" onClick={() => importRef.current?.click()}>بازیابی</button>
          <input ref={importRef} className="visually-hidden" type="file" accept="application/json" onChange={importData} />
          <button className="button button-primary" type="button" onClick={() => window.print()}>دریافت PDF</button>
        </div>
      </header>

      <div className="workspace" id="top">
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
          <div className="editor-scroll">{activeEditor()}</div>
        </aside>

        <section className="preview-panel" aria-label="پیش‌نمایش رزومه">
          <div className="preview-toolbar">
            <span><i />پیش‌نمایش زنده</span>
            <small>A4</small>
          </div>
          <div className="paper-stage">
            <article
              className={`resume-sheet template-${resume.settings.template} font-${resume.settings.font} density-${resume.settings.density}`}
              dir={resume.settings.direction}
              style={{ "--accent": resume.settings.accent } as CSSProperties}
            >
              <header className="resume-header">
                {resume.basics.photo ? <img className="resume-photo" src={resume.basics.photo} alt="" /> : null}
                <div className="resume-identity">
                  <h1>{resume.basics.name || "نام شما"}</h1>
                  <p>{resume.basics.role || "عنوان حرفه‌ای"}</p>
                </div>
              </header>

              <div className="resume-layout">
                <aside className="resume-sidebar">
                  <section className="resume-block contact-block">
                    <h2>تماس</h2>
                    <ul>
                      {resume.basics.email ? <li><span>ایمیل</span><a href={`mailto:${resume.basics.email}`}>{resume.basics.email}</a></li> : null}
                      {resume.basics.phone ? <li><span>تلفن</span><a href={`tel:${resume.basics.phone}`}>{resume.basics.phone}</a></li> : null}
                      {resume.basics.location ? <li><span>موقعیت</span><b>{resume.basics.location}</b></li> : null}
                      {websiteUrl ? <li><span>وب‌سایت</span><a href={websiteUrl}>{resume.basics.website}</a></li> : null}
                      {linkedinUrl ? <li><span>LinkedIn</span><a href={linkedinUrl}>{resume.basics.linkedin}</a></li> : null}
                    </ul>
                  </section>

                  {resume.skills.some((item) => item.name) ? (
                    <section className="resume-block">
                      <h2>مهارت‌ها</h2>
                      <div className="skill-list">
                        {resume.skills.filter((item) => item.name).map((item) => <span key={item.id}>{item.name}</span>)}
                      </div>
                    </section>
                  ) : null}

                  {resume.languages.some((item) => item.name) ? (
                    <section className="resume-block">
                      <h2>زبان‌ها</h2>
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
                    <section className="resume-block summary-block"><h2>درباره من</h2><p>{resume.basics.summary}</p></section>
                  ) : null}

                  {resume.experience.length ? (
                    <section className="resume-block">
                      <h2>سوابق کاری</h2>
                      {resume.experience.map((item) => (
                        <div className="resume-entry" key={item.id}>
                          <div className="resume-entry-head">
                            <div><h3>{item.role || "عنوان شغلی"}</h3><p>{[item.company, item.location].filter(Boolean).join(" · ")}</p></div>
                            <time>{[item.start, item.current ? "اکنون" : item.end].filter(Boolean).join(" — ")}</time>
                          </div>
                          {item.description ? <ul>{lines(item.description).map((line, index) => <li key={index}>{line}</li>)}</ul> : null}
                        </div>
                      ))}
                    </section>
                  ) : null}

                  {resume.education.length ? (
                    <section className="resume-block">
                      <h2>تحصیلات</h2>
                      {resume.education.map((item) => (
                        <div className="resume-entry" key={item.id}>
                          <div className="resume-entry-head">
                            <div><h3>{item.degree || "عنوان مدرک"}</h3><p>{[item.school, item.location].filter(Boolean).join(" · ")}</p></div>
                            <time>{[item.start, item.end].filter(Boolean).join(" — ")}</time>
                          </div>
                          {item.description ? <p className="entry-description">{item.description}</p> : null}
                        </div>
                      ))}
                    </section>
                  ) : null}

                  {resume.projects.length ? (
                    <section className="resume-block">
                      <h2>پروژه‌ها</h2>
                      {resume.projects.map((item) => (
                        <div className="resume-entry project-entry" key={item.id}>
                          <div className="resume-entry-head">
                            <div><h3>{item.name || "نام پروژه"}</h3>{safeUrl(item.link) ? <a href={safeUrl(item.link)}>{item.link}</a> : null}</div>
                          </div>
                          {item.description ? <p className="entry-description">{item.description}</p> : null}
                        </div>
                      ))}
                    </section>
                  ) : null}
                </div>
              </div>
              <footer className="resume-footer">ساخته‌شده با رزومه‌ساز</footer>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

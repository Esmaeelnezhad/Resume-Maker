export const STORAGE_KEY = "resume-maker-v1";

export const labels = {
  fa: {
    contact: "تماس",
    email: "ایمیل",
    phone: "تلفن",
    location: "موقعیت",
    website: "وب‌سایت",
    skills: "مهارت‌ها",
    languages: "زبان‌ها",
    profile: "درباره من",
    experience: "سوابق کاری",
    education: "تحصیلات",
    projects: "پروژه‌ها",
    current: "اکنون",
    namePlaceholder: "نام شما",
    rolePlaceholder: "عنوان حرفه‌ای",
    jobPlaceholder: "عنوان شغلی",
    degreePlaceholder: "عنوان مدرک",
    projectPlaceholder: "نام پروژه",
    footer: "ساخته‌شده با رزومه‌ساز",
  },
  en: {
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    location: "Location",
    website: "Website",
    skills: "Skills",
    languages: "Languages",
    profile: "Profile",
    experience: "Work Experience",
    education: "Education",
    projects: "Projects",
    current: "Present",
    namePlaceholder: "Your Name",
    rolePlaceholder: "Professional Title",
    jobPlaceholder: "Job Title",
    degreePlaceholder: "Degree",
    projectPlaceholder: "Project Name",
    footer: "Made with Resume Maker",
  },
};

export const sampleResume = {
  basics: {
    name: "سارا احمدی",
    role: "طراح محصول",
    email: "sara@example.com",
    phone: "+98 912 000 0000",
    location: "تهران، ایران",
    website: "sara.design",
    linkedin: "linkedin.com/in/sara-ahmadi",
    summary: "طراح محصول با بیش از ۵ سال تجربه در ساخت تجربه‌های ساده و انسانی برای محصولات دیجیتال. متخصص در تحقیق کاربر، طراحی رابط و همکاری نزدیک با تیم‌های محصول و فنی.",
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
      description: "بازطراحی مسیر فعال‌سازی و افزایش ۲۸٪ نرخ تکمیل ثبت‌نام\nساخت و مستندسازی سیستم طراحی مشترک برای سه محصول\nهدایت جلسات تحقیق و تست کاربردپذیری با بیش از ۴۰ کاربر",
    },
    {
      id: "sample-experience-2",
      role: "طراح تجربه کاربر",
      company: "راهکار آبی",
      location: "دورکار",
      start: "۱۳۹۹",
      end: "۱۴۰۲",
      current: false,
      description: "طراحی داشبورد تحلیل داده برای مشتریان سازمانی\nهمکاری با تیم فنی برای تحویل دقیق و دسترس‌پذیر رابط‌ها",
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
    language: "fa",
  },
};

const schemas = {
  basics: ["name", "role", "email", "phone", "location", "website", "linkedin", "summary", "photo"],
  experience: ["role", "company", "location", "start", "end", "description"],
  education: ["degree", "school", "location", "start", "end", "description"],
  projects: ["name", "link", "description"],
  skills: ["name"],
  languages: ["name", "level"],
};

const allowedSettings = {
  direction: ["rtl", "ltr"],
  template: ["modern", "classic"],
  font: ["sans", "serif", "mono"],
  density: ["comfortable", "compact"],
  language: ["fa", "en"],
};

const text = (value) => (typeof value === "string" ? value : "");
const newId = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
const clone = (value) => JSON.parse(JSON.stringify(value));

export function normalizeResume(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  const basicsSource = source.basics && typeof source.basics === "object" ? source.basics : {};
  const basics = Object.fromEntries(
    schemas.basics.map((key) => [key, text(basicsSource[key] ?? sampleResume.basics[key])]),
  );

  const normalizeList = (key) => {
    const fallback = sampleResume[key];
    const list = Array.isArray(source[key]) ? source[key] : fallback;
    return list.map((item) => {
      const safeItem = item && typeof item === "object" ? item : {};
      const normalized = { id: text(safeItem.id) || newId() };
      for (const field of schemas[key]) normalized[field] = text(safeItem[field]);
      if (key === "experience") normalized.current = Boolean(safeItem.current);
      return normalized;
    });
  };

  const sourceSettings = source.settings && typeof source.settings === "object" ? source.settings : {};
  const settings = { ...sampleResume.settings };
  for (const [key, values] of Object.entries(allowedSettings)) {
    if (values.includes(sourceSettings[key])) settings[key] = sourceSettings[key];
  }
  if (/^#[0-9a-f]{6}$/i.test(sourceSettings.accent ?? "")) settings.accent = sourceSettings.accent;

  return {
    basics,
    experience: normalizeList("experience"),
    education: normalizeList("education"),
    projects: normalizeList("projects"),
    skills: normalizeList("skills"),
    languages: normalizeList("languages"),
    settings,
  };
}

export function freshSample() {
  return clone(sampleResume);
}

export function createItem(key) {
  const item = { id: newId() };
  for (const field of schemas[key]) item[field] = "";
  if (key === "experience") item.current = false;
  return item;
}

export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character],
  );
}

export function safeUrl(value) {
  const raw = text(value).trim();
  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function safePhoto(value) {
  const photo = text(value);
  return /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(photo) ? photo : "";
}

export function lines(value) {
  return text(value).split("\n").map((line) => line.trim()).filter(Boolean);
}

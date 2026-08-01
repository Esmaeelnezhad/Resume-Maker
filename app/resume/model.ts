export type Direction = "ltr" | "rtl";
export type Template = "modern" | "classic";
export type Font = "sans" | "serif" | "mono";
export type Density = "comfortable" | "compact";
export type ResumeLanguage = "fa" | "en";
export type Tab = "profile" | "experience" | "education" | "projects" | "skills" | "design";
export type ListKey = "experience" | "education" | "projects" | "skills" | "languages";

export type Basics = {
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

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  link: string;
  description: string;
};

export type Skill = { id: string; name: string };
export type Language = { id: string; name: string; level: string };

export type ResumeData = {
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
    language: ResumeLanguage;
  };
};

type ResumeLabels = {
  contact: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  skills: string;
  languages: string;
  profile: string;
  experience: string;
  education: string;
  projects: string;
  current: string;
  namePlaceholder: string;
  rolePlaceholder: string;
  jobPlaceholder: string;
  degreePlaceholder: string;
  projectPlaceholder: string;
  footer: string;
};

export const resumeLabels: Record<ResumeLanguage, ResumeLabels> = {
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

export const STORAGE_KEY = "resume-maker-v1";
const id = () => Math.random().toString(36).slice(2, 10);

export const sampleResume: ResumeData = {
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
    language: "fa",
  },
};

export const emptyItems = {
  experience: (): Experience => ({
    id: id(), role: "", company: "", location: "", start: "", end: "", current: false, description: "",
  }),
  education: (): Education => ({
    id: id(), degree: "", school: "", location: "", start: "", end: "", description: "",
  }),
  projects: (): Project => ({ id: id(), name: "", link: "", description: "" }),
  skills: (): Skill => ({ id: id(), name: "" }),
  languages: (): Language => ({ id: id(), name: "", level: "" }),
};

export function normalizeResume(value: ResumeData): ResumeData {
  return {
    ...sampleResume,
    ...value,
    basics: { ...sampleResume.basics, ...value.basics },
    settings: { ...sampleResume.settings, ...value.settings },
  };
}

export function safeUrl(value: string) {
  if (!value.trim()) return "";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

export function lines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

import { createItem, freshSample, normalizeResume, STORAGE_KEY } from "./data.js";
import { renderEditor, renderTabs, tabs } from "./editor.js";
import { renderPreview } from "./preview.js";

const elements = {
  editor: document.querySelector("#editor-content"),
  tabs: document.querySelector("#editor-tabs"),
  title: document.querySelector("#editor-title"),
  progress: document.querySelector("#tab-progress"),
  preview: document.querySelector("#resume-sheet"),
  exportButton: document.querySelector("#export-button"),
  importButton: document.querySelector("#import-button"),
  importFile: document.querySelector("#import-file"),
  printButton: document.querySelector("#print-button"),
};

function loadResume() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeResume(JSON.parse(saved)) : freshSample();
  } catch {
    return freshSample();
  }
}

let resume = loadResume();
let activeTab = "profile";

function saveResume() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  } catch {
    // The app still works if browser storage is disabled or full.
  }
}

function render({ editor = true } = {}) {
  if (editor) {
    renderTabs(elements.tabs, activeTab);
    renderEditor(elements.editor, resume, activeTab);
  }

  elements.title.textContent = resume.basics.name.trim() || "رزومه بدون نام";
  elements.progress.textContent = `${new Intl.NumberFormat("fa").format(tabs.findIndex(([id]) => id === activeTab) + 1)} / ${new Intl.NumberFormat("fa").format(tabs.length)}`;
  renderPreview(elements.preview, resume);
  saveResume();
}

elements.tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tab]");
  if (!button) return;
  activeTab = button.dataset.tab;
  render();
});

function updateField(target) {
  const path = target.dataset.path;
  if (path) {
    const [, key] = path.split(".");
    resume.basics[key] = target.value;
    return true;
  }

  const { list, id, field, setting } = target.dataset;
  if (list && id && field && Array.isArray(resume[list])) {
    const item = resume[list].find((candidate) => candidate.id === id);
    if (item) item[field] = target.type === "checkbox" ? target.checked : target.value;
    return Boolean(item);
  }

  if (setting) {
    resume.settings[setting] = target.value;
    return true;
  }

  return false;
}

elements.editor.addEventListener("input", (event) => {
  if (updateField(event.target)) render({ editor: false });
});

elements.editor.addEventListener("change", (event) => {
  const target = event.target;
  if (target.id !== "photo-input") {
    if (updateField(target)) render({ editor: false });
    return;
  }

  const [file] = target.files;
  if (!file) return;
  const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type) || file.size > 2_000_000) {
    window.alert("تصویر باید PNG، JPEG، WebP یا GIF و حداکثر ۲ مگابایت باشد.");
    target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    resume.basics.photo = String(reader.result);
    render();
  });
  reader.readAsDataURL(file);
});

elements.editor.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, list, id, setting, value } = button.dataset;
  if (action === "add" && Array.isArray(resume[list])) {
    resume[list].push(createItem(list));
  } else if (action === "remove" && Array.isArray(resume[list])) {
    resume[list] = resume[list].filter((item) => item.id !== id);
  } else if (action === "setting") {
    resume.settings[setting] = value;
  } else if (action === "remove-photo") {
    resume.basics.photo = "";
  } else if (action === "reset") {
    if (!window.confirm("همه اطلاعات فعلی با نمونه اولیه جایگزین شود؟")) return;
    resume = freshSample();
    activeTab = "profile";
  } else {
    return;
  }

  render();
});

elements.exportButton.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "resume-backup.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
});

elements.importButton.addEventListener("click", () => elements.importFile.click());

elements.importFile.addEventListener("change", async () => {
  const [file] = elements.importFile.files;
  if (!file) return;

  try {
    if (file.size > 2_000_000) throw new Error("too large");
    const value = JSON.parse(await file.text());
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid");
    resume = normalizeResume(value);
    activeTab = "profile";
    render();
  } catch {
    window.alert("فایل پشتیبان معتبر نیست یا بیش از ۲ مگابایت حجم دارد.");
  } finally {
    elements.importFile.value = "";
  }
});

elements.printButton.addEventListener("click", () => window.print());

render();

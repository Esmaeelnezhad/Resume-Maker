"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { EditorPanel } from "./resume/EditorPanel";
import {
  Basics,
  emptyItems,
  ListKey,
  normalizeResume,
  ResumeData,
  sampleResume,
  STORAGE_KEY,
  Tab,
} from "./resume/model";
import { ResumePreview } from "./resume/ResumePreview";

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
      if (saved) setResume(normalizeResume(JSON.parse(saved) as ResumeData));
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
        setResume(normalizeResume(parsed));
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
          <button data-testid="print-button" className="button button-primary" type="button" onClick={() => window.print()}>دریافت PDF</button>
        </div>
      </header>

      <div className="workspace" id="top">
        <EditorPanel
          resume={resume}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          updateBasics={updateBasics}
          updateList={updateList}
          addItem={addItem}
          removeItem={removeItem}
          updateSetting={updateSetting}
          handlePhoto={handlePhoto}
          resetResume={resetResume}
        />
        <ResumePreview resume={resume} />
      </div>
    </main>
  );
}

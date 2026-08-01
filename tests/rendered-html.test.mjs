import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the resume maker", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>رزومه‌ساز/);
  assert.match(html, /پیش‌نمایش زنده/);
  assert.match(html, /دریافت PDF/);
  assert.match(html, /سارا احمدی/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("keeps core privacy and export features in the client", async () => {
  const [page, model, preview] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/resume/model.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/resume/ResumePreview.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /window\.localStorage\.setItem/);
  assert.match(page, /new Blob\(\[JSON\.stringify/);
  assert.match(page, /window\.print\(\)/);
  assert.match(page, /file\.size > 2_000_000/);
  assert.ok(page.split("\n").length < 250, "page.tsx should stay a small coordinator");
  assert.match(page, /from "\.\/resume\/EditorPanel"/);
  assert.match(page, /from "\.\/resume\/ResumePreview"/);
  assert.match(model, /Work Experience/);
  assert.match(model, /Made with Resume Maker/);
  assert.match(model, /url\.protocol === "http:" \|\| url\.protocol === "https:"/);
  assert.match(preview, /resumeLabels\[language\]/);
});

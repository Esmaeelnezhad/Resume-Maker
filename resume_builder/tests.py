from pathlib import Path

from django.contrib.staticfiles import finders
from django.test import SimpleTestCase


class ResumeMakerTests(SimpleTestCase):
    def test_home_renders_editor_and_preview(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "رزومه‌ساز")
        self.assertContains(response, 'id="editor-content"')
        self.assertContains(response, 'id="resume-sheet"')
        self.assertContains(response, 'id="print-button"')
        self.assertRegex(
            response.content.decode(),
            r"resume_builder/js/app(?:\.[0-9a-f]+)?\.js",
        )

    def test_health_endpoint(self):
        response = self.client.get("/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_browser_features_are_shipped(self):
        app_path = Path(finders.find("resume_builder/js/app.js"))
        data_path = Path(finders.find("resume_builder/js/data.js"))
        preview_path = Path(finders.find("resume_builder/js/preview.js"))
        source = "\n".join(
            path.read_text(encoding="utf-8")
            for path in (app_path, data_path, preview_path)
        )

        for feature in (
            "localStorage",
            "window.print()",
            "resume-backup.json",
            "2_000_000",
            'experience: "Work Experience"',
            "template-${resume.settings.template}",
        ):
            self.assertIn(feature, source)

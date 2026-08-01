import os
import subprocess
import sys

from django.conf import settings
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

    def test_css_asset_exists(self):
        self.assertIsNotNone(finders.find("resume_builder/css/app.css"))

    def test_javascript_assets_exist(self):
        for filename in ("app.js", "data.js", "editor.js", "preview.js"):
            with self.subTest(filename=filename):
                self.assertIsNotNone(finders.find(f"resume_builder/js/{filename}"))

    def test_open_graph_image_exists(self):
        self.assertIsNotNone(finders.find("resume_builder/images/og.png"))

    def test_unknown_route_returns_404(self):
        self.assertEqual(self.client.get("/not-a-real-route/").status_code, 404)

    def test_production_security_settings(self):
        environment = os.environ.copy()
        environment.update(
            DJANGO_DEBUG="0",
            DJANGO_SETTINGS_MODULE="resume_project.settings",
            SECRET_KEY="test-only-M9fK2qV7xP4nR8wT6yL3cD5sH1jB0aZ7uE9iO2pG4mN6vC8x",
        )
        code = """
import django
django.setup()
from django.conf import settings
assert settings.DEBUG is False
assert settings.SECURE_SSL_REDIRECT is True
assert settings.SECURE_HSTS_SECONDS > 0
assert settings.SESSION_COOKIE_SECURE is True
assert settings.CSRF_COOKIE_SECURE is True
assert "whitenoise.middleware.WhiteNoiseMiddleware" in settings.MIDDLEWARE
assert settings.STORAGES["staticfiles"]["BACKEND"] == "whitenoise.storage.CompressedManifestStaticFilesStorage"
"""

        result = subprocess.run(
            [sys.executable, "-c", code],
            cwd=settings.BASE_DIR,
            env=environment,
            capture_output=True,
            text=True,
            check=False,
        )

        self.assertEqual(result.returncode, 0, result.stderr)

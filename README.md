# رزومه‌ساز | Resume Maker

[![CI](https://github.com/Esmaeelnezhad/Resume-Maker/actions/workflows/ci.yml/badge.svg)](https://github.com/Esmaeelnezhad/Resume-Maker/actions/workflows/ci.yml)

رزومه‌ساز یک پروژه Django رایگان، دوزبانه و حریم‌خصوصی‌محور برای ساخت رزومه حرفه‌ای در مرورگر است. اطلاعات کاربر از دستگاه خارج نمی‌شود و نتیجه با یک کلیک به PDF استاندارد A4 تبدیل می‌شود.

![نمایش ویرایش زنده و دریافت PDF](docs/media/live-edit.gif)

## تصاویر محیط

### محیط ویرایش

![محیط ویرایش رزومه‌ساز](docs/media/editor.png)

### قالب Modern

![قالب Modern رزومه‌ساز](docs/media/modern.png)

### قالب Classic

![قالب Classic رزومه‌ساز](docs/media/classic.png)

## قابلیت‌ها

- ویرایش زنده مشخصات، سوابق کاری، تحصیلات، پروژه‌ها، مهارت‌ها و زبان‌ها
- قالب‌های Modern و Classic با رنگ، فونت و فاصله‌گذاری قابل تنظیم
- عنوان‌های واقعی فارسی و انگلیسی برای تمام بخش‌های رزومه
- پشتیبانی کامل از چیدمان راست‌به‌چپ و چپ‌به‌راست
- افزودن عکس پروفایل با کنترل نوع و حجم فایل
- ذخیره خودکار روی دستگاه بدون حساب کاربری یا ارسال اطلاعات به سرور
- دریافت و بازیابی نسخه پشتیبان JSON
- خروجی PDF استاندارد A4 از طریق چاپ مرورگر
- طراحی واکنش‌گرا، قابل چاپ و دسترس‌پذیر

## اجرای محلی

به Python 3.10 یا جدیدتر نیاز است.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py runserver
```

سپس `http://127.0.0.1:8000` را باز کنید.

## بررسی پروژه

```powershell
python manage.py check
python manage.py test
```

## استقرار روی Railway

مخزن را به یک پروژه Railway متصل و متغیرهای `SECRET_KEY` و `DJANGO_DEBUG=0` را تعریف کنید. فرمان اجرای production در `Procfile` قرار دارد و فایل‌های استاتیک با WhiteNoise ارائه می‌شوند. بعد از Deploy می‌توانید از بخش Networking دامنه Railway بسازید.

## حریم خصوصی

اطلاعات رزومه فقط در `localStorage` مرورگر ذخیره می‌شود و به سرور Django ارسال نمی‌شود. پاک‌کردن داده‌های مرورگر، اطلاعات ذخیره‌شده را حذف می‌کند؛ برای نگهداری بلندمدت از گزینه «دریافت پشتیبان» استفاده کنید.

## فناوری‌ها

Python، Django، JavaScript، HTML، CSS، WhiteNoise و Gunicorn؛ بدون دیتابیس، حساب کاربری یا کتابخانه رابط کاربری اضافی.

## مجوز

این پروژه با مجوز [MIT](LICENSE) منتشر شده است.

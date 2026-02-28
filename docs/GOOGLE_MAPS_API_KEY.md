# كيف تحصل على مفتاح Google Maps API

## الخطوات (بالعربي)

1. **افتح Google Cloud Console**
   - اذهب إلى: https://console.cloud.google.com/

2. **أنشئ مشروع أو اختر مشروعاً موجوداً**
   - من القائمة العلوية اضغط على "Select a project" → "New Project"
   - أو اختر مشروعاً حاليّاً

3. **فعّل خرائط Google (Maps JavaScript API)**
   - من القائمة الجانبية: **APIs & Services** → **Library**
   - ابحث عن **Maps JavaScript API**
   - اضغط عليها ثم **Enable**

4. **أنشئ مفتاح API (API Key)**
   - من القائمة: **APIs & Services** → **Credentials**
   - اضغط **Create Credentials** → **API Key**
   - سيظهر المفتاح في نافذة منبثقة — انسخه

5. **ضع المفتاح في المشروع**
   - في مجلد المشروع أنشئ ملف `.env.local` (إن لم يكن موجوداً)
   - أضف السطر:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=المفتاح_الذي_نسخته
   ```
   - أعد تشغيل السيرفر: `npm run dev`

---

## Steps (English)

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com/

2. **Create or select a project**
   - Top bar → "Select a project" → "New Project" (or use existing)

3. **Enable Maps JavaScript API**
   - Side menu: **APIs & Services** → **Library**
   - Search for **Maps JavaScript API** → open it → **Enable**

4. **Create an API key**
   - **APIs & Services** → **Credentials**
   - **Create Credentials** → **API Key**
   - Copy the key from the popup

5. **Add the key to the project**
   - In the project root, create or edit `.env.local`
   - Add:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_copied_key
   ```
   - Restart dev server: `npm run dev`

---

## خطأ "ApiNotActivatedMapError" / ApiNotActivatedMapError

إذا ظهر في الكونسول: **ApiNotActivatedMapError** فهذا يعني أن المفتاح موجود لكن **Maps JavaScript API** غير مفعّل لمشروعك.

**الحل:**
1. افتح: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
2. تأكد أن المشروع الصحيح محدد في الأعلى
3. اضغط **Enable** (تفعيل)

ثم حدّث الصفحة في المتصفح.

---

## ملاحظات / Notes

- المفتاح يظهر في المتصفح (client-side) لأنه يبدأ بـ `NEXT_PUBLIC_`. لتفادي الاستخدام غير المسموح، يمكنك في Google Cloud تقييد المفتاح بـ HTTP referrers (مثلاً `localhost:*` واسم دومينك).
- بدون المفتاح، صفحة البحث تعمل وتظهر قائمة الفنادق؛ فقط منطقة الخريطة تعرض رسالة تطلب إضافة المفتاح.

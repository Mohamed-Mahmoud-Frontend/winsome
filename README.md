# بحث الفنادق | Hotel Search

تطبيق ويب للبحث عن الفنادق حسب الموقع، ومقارنة النتائج على خريطة تفاعلية، مع إمكانية التصفية حسب التواريخ والضيوف وعرض تفاصيل كل فندق مع الأسعار والمراجعات.

---

## المميزات

- **الصفحة الرئيسية** — قسم ترحيبي ونموذج بحث سريع (الوجهة، تاريخ الوصول والمغادرة، عدد الضيوف) مع زر «البحث على الخريطة» للانتقال إلى تجربة البحث الكاملة.
- **صفحة البحث** (`/hotels`) — نموذج بحث كامل، فلاتر (التقييم، نطاق السعر، مسبح، سبا، نوع العقار، تاريخ المغادرة)، قائمة فنادق مع تمرير لا نهائي، وخريطة حية تتحدّث عند تحريك أو تكبير الخريطة.
- **صفحة تفاصيل الفندق** (`/hotels/[id]`) — سلايدر صور، الأسعار، الوصف، الموقع، المرافق، تفصيل التقييمات، مراجعات النزلاء، وفنادق مقترحة (ISR مع إعادة التحقق كل 60 ثانية).
- **تحويل المواقع (Geocoding)** — يستخدم البحث عن الموقع خدمة Nominatim (OpenStreetMap) لتحويل المدينة أو العنوان إلى إحداثيات وضبط حدود الخريطة تلقائياً.
- **وضعان للبيانات** — بيانات وهمية (افتراضي، بدون مفاتيح API) أو [SearchApi.io](https://www.searchapi.io/) (Google Hotels) عند تعيين `SEARCHAPI_KEY` و `USE_MOCK_HOTELS=0`.

---

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **Next.js 16**، **React 19**، **TypeScript** | الهيكل والواجهة ولغة البرمجة |
| **Tailwind CSS 4** | التنسيق والتصميم |
| **Zustand** | إدارة حالة البحث والفلاتر |
| **TanStack React Query** | جلب وتخزين بيانات الفنادق (استعلام لا نهائي وتخزين مؤقت) |
| **Axios** | عميل HTTP للاتصال بـ `/api` |
| **@react-google-maps/api** | الخريطة التفاعلية |
| **react-hot-toast** | الإشعارات للمستخدم |
| **Jest** + **React Testing Library** | الاختبارات الوحدوية |

---

## هيكل المشروع

| المسار | الغرض |
|--------|--------|
| `app/` | App Router في Next.js: الصفحات، التخطيط، مقدمي الخدمة، مسارات الـ API |
| `app/api/hotels` | GET قائمة الفنادق (وهمي أو SearchApi) و GET `[id]` لتفاصيل فندق + المقترحات |
| `app/api/geocode` | GET تحويل الموقع عبر Nominatim |
| `components/` | مكونات مشتركة: الصفحة الرئيسية (Hero، SearchPreviewCard، Footer)، واجهة المستخدم (Button، Input، Skeleton)، التغذية الراجعة (Spinner، EmptyState، إلخ) |
| `features/hotels/` | ميزة البحث: المكونات (SearchForm، HotelList، HotelCard، HotelsMap، HotelFiltersBar)، المخزن، الـ hooks، عميل API، البيانات الوهمية، أداة الفلاتر |
| `core/services/` | عميل API (axios، baseURL `/api`) |
| `hooks/` | Hooks مشتركة (مثل `useDebounce`) |
| `types/` | تعريفات TypeScript (HotelResult، Guests، إلخ) |
| `utils/` | دوال مساعدة (`cn`، `slugify`) |
| `docs/` | توثيق إضافي (مثل إعداد مفتاح Google Maps) |
| `__tests__/` | اختبارات Jest و React Testing Library |

---

## البدء

### المتطلبات

- Node.js (يفضّل الإصدار LTS)
- npm

### التثبيت

```bash
npm install
```

### متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع. جميع المتغيرات اختيارية للتشغيل ببيانات وهمية.

| المتغير | الوصف |
|---------|--------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | مفتاح Google Maps JavaScript API للخريطة. بدونه تظهر رسالة إعداد. راجع `docs/GOOGLE_MAPS_API_KEY.md`. |
| `SEARCHAPI_KEY` | مفتاح [SearchApi.io](https://www.searchapi.io/) لاستخدام نتائج Google Hotels الحقيقية بدلاً من البيانات الوهمية. |
| `USE_MOCK_HOTELS` | ضع `0` لاستخدام SearchApi عند وجود `SEARCHAPI_KEY`. غيّبه أو اتركه غير صفر لاستخدام البيانات الوهمية. |
| `NEXT_PUBLIC_APP_URL` | الرابط الأساسي للتطبيق (مثال: `https://your-domain.com`). يُستخدم عند جلب تفاصيل الفندق في ISR؛ الافتراضي `http://localhost:3000`. |

### التشغيل

**وضع التطوير**

```bash
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000).

**وضع الإنتاج**

```bash
npm run build
npm start
```

---

## أوامر npm

| الأمر | الوظيفة |
|-------|----------|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء المشروع للإنتاج |
| `npm start` | تشغيل خادم الإنتاج |
| `npm run lint` | تشغيل ESLint |
| `npm test` | تشغيل اختبارات Jest |
| `npm run test:watch` | تشغيل Jest بوضع المراقبة |

---

## المسارات (Routes)

| المسار | الوصف |
|--------|--------|
| `/` | الصفحة الرئيسية: قسم ترحيبي + نموذج بحث سريع → الانتقال إلى `/hotels` |
| `/hotels` | البحث الكامل: نموذج، فلاتر، قائمة نتائج، خريطة، تمرير لا نهائي |
| `/hotels/[id]` | تفاصيل فندق (id = place_id أو slug). ISR مع إعادة التحقق كل 60 ثانية. |
| 404 | صفحة «الصفحة غير موجودة» مع رابط «العودة للرئيسية» |

---

## نقاط نهاية الـ API

- **GET `/api/hotels`** — قائمة الفنادق (مع pagination).  
  - الوضع الوهمي: معاملات `page`, `limit`, `sw_lat`, `sw_lng`, `ne_lat`, `ne_lng`.  
  - SearchApi: `q`, `check_in_date`, `check_out_date`, `adults`, `next_page_token`.  
  - الاستجابة: `{ results, nextPage, total }`.

- **GET `/api/hotels/[id]`** — فندق واحد + فنادق مقترحة.  
  - الاستجابة: `{ hotel, recommended }`.

- **GET `/api/geocode?q=<الموقع>`** — تحويل الموقع عبر Nominatim.  
  - الاستجابة: `{ lat, lng, bounds }` أو رسالة خطأ.

---

## الاختبارات

```bash
npm test
npm run test:watch
```

الاختبارات موجودة تحت `__tests__/` وتستخدم Jest مع React Testing Library (مثل `HotelCard`, `SearchForm`).

---

## رؤوس الأمان (Security Headers)

يُعرّف `next.config.ts` التالي:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cross-Origin-Opener-Policy: same-origin`

---

## نطاقات الصور

يسمح `images.remotePatterns` في Next.js بـ: Unsplash، Google (streetviewpixels، lh3–6، encrypted-tbn0)، cdn.worldota.net. يمكن تعديل `next.config.ts` عند إضافة مصادر صور جديدة.

---

## الترخيص

استخدام خاص. يُطبّق وفق شروط المشروع.

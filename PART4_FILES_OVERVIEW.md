# 📂 الجزء الرابع: الملفات الهامة وشرح كامل

## 📁 خريطة الملفات:

```
ecommerce-dashboard/
│
├── src/
│   ├── api/                          (طلبات API والبيانات)
│   │   ├── auth.ts                   ⭐ دخول المستخدم + MOCK_ACCOUNTS
│   │   ├── client.ts                 (الـ Axios client)
│   │   ├── admin/index.ts            (بيانات Admin)
│   │   ├── store/index.ts            (بيانات Store)
│   │   └── driver/index.ts           (بيانات Driver)
│   │
│   ├── components/
│   │   ├── layout/                   (التخطيطات)
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── StoreLayout.tsx
│   │   │   └── DriverLayout.tsx
│   │   │
│   │   └── ui/                       (مكونات صغيرة)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── ... (UI components)
│   │
│   ├── pages/                        ⭐ الصفحات الرئيسية
│   │   ├── auth/
│   │   │   ├── Login.tsx             ⭐ صفحة تسجيل الدخول
│   │   │   ├── NotFound.tsx
│   │   │   └── Forbidden.tsx
│   │   │
│   │   ├── admin/                    (صفحات الإدارة)
│   │   │   ├── users/Users.tsx
│   │   │   ├── catalog/Products.tsx
│   │   │   └── ... (صفحات أخرى)
│   │   │
│   │   ├── store/                    ⭐ صفحات المتجر
│   │   │   ├── Dashboard.tsx         ⭐ لوحة تحكم المتجر
│   │   │   ├── Orders.tsx            ⭐ قائمة الطلبات
│   │   │   ├── OrderDetail.tsx       ⭐ تفاصيل الطلب
│   │   │   ├── Inventory.tsx         ⭐ المخزون
│   │   │   └── Chat.tsx              ⭐ الرسائل
│   │   │
│   │   └── driver/                   (صفحات السائق)
│   │       ├── Home.tsx
│   │       ├── Deliveries.tsx
│   │       └── Profile.tsx
│   │
│   ├── store/                        ⭐ Redux State Management
│   │   ├── index.ts                  (إعدادات Redux)
│   │   └── slices/
│   │       ├── authSlice.ts          ⭐ بيانات المستخدم
│   │       ├── notificationsSlice.ts (الإشعارات)
│   │       └── uiSlice.ts            (حالة الواجهة)
│   │
│   ├── types/                        (أنواع TypeScript)
│   │   ├── auth.ts                   ⭐ أنواع المستخدم والـ tokens
│   │   ├── common.ts                 (أنواع عامة)
│   │   ├── order.ts                  (أنواع الطلب)
│   │   └── product.ts                (أنواع المنتج)
│   │
│   ├── hooks/                        (Hooks مخصصة)
│   │   ├── useAuth.ts                (معلومات المستخدم)
│   │   ├── usePagination.ts          (التصفح)
│   │   └── useToast.ts               (الإشعارات)
│   │
│   ├── routes/                       ⭐ التوجيه
│   │   ├── index.tsx                 ⭐ جميع الطرق (Routes)
│   │   └── ProtectedRoute.tsx        ⭐ صفحات محمية
│   │
│   ├── i18n/                         (اللغات)
│   │   ├── en.ts                     (إنجليزي)
│   │   ├── ar.ts                     (عربي)
│   │   └── index.ts                  (إعدادات اللغة)
│   │
│   ├── App.tsx                       (المكون الرئيسي)
│   ├── main.tsx                      (نقطة البداية)
│   └── index.css                     (الأنماط العامة)
│
├── index.html                        (ملف HTML الأساسي)
├── vite.config.ts                    (إعدادات Vite)
├── tsconfig.json                     (إعدادات TypeScript)
├── tailwind.config.js                (إعدادات Tailwind)
├── package.json                      (Dependencies)
└── README.md                         (التوثيق)
```

---

## ⭐ الملفات الأساسية (يجب أن تفهمها):

### **1️⃣ src/api/auth.ts**

**الوظيفة:** 
- حفظ قائمة الحسابات الموك
- معالجة عملية تسجيل الدخول
- إنشاء الـ tokens

```typescript
// ✅ يجب أن تعدل هنا إذا أردت:
// - إضافة حسابات جديدة
// - تغيير الباسورد
// - تغيير البيانات المرتجعة
```

**مثال - إضافة حساب جديد:**
```typescript
const MOCK_ACCOUNTS = [
  // الحسابات الحالية...
  
  // ← أضف حسابك هنا
  { 
    email: 'yasmin@store.com', 
    password: 'yasmin123', 
    name: 'Yasmin Manager', 
    role: 'store_manager',
    storeId: '5',
    storeName: 'New Branch'
  },
]
```

---

### **2️⃣ src/types/auth.ts**

**الوظيفة:**
- تعريف أنواع البيانات
- تعريف الأدوار والأنواع

```typescript
// ✅ الأنواع المهمة:
type UserRole = 'super_admin' | 'store_manager' | 'driver' | ...
interface AuthUser { id, name, email, role, storeId, storeName, ... }
interface AuthTokens { accessToken, refreshToken, expiresIn }
```

---

### **3️⃣ src/store/slices/authSlice.ts**

**الوظيفة:**
- حفظ بيانات المستخدم في Redux
- توفير المختارات للوصول للبيانات

```typescript
// ✅ العمليات المتاحة:
setCredentials()      // حفظ بعد الدخول
logout()              // حذف بعد الخروج
setLoading()          // تحديث حالة التحميل
setError()            // تحديث رسالة الخطأ

// ✅ المختارات:
selectUser()          // جلب بيانات المستخدم
selectIsAuthenticated() // هل مسجل دخول؟
selectUserRole()      // جلب الدور
selectHasPermission() // التحقق من صلاحية
```

---

### **4️⃣ src/routes/index.tsx**

**الوظيفة:**
- تعريف جميع الطرق (Routes)
- توجيه المستخدم حسب دوره

```typescript
// ✅ ما يحصل:
1. /login → Login component
2. /store/* → Store routes (محمية)
3. /admin/* → Admin routes (محمية)
4. /driver/* → Driver routes (محمية)

// ✅ الحماية:
- بدون دخول → اذهب لـ /login
- دخول → اذهب للصفحة المناسبة
```

---

### **5️⃣ src/pages/store/Dashboard.tsx**

**الوظيفة:**
- عرض إحصائيات الفرع
- عرض الطلبات الجديدة
- عرض الطلبات النشطة

```typescript
// ✅ الخطوات:
1. جلب storeId من Redux
2. تصفية MOCK_ORDERS
3. حساب الإحصائيات
4. عرض البيانات
```

---

### **6️⃣ src/pages/store/Orders.tsx**

**الوظيفة:**
- عرض قائمة جميع الطلبات
- تصفية حسب الحالة والبحث
- التحكم في الطلب

```typescript
// ✅ الفلترة:
1. storeId (الأساسي)
2. status (new, accepted, etc)
3. search (البحث عن طلب)
4. deliveryType (فوري أو موعد)
```

---

### **7️⃣ src/pages/store/Inventory.tsx**

**الوظيفة:**
- عرض المنتجات والمخزون
- تنبيهات المخزون
- تصفية حسب التصنيف

```typescript
// ✅ المعلومات:
- اسم المنتج
- التصنيف (Dairy, Bakery, etc)
- المخزون الحالي
- تحذيرات (Out of Stock, Low Stock)
```

---

### **8️⃣ src/pages/store/Chat.tsx**

**الوظيفة:**
- عرض المحادثات مع العملاء
- إرسال واستقبال الرسائل
- عداد الرسائل غير المقروءة

```typescript
// ✅ الميزات:
- قائمة المحادثات
- رسائل غير مقروءة
- محادثة مع العميل
```

---

### **9️⃣ src/pages/store/OrderDetail.tsx**

**الوظيفة:**
- عرض تفاصيل طلب واحد
- معلومات العميل والعنوان
- قائمة المنتجات
- التحكم في الطلب

```typescript
// ✅ الإجراءات:
- قبول الطلب
- رفض الطلب
- اختيار سائق
- تحديث الحالة
```

---

## 🔗 العلاقات بين الملفات:

```
┌─────────────────────────────────────────────────────────┐
│ App.tsx (الجذر)                                         │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────────┐ ┌───────▼──────────────┐
│ Routes.tsx           │ │ Store (Redux)        │
│ - اختيار الصفحة      │ │ - حفظ البيانات       │
└────────┬─────────────┘ └──────────────────────┘
         │
    ┌────┴────┬────────┬────────┐
    │          │        │        │
┌──▼──┐ ┌────▼─┐ ┌───▼──┐ ┌──▼──┐
│Login│ │Store │ │Admin │ │Driver│
│     │ │Pages │ │Pages │ │Pages │
└─────┘ └──────┘ └──────┘ └──────┘
    │       │
    │   ┌───┴──────┬──────┬──────┐
    │   │          │      │      │
    └──►│Dashboard │Orders│Chat  │
        │Inventory │Detail│      │
        └──────────┴──────┴──────┘
```

---

## 📊 البيانات الموك والتصفية:

```typescript
// كل مكان تشوف MOCK_ORDERS أو MOCK أو MOCK_THREADS
// ستجد تصفية مثل هذه:

const storeId = user?.storeId || '1'
const filteredData = MOCK.filter(item => item.storeId === storeId)

// ← هذا هو السر!
```

---

## 🎯 الخطوات للفهم الكامل:

### **1️⃣ فهم المسار:**
```
User Login → auth.ts → Redux → Routes → Dashboard
```

### **2️⃣ فهم البيانات:**
```
MOCK_ACCOUNTS → User Data → Redux Store → Components
```

### **3️⃣ فهم التصفية:**
```
All Data → Filter by storeId → Store Data → Display
```

### **4️⃣ فهم الحماية:**
```
Check isAuthenticated → Check storeId → Allow/Deny
```

---

## 💡 نصائح للتطوير:

### **إضافة حساب جديد:**
```typescript
// 1. افتح auth.ts
// 2. أضف لـ MOCK_ACCOUNTS:
{ 
  email: 'newuser@store.com', 
  password: 'pass123', 
  name: 'New User', 
  role: 'store_manager',
  storeId: '5',
  storeName: 'New Branch'
}
```

### **إضافة فرع جديد:**
```typescript
// 1. الحساب بـ storeId: '5'
// 2. أضف لـ MOCK_ORDERS: storeId: '5'
// 3. أضف لـ MOCK (Inventory): storeId: '5'
// 4. اختبر!
```

### **إضافة صفحة جديدة:**
```typescript
// 1. أنشئ الملف: src/pages/store/NewPage.tsx
// 2. أضف الـ Route فـ routes/index.tsx
// 3. جلب storeId: const user = useAppSelector(selectUser)
// 4. صفّي البيانات: filter(item => item.storeId === storeId)
```

---

## 🚀 الخلاصة:

```
✅ فهمت auth.ts؟ → عرفت كيف يدخل المستخدم
✅ فهمت Redux؟ → عرفت كيف تُحفظ البيانات
✅ فهمت التصفية؟ → عرفت كيف كل فرع يشوف بياناته
✅ فهمت الملفات؟ → عرفت أين تعدل

أنت جاهز للتطوير! 🎉
```

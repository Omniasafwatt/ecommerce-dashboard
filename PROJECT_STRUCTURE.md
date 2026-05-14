# 📋 شرح الهيكل الكامل للمشروع

## 🏗️ **البنية العامة للمشروع**

```
ecommerce-dashboard/
├── src/
│   ├── api/              (طلبات الـ API والبيانات)
│   ├── components/       (مكونات قابلة للإعادة)
│   ├── pages/            (الصفحات الرئيسية)
│   ├── store/            (Redux - إدارة الحالة)
│   ├── types/            (تعريفات TypeScript)
│   ├── hooks/            (Hooks مخصصة)
│   ├── i18n/             (اللغات - عربي/إنجليزي)
│   └── App.tsx           (التطبيق الرئيسي)
├── index.html            (ملف HTML الأساسي)
├── vite.config.ts        (إعدادات Vite)
└── package.json          (الـ Dependencies)
```

---

## 🔐 **الجزء الأول: نظام الدخول (Authentication)**

### **1. الملف الرئيسي: `src/api/auth.ts`**

**المسؤول عن:** جلب بيانات تسجيل الدخول والتحقق من بيانات المستخدم

```typescript
// الحسابات الموك (للتطوير فقط)
const MOCK_ACCOUNTS = [
  { 
    email: 'admin@store.com', 
    password: 'admin123', 
    name: 'Admin User', 
    role: 'super_admin',
    storeId: undefined,  // Admin بدون store محدد
    storeName: undefined
  },
  { 
    email: 'ahmed@store.com', 
    password: 'ahmed123', 
    name: 'Ahmed Manager', 
    role: 'store_manager',
    storeId: '1',        // Salmiya Branch
    storeName: 'Salmiya Branch'
  },
  // ... الحسابات الأخرى
]
```

**الدالة الرئيسية:**
```typescript
export const login = async (data: LoginRequest) => {
  // في الـ Development: استخدم MOCK data
  // في الـ Production: استخدم API الحقيقي
}
```

---

## 👤 **الجزء الثاني: أنواع البيانات (Types)**

### **الملف: `src/types/auth.ts`**

**يعرّف كل أنواع البيانات المتعلقة بالمستخدم:**

```typescript
// أنواع الأدوار المتاحة
type UserRole = 
  | 'super_admin'          // مدير عام
  | 'operations_admin'     // مدير العمليات
  | 'catalog_manager'      // مدير الكتالوج
  | 'store_manager'        // مدير متجر
  | 'driver'               // سائق
  | 'finance'              // مالية
  | 'support'              // دعم العملاء
  | 'marketing'            // تسويق

// بيانات المستخدم المسجل
interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  storeId?: string         // معرف الفرع (للمدراء فقط)
  storeName?: string       // اسم الفرع (مثل "Salmiya Branch")
  permissions: string[]
}

// الـ Tokens للمصادقة
interface AuthTokens {
  accessToken: string      // توكن الوصول
  refreshToken: string     // توكن التحديث
  expiresIn: number        // مدة الصلاحية بالثواني
}
```

---

## 📦 **الجزء الثالث: إدارة الحالة (Redux)**

### **الملف: `src/store/slices/authSlice.ts`**

**المسؤول عن:** حفظ بيانات المستخدم والـ tokens في الذاكرة (Redux)

```typescript
const initialState: AuthState = {
  user: null,              // بيانات المستخدم الحالي
  tokens: null,            // الـ tokens
  isAuthenticated: false,  // هل المستخدم مسجل دخول؟
  isLoading: false,        // هل يتم تحميل البيانات؟
  error: null              // رسالة خطأ
}

// الأفعال (Actions)
setCredentials()  // حفظ بيانات المستخدم بعد الدخول
logout()          // حذف البيانات عند الخروج
setLoading()      // تعيين حالة التحميل
setError()        // تعيين رسالة الخطأ
```

---

## 🔀 **الجزء الرابع: نظام التوجيه (Routes)**

### **الملف: `src/routes/index.tsx`**

**المسؤول عن:** التحكم في الصفحات والتوجيه حسب الدور

```typescript
// كل دور له dashboard مختلف:
if (role === 'driver')          → /driver/home
else if (role === 'store_manager') → /store/dashboard
else                            → /admin/dashboard
```

### **الملف: `src/routes/ProtectedRoute.tsx`**

**المسؤول عن:** حماية الصفحات - لا تدخل بدون تسجيل دخول

```typescript
// إذا المستخدم مش مسجل دخول → اروح لصفحة Login
// إذا مسجل دخول → دخول الصفحة المطلوبة
```

---

## 🏪 **الجزء الخامس: صفحات المتجر (Store Pages)**

### **1. Dashboard (`src/pages/store/Dashboard.tsx`)**

```
ما الذي يعرضه؟
├── إحصائيات الطلبات
│   ├── طلبات جديدة
│   ├── مقبولة
│   ├── قيد الإعداد
│   └── ...
├── الطلبات الجديدة التي تحتاج إجراء
└── جميع الطلبات النشطة

كيف يعمل؟
1. جلب storeId من Redux (من بيانات المستخدم)
2. تصفية MOCK data حسب storeId
3. عرض البيانات الخاصة بـ store المتجر فقط
```

### **2. Orders (`src/pages/store/Orders.tsx`)**

```
ما الذي يعرضه؟
├── قائمة جميع الطلبات
├── تصفية حسب الحالة (جديد، مقبول، إلخ)
├── بحث عن طلب معين
└── خيارات للتحكم في كل طلب

الفلترة:
- storeId: عرض طلبات الفرع فقط
- status: تصفية حسب حالة الطلب
- search: البحث عن طلب أو عميل
- deliveryType: فوري أو موعد محدد
```

### **3. Inventory (`src/pages/store/Inventory.tsx`)**

```
ما الذي يعرضه؟
├── قائمة المنتجات والمخزون
├── التصنيفات (Dairy, Bakery, etc)
├── تنبيهات المخزون
│   ├── Out of Stock (أحمر)
│   └── Low Stock (أصفر)
└── معلومات آخر مزامنة

الفلترة:
- storeId: عرض مخزون الفرع فقط
- category: تصفية حسب نوع المنتج
- stock status: بحث حسب حالة المخزون
```

### **4. Chat (`src/pages/store/Chat.tsx`)**

```
ما الذي يعرضه؟
├── قائمة المحادثات (Threads)
├── رسائل غير مقروءة
└── محادثة مع العميل

الفلترة:
- storeId: عرض محادثات الفرع فقط
```

### **5. OrderDetail (`src/pages/store/OrderDetail.tsx`)**

```
ما الذي يعرضه؟
├── تفاصيل كاملة للطلب
├── معلومات العميل والعنوان
├── قائمة المنتجات والأسعار
├── الحالة الحالية والسجل
├── خيارات السائق
└── أزرار للتحكم (قبول، رفض، إرسال)

الحماية:
- التحقق من storeId: تأكد أن الطلب للفرع الحالي
```

---

## 🔄 **الجزء السادس: تدفق العمل الكامل (Flow)**

### **1️⃣ ما يحصل عند الضغط على "Login":**

```
User Input (email/password)
        ↓
Login Component
        ↓
auth.ts: login() function
        ↓
MOCK_ACCOUNTS: البحث عن الحساب
        ↓
Login Successful?
    ├─ YES → Create Tokens
    │   ├─ accessToken
    │   ├─ refreshToken
    │   └─ userData (name, email, role, storeId)
    │
    └─ NO → Show Error Message
        └─ "Invalid email or password"

        ↓
Redux (authSlice): setCredentials()
        ├─ Save user in state
        ├─ Save tokens in localStorage
        └─ isAuthenticated = true

        ↓
Navigation (routes/index.tsx)
        ├─ If driver → /driver/home
        ├─ If store_manager → /store/dashboard
        └─ If admin → /admin/dashboard
```

### **2️⃣ ما يحصل عند فتح صفحة Dashboard:**

```
User Navigates to /store/dashboard
        ↓
Dashboard Component Loads
        ↓
useAppSelector(selectUser) → جلب بيانات المستخدم
        ↓
const storeId = user?.storeId || '1'
        ↓
Filter MOCK_ORDERS by storeId
        ↓
Display Only Orders for This Store
```

---

## 📊 **الجزء السابع: البيانات الموك (Mock Data)**

### **هيكل البيانات:**

```typescript
// كل عنصر بيانات يحتوي على storeId
const MOCK_ORDERS = [
  {
    id: 1,
    storeId: '1',         // ← هذا مهم جداً
    orderNumber: 'ORD-2025-0011',
    customer: 'Sara Al-Hajj',
    status: 'new',
    // ... بيانات أخرى
  },
  {
    id: 2,
    storeId: '2',         // ← فرع مختلف
    orderNumber: 'ORD-2025-0010',
    // ...
  }
]

// الفلترة:
const storeOrders = orders.filter(o => o.storeId === storeId)
//                                            ↑
//                                      المقارنة المهمة
```

---

## 🎯 **الجزء الثامن: الملفات المهمة جداً**

| الملف | الوظيفة | مثال |
|------|--------|-------|
| `src/api/auth.ts` | دخول المستخدم | التحقق من البيانات |
| `src/types/auth.ts` | أنواع البيانات | تعريف UserRole |
| `src/store/slices/authSlice.ts` | حفظ البيانات | setCredentials() |
| `src/routes/index.tsx` | التوجيه | أي صفحة = أي دور |
| `src/pages/store/*.tsx` | صفحات المتجر | Dashboard, Orders, etc |

---

## 🚀 **الجزء التاسع: كيفية الاختبار**

### **اختبر كل حساب:**

```bash
📧 Email: ahmed@store.com
🔑 Password: ahmed123
↓
✅ تسجيل دخول → /store/dashboard
↓
👀 عرض البيانات → Salmiya Branch فقط
```

```bash
📧 Email: fatima@store.com
🔑 Password: fatima123
↓
✅ تسجيل دخول → /store/dashboard
↓
👀 عرض البيانات → Kuwait City Branch فقط
```

---

## 💡 **نصائح مهمة:**

1. **storeId هو المفتاح**: كل شيء يدور حوله
2. **Redux يحفظ البيانات**: لا تفقدها عند تحديث الصفحة
3. **MOCK data للتطوير**: قابل للتغيير في أي وقت
4. **Types تحمي الكود**: لا توجد أخطاء خفية

---

## 🔗 **العلاقات بين الملفات:**

```
┌─────────────────────────────────────────────────────┐
│ Login.tsx (الصفحة)                                  │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ auth.ts (API/Mock)                                  │
│ - mockLogin()                                       │
│ - MOCK_ACCOUNTS                                     │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ authSlice.ts (Redux)                                │
│ - setCredentials()                                  │
│ - حفظ البيانات في الذاكرة                           │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ routes/index.tsx (التوجيه)                          │
│ - اختيار الصفحة حسب الدور                            │
└──────────────┬──────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────┐
│ Dashboard.tsx / Orders.tsx / etc                    │
│ - جلب storeId من Redux                              │
│ - تصفية البيانات                                    │
│ - عرض على الشاشة                                     │
└─────────────────────────────────────────────────────┘
```

---

**الآن أنت تفهم الكود كاملاً! 🎓**

اسأل لو في أي جزء مش واضح... 👍

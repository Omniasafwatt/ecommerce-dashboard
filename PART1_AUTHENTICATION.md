# 🔐 الجزء الأول: نظام الدخول (Authentication)

## 📍 الملفات المتعلقة:

1. `src/pages/auth/Login.tsx` - صفحة تسجيل الدخول
2. `src/api/auth.ts` - دوال الدخول والبيانات الموك
3. `src/types/auth.ts` - أنواع البيانات

---

## 🎯 كيف يعمل نظام الدخول؟

### **الخطوة 1️⃣: المستخدم يكتب البيانات**

```tsx
// في Login.tsx
<form onSubmit={handleSubmit}>
  <input 
    type="email" 
    placeholder="البريد الإلكتروني"
    {...register('email')}
  />
  
  <input 
    type="password" 
    placeholder="كلمة المرور"
    {...register('password')}
  />
  
  <button type="submit">دخول</button>
</form>
```

**ما يحصل هنا:**
- المستخدم يكتب email و password
- React Hook Form يحفظ البيانات
- Zod يتحقق من صحة البيانات (format)

---

### **الخطوة 2️⃣: التحقق من البيانات**

```typescript
// Validation Schema (Zod)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Minimum 6 characters'),
})

// ما يفعله:
// ✅ email يجب أن يكون صيغة صحيحة (مثل: test@example.com)
// ✅ password يجب أن يكون أطول من 6 أحرف
```

---

### **الخطوة 3️⃣: إرسال البيانات للدالة login()**

```typescript
// في Login.tsx
const { mutate: loginMutate } = useMutation({
  mutationFn: (data) => loginApi(data),  // ← الدالة تحت
  onSuccess: (response) => {
    // نجح الدخول
    const user = response.data.user
    const tokens = response.data.tokens
    
    // حفظ البيانات
    dispatch(setCredentials({ user, tokens }))
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  },
  onError: (error) => {
    // فشل الدخول - عرض رسالة خطأ
    console.error(error.message)
  }
})

// عند الضغط على الزر
const onSubmit = (values) => {
  loginMutate({ email: values.email, password: values.password })
}
```

---

### **الخطوة 4️⃣: البحث عن الحساب (في auth.ts)**

```typescript
// في src/api/auth.ts

// 1. قائمة الحسابات الموك
const MOCK_ACCOUNTS = [
  { 
    email: 'admin@store.com', 
    password: 'admin123', 
    name: 'Admin User', 
    role: 'super_admin'
  },
  { 
    email: 'ahmed@store.com', 
    password: 'ahmed123', 
    name: 'Ahmed Manager', 
    role: 'store_manager',
    storeId: '1',
    storeName: 'Salmiya Branch'
  },
  // ... المزيد
]

// 2. دالة البحث والتحقق
const mockLogin = async (email: string, password: string) => {
  // انتظر 800ms لمحاكاة التأخير
  await new Promise(resolve => setTimeout(resolve, 800))

  // ابحث عن الحساب في MOCK_ACCOUNTS
  const account = MOCK_ACCOUNTS.find(acc => 
    acc.email === email && acc.password === password
  )
  
  // لم تجد الحساب؟
  if (!account) {
    throw new Error('Invalid email or password')
  }

  // تم العثور عليه! أنشئ بيانات المستخدم
  const user: AuthUser = {
    id: Math.random().toString(36).substr(2, 9),  // معرف عشوائي
    name: account.name,
    email: account.email,
    role: account.role,
    storeId: account.storeId,      // معرف الفرع (إن وجد)
    storeName: account.storeName,  // اسم الفرع
    permissions: ['read', 'write']
  }

  // أنشئ الـ tokens
  const tokens = {
    accessToken: 'mock_' + Math.random().toString(36).substr(2, 20),
    refreshToken: 'refresh_' + Math.random().toString(36).substr(2, 20),
    expiresIn: 3600  // 1 ساعة
  }

  // أرجع البيانات
  return {
    success: true,
    message: 'Login successful',
    data: { user, tokens }
  }
}

// 3. الدالة الرئيسية login()
export const login = async (data: LoginRequest) => {
  try {
    // في بيئة Development: استخدم Mock
    if (import.meta.env.VITE_APP_ENV !== 'production') {
      return await mockLogin(data.email, data.password)
    }

    // في Production: استخدم API الحقيقي
    const response = await apiClient.post('/auth/login', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Login failed')
  }
}
```

---

## 💾 الخطوة 5️⃣: حفظ البيانات في Redux

```typescript
// في authSlice.ts

// عند نجاح الدخول، يتم استدعاء:
dispatch(setCredentials({ user, tokens }))

// هذا ما يحفظ في الذاكرة:
{
  user: {
    id: 'abc123',
    name: 'Ahmed Manager',
    email: 'ahmed@store.com',
    role: 'store_manager',
    storeId: '1',           // ← مهم جداً
    storeName: 'Salmiya Branch',
    permissions: ['read', 'write']
  },
  tokens: {
    accessToken: 'mock_xyz...',
    refreshToken: 'refresh_abc...',
    expiresIn: 3600
  },
  isAuthenticated: true    // ← هذا يسمح بالدخول
}
```

---

## 🗝️ الخطوة 6️⃣: التوجيه حسب الدور

```typescript
// في Login.tsx - بعد الدخول الناجح

const role = data.user.role

if (role === 'driver') {
  // سائق → اذهب لصفحة السائق
  navigate('/driver/home')
}
else if (role === 'store_manager') {
  // مدير متجر → اذهب لـ dashboard المتجر
  navigate('/store/dashboard')
}
else {
  // أي admin → اذهب لـ admin dashboard
  navigate('/admin/dashboard')
}
```

---

## 🔓 التحقق من تسجيل الدخول في الصفحات

```typescript
// في أي صفحة مثل Dashboard.tsx

import { useAppSelector } from '@/store'
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice'

function Dashboard() {
  // جلب بيانات المستخدم من Redux
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    // لم يسجل دخول → اذهب لصفحة اللوجن
    return <Navigate to="/login" />
  }

  // حصلنا على البيانات
  const storeId = user?.storeId || '1'
  const storeName = user?.storeName || 'Store'

  return (
    <div>
      <h1>مرحباً {user?.name}</h1>
      <p>فرعك: {storeName}</p>
    </div>
  )
}
```

---

## 📝 ملخص ما يحصل:

```
1. المستخدم يدخل email + password
         ↓
2. التحقق من الصيغة (Zod)
         ↓
3. إرسال للدالة login() في auth.ts
         ↓
4. البحث في MOCK_ACCOUNTS
         ↓
5. إنشاء tokens وبيانات المستخدم
         ↓
6. حفظ في Redux و localStorage
         ↓
7. التوجيه حسب الدور:
   - driver → /driver/home
   - store_manager → /store/dashboard
   - admin → /admin/dashboard
```

---

## 🧪 اختبر الآن:

```
✅ Email: ahmed@store.com
✅ Password: ahmed123
↓
ستدخل لـ /store/dashboard
وستشوف بيانات Salmiya Branch فقط
```

```
✅ Email: fatima@store.com
✅ Password: fatima123
↓
ستدخل لـ /store/dashboard
وستشوف بيانات Kuwait City Branch فقط
```

**كل حساب يشوف البيانات بتاعته فقط!** 🎯

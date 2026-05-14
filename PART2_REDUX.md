# 📦 الجزء الثاني: Redux وإدارة الحالة

## 📍 الملفات المتعلقة:

1. `src/store/index.ts` - إعدادات Redux الرئيسية
2. `src/store/slices/authSlice.ts` - إدارة بيانات المستخدم
3. `src/hooks/` - Hooks للوصول للبيانات

---

## 🤔 لماذا Redux؟

**المشكلة بدون Redux:**
```
Component 1 → مستخدم لديه بيانات
    ↓
Component 2 → يريد نفس البيانات؟ سؤال الأب
    ↓
Component 3 → يريد نفس البيانات؟ سؤال الجد
    ↓
مشكلة: الكود يصير معقد جداً ❌
```

**الحل مع Redux:**
```
┌─────────────────────────────────────────┐
│         Redux Store (المخزن)            │
│  ┌─────────────────────────────────────┐│
│  │  user: { name, email, role, ... }  ││
│  │  tokens: { accessToken, ... }      ││
│  │  isAuthenticated: true              ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
         ↑        ↑        ↑
      Component 1, 2, 3 يسحبون البيانات مباشرة ✅
```

---

## 🏗️ كيفية عمل Redux؟

### **الخطوة 1️⃣: الحالة الأولية (initialState)**

```typescript
// في authSlice.ts
const initialState: AuthState = {
  user: null,                    // لا يوجد مستخدم حالياً
  tokens: null,                  // لا توجد tokens
  isAuthenticated: false,        // لم يسجل دخول
  isLoading: false,              // لا يتحميل بيانات
  error: null                    // لا توجد أخطاء
}
```

**ترجمة:**
- عند بدء التطبيق: المستخدم لم يسجل دخول بعد
- جميع البيانات فارغة
- جاهز للدخول

---

### **الخطوة 2️⃣: الأفعال (Reducers)**

```typescript
// الأفعال المتاحة:

// 1️⃣ setCredentials - عند نجاح الدخول
dispatch(setCredentials({ 
  user: { 
    id: 'abc123',
    name: 'Ahmed',
    email: 'ahmed@store.com',
    role: 'store_manager',
    storeId: '1',
    storeName: 'Salmiya Branch',
    permissions: ['read', 'write']
  },
  tokens: {
    accessToken: 'token_xyz',
    refreshToken: 'refresh_abc',
    expiresIn: 3600
  }
}))

// النتيجة:
state = {
  user: { /* جميع البيانات أعلاه */ },
  tokens: { /* جميع الـ tokens */ },
  isAuthenticated: true,  // ✅ الآن مسجل دخول
  isLoading: false,
  error: null
}
```

```typescript
// 2️⃣ logout - عند الخروج
dispatch(logout())

// النتيجة:
state = {
  user: null,              // حذف البيانات
  tokens: null,            // حذف الـ tokens
  isAuthenticated: false,  // ليس مسجل دخول
  isLoading: false,
  error: null
}
```

```typescript
// 3️⃣ setLoading - عند التحميل
dispatch(setLoading(true))

// النتيجة:
state = {
  ...،
  isLoading: true  // يعني "جاري التحميل"
}
```

```typescript
// 4️⃣ setError - عند الخطأ
dispatch(setError('Invalid credentials'))

// النتيجة:
state = {
  ...،
  error: 'Invalid credentials',
  isLoading: false
}
```

---

### **الخطوة 3️⃣: المختارات (Selectors)**

```typescript
// المختارات تسحب البيانات من الـ state

// سحب بيانات المستخدم
export const selectUser = (state: RootState) => state.auth.user
// ← تأخذ كل بيانات المستخدم

// سحب الـ tokens
export const selectTokens = (state: RootState) => state.auth.tokens
// ← تأخذ التوكنات

// سحب حالة التسجيل
export const selectIsAuthenticated = (state: RootState) => 
  state.auth.isAuthenticated
// ← تأخذ true أو false

// سحب الدور
export const selectUserRole = (state: RootState) => 
  state.auth.user?.role
// ← تأخذ 'store_manager' أو غيره

// التحقق من صلاحية معينة
export const selectHasPermission = (permission: string) => 
  (state: RootState) => 
    state.auth.user?.permissions.includes(permission) ?? false
// ← true إذا لديه الصلاحية
```

---

## 🎯 الاستخدام العملي

### **في أي Component:**

```tsx
import { useAppSelector } from '@/store'
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice'

function Dashboard() {
  // الطريقة 1: جلب كل بيانات المستخدم
  const user = useAppSelector(selectUser)

  // الطريقة 2: التحقق من التسجيل
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // الآن لديك البيانات:
  if (!isAuthenticated) {
    return <div>Please login first</div>
  }

  return (
    <div>
      <h1>Hello {user?.name}</h1>
      <p>Store: {user?.storeName}</p>
      <p>Your storeId: {user?.storeId}</p>
    </div>
  )
}
```

---

## 📊 شكل البيانات في Redux

```typescript
// هذا ما يحفظ في Redux بعد الدخول:

{
  auth: {
    user: {
      id: "abc123",
      name: "Ahmed Manager",
      email: "ahmed@store.com",
      role: "store_manager",
      storeId: "1",                    // ← المفتاح!
      storeName: "Salmiya Branch",
      permissions: ["read", "write"]
    },
    tokens: {
      accessToken: "mock_xyz...",
      refreshToken: "refresh_abc...",
      expiresIn: 3600
    },
    isAuthenticated: true,
    isLoading: false,
    error: null
  }
}
```

---

## 🔄 مثال متكامل: Dashboard.tsx

```typescript
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import { useState } from 'react'

function StoreDashboard() {
  // 1. جلب بيانات المستخدم من Redux
  const user = useAppSelector(selectUser)
  
  // 2. استخراج storeId
  const storeId = user?.storeId || '1'
  const storeName = user?.storeName || 'Store'

  // 3. البيانات الموك
  const [orders, setOrders] = useState<StoreOrder[]>(MOCK_ORDERS)

  // 4. تصفية البيانات حسب storeId
  const storeOrders = orders.filter(o => o.storeId === storeId)

  // 5. الحسابات
  const counts = {
    new: storeOrders.filter(o => o.status === 'new').length,
    accepted: storeOrders.filter(o => o.status === 'accepted').length,
    // ... المزيد
  }

  // 6. العرض
  return (
    <div>
      <h1>Store Overview</h1>
      <p>{storeName}</p>
      
      <div>
        <p>New Orders: {counts.new}</p>
        <p>Accepted: {counts.accepted}</p>
      </div>

      <OrdersList orders={storeOrders} />
    </div>
  )
}
```

---

## 💾 حفظ البيانات في localStorage

```typescript
// عند الدخول الناجح:

// حفظ الـ tokens في localStorage (للبقاء مسجل دخول)
localStorage.setItem('accessToken', tokens.accessToken)
localStorage.setItem('refreshToken', tokens.refreshToken)

// عند الخروج:
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')

// الفائدة:
// - تحديث الصفحة → البيانات لم تختفي
// - يمكن استخدام الـ tokens بدون تسجيل دخول مرة أخرى
```

---

## 🛡️ خاصية الحماية: Protected Routes

```typescript
// في routes/ProtectedRoute.tsx

function ProtectedRoute({ children }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // إذا لم يسجل دخول:
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // إذا سجل دخول:
  return children
}

// الاستخدام:
<Routes>
  <Route path="/login" element={<Login />} />
  
  <Route element={<ProtectedRoute>}>
    <Route path="/store/dashboard" element={<StoreDashboard />} />
    <Route path="/store/orders" element={<StoreOrders />} />
    {/* باقي الصفحات */}
  </Route>
</Routes>
```

---

## 📝 ملخص Redux:

```
1. Initial State
   ↓
2. User logs in
   ↓
3. setCredentials() saves data
   ↓
4. Redux Store is updated
   ↓
5. Components use selectUser() to get data
   ↓
6. UI re-renders with new data
   ↓
7. User logs out
   ↓
8. logout() clears data
   ↓
9. Back to Initial State
```

---

## 🎯 المفتاح لفهم Redux:

```
┌──────────────────────────────────────┐
│ Redux Store (مخزن البيانات المركزي)  │
│                                      │
│ Reducers تُغيّر البيانات           │
│ Selectors تسحب البيانات             │
│ Dispatch يستدعي Reducers           │
└──────────────────────────────────────┘
```

**الفائدة:**
- بيانات واحدة للتطبيق كله
- سهل التتبع والتصحيح
- لا حاجة لـ prop drilling
- يسهل إضافة features جديدة

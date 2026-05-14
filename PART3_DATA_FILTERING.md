# 🎯 الجزء الثالث: البيانات والتصفية حسب storeId

## 📍 المشكلة الأساسية:

```
قبل التعديل:
- fatima@store.com (Kuwait City Branch) تشوف بيانات Salmiya ❌
- ahmed@store.com (Salmiya Branch) تشوف بيانات Kuwait City ❌
- البيانات مختلطة!

بعد التعديل:
- fatima@store.com → بيانات Kuwait City Branch فقط ✅
- ahmed@store.com → بيانات Salmiya Branch فقط ✅
```

---

## 🔑 الحل: إضافة storeId لكل بيانات

### **1️⃣ بيانات الطلبات (Orders)**

#### **قبل:**
```typescript
const MOCK_ORDERS = [
  { id: 1, orderNumber: 'ORD-0011', customer: 'Sara', status: 'new' },
  { id: 2, orderNumber: 'ORD-0010', customer: 'Ali', status: 'new' },
]
// ❌ لا نعرف من أي فرع هذا الطلب؟
```

#### **بعد:**
```typescript
const MOCK_ORDERS = [
  { 
    id: 1, 
    storeId: '1',        // ← أضفنا هذا
    orderNumber: 'ORD-0011', 
    customer: 'Sara', 
    status: 'new',
    // ... بيانات أخرى
  },
  { 
    id: 2, 
    storeId: '2',        // ← أضفنا هذا
    orderNumber: 'ORD-0010', 
    customer: 'Ali', 
    status: 'new'
  },
]
// ✅ الآن نعرف أي فرع لكل طلب
```

---

### **2️⃣ بيانات المخزون (Inventory)**

#### **قبل:**
```typescript
const MOCK = [
  { id: 1, name: 'Milk 1L', category: 'Dairy', stock: 48 },
  { id: 2, name: 'Milk 2L', category: 'Dairy', stock: 12 },
]
// ❌ لا نعرف من أي فرع المنتج
```

#### **بعد:**
```typescript
const MOCK = [
  { 
    id: 1, 
    storeId: '1',      // ← أضفنا هذا
    name: 'Milk 1L', 
    category: 'Dairy', 
    stock: 48 
  },
  { 
    id: 2, 
    storeId: '2',      // ← أضفنا هذا
    name: 'Milk 2L', 
    category: 'Dairy', 
    stock: 12 
  },
]
// ✅ الآن نعرف أي فرع لكل منتج
```

---

### **3️⃣ محادثات الشات (Chat)**

#### **قبل:**
```typescript
const MOCK_THREADS = [
  { id: 1, customer: 'Sara', messages: [...] },
  { id: 2, customer: 'Fatima', messages: [...] },
]
// ❌ من أي فرع المحادثة؟
```

#### **بعد:**
```typescript
const MOCK_THREADS = [
  { 
    id: 1, 
    storeId: '1',      // ← أضفنا هذا
    customer: 'Sara', 
    messages: [...] 
  },
  { 
    id: 2, 
    storeId: '2',      // ← أضفنا هذا
    customer: 'Fatima', 
    messages: [...] 
  },
]
// ✅ الآن نعرف أي فرع لكل محادثة
```

---

## 🔄 كيفية التصفية؟

### **الخطوة 1: جلب storeId من Redux**

```typescript
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'

function StoreDashboard() {
  // 1. جلب بيانات المستخدم
  const user = useAppSelector(selectUser)
  
  // 2. استخراج storeId
  const storeId = user?.storeId || '1'
  
  // storeId الآن:
  // ahmed@store.com → '1'
  // fatima@store.com → '2'
  // layla@store.com → '3'
  // noor@store.com → '4'
}
```

---

### **الخطوة 2: تصفية البيانات**

```typescript
function StoreDashboard() {
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'
  
  const [orders, setOrders] = useState<StoreOrder[]>(MOCK_ORDERS)

  // ← المهم جداً: تصفية البيانات
  const storeOrders = orders.filter(o => o.storeId === storeId)
  //                                            ↑
  //                    المقارنة: هل storeId يطابق؟

  // النتيجة:
  // إذا كنت ahmed (storeId='1') → تشوف طلبات من storeId='1' فقط
  // إذا كنت fatima (storeId='2') → تشوف طلبات من storeId='2' فقط
}
```

---

### **الخطوة 3: استخدام البيانات المصفاة**

```typescript
function StoreDashboard() {
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'
  const [orders, setOrders] = useState<StoreOrder[]>(MOCK_ORDERS)

  // تصفية
  const storeOrders = orders.filter(o => o.storeId === storeId)

  // حسابات على البيانات المصفاة
  const counts = {
    new: storeOrders.filter(o => o.status === 'new').length,
    //    ↑ استخدام storeOrders وليس orders
    
    accepted: storeOrders.filter(o => o.status === 'accepted').length,
    //       ↑ استخدام storeOrders وليس orders
  }

  return (
    <div>
      <p>New Orders: {counts.new}</p>
      <p>Accepted: {counts.accepted}</p>
      
      {/* عرض الطلبات المصفاة */}
      {storeOrders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
```

---

## 📊 مثال واقعي: Orders.tsx

```typescript
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'

function StoreOrders() {
  // 1. جلب المستخدم
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'

  // 2. حالة الطلبات
  const [orders, setOrders] = useState<StoreOrder[]>(MOCK)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // 3. تصفية رقم 1: حسب storeId ✅
  const storeOrders = orders.filter(o => o.storeId === storeId)

  // 4. تصفية رقم 2: حسب الحالة
  const filteredByStatus = storeOrders.filter(o =>
    activeTab === 'all' || o.status === activeTab
  )

  // 5. تصفية رقم 3: حسب البحث
  const finalFiltered = filteredByStatus.filter(o =>
    !search || 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase())
  )

  // 6. العرض
  return (
    <div>
      <h1>Orders</h1>
      <p>Store: {user?.storeName}</p>

      {/* بحث */}
      <input 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        placeholder="Search orders..."
      />

      {/* تبويبات الحالة */}
      <div>
        {['all', 'new', 'accepted', 'delivered'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}>
            {tab} ({
              tab === 'all' 
                ? storeOrders.length 
                : storeOrders.filter(o => o.status === tab).length
            })
          </button>
        ))}
      </div>

      {/* عرض الطلبات */}
      <div>
        {finalFiltered.map(order => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 نفس المنطق في جميع الصفحات:

### **Dashboard.tsx**
```typescript
const storeOrders = MOCK_ORDERS.filter(o => o.storeId === storeId)
const counts = { new: count, accepted: count, ... }
```

### **Inventory.tsx**
```typescript
const storeItems = MOCK.filter(i => i.storeId === storeId)
const outCount = storeItems.filter(i => i.stock === 0).length
```

### **Chat.tsx**
```typescript
const storeThreads = threads.filter(t => t.storeId === storeId)
const totalUnread = storeThreads.reduce((sum, t) => sum + t.unread, 0)
```

### **OrderDetail.tsx**
```typescript
const isAuthorized = order.storeId === storeId
if (!isAuthorized) {
  return <NotAuthorized />
}
```

---

## 🔐 الحماية: التحقق من الصلاحية

```typescript
// في OrderDetail.tsx - التحقق من أن الطلب للفرع الحالي

function StoreOrderDetail() {
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'

  const [order, setOrder] = useState(MOCK_ORDER)

  // 1. التحقق من الصلاحية
  const isAuthorized = order.storeId === storeId

  // 2. إذا لم يكن مصرح:
  if (!isAuthorized) {
    return (
      <div>
        <p>You are not authorized to view this order</p>
      </div>
    )
  }

  // 3. إذا كان مصرح:
  return (
    <div>
      <h1>{order.orderNumber}</h1>
      <p>Customer: {order.customer}</p>
      {/* ... باقي التفاصيل */}
    </div>
  )
}
```

---

## 📝 جدول التصفية لكل صفحة:

| الصفحة | البيانات | التصفية الأساسية | المتغيرات الإضافية |
|-------|---------|-----------------|------------------|
| Dashboard | MOCK_ORDERS | storeId | status (stats) |
| Orders | MOCK | storeId | status, search |
| Inventory | MOCK | storeId | category, stock status |
| Chat | MOCK_THREADS | storeId | (none) |
| OrderDetail | MOCK_ORDER | storeId (auth check) | (none) |

---

## 🚀 الخلاصة:

```typescript
// في أي صفحة Store:

1️⃣ const user = useAppSelector(selectUser)
   // جلب بيانات المستخدم

2️⃣ const storeId = user?.storeId || '1'
   // استخراج معرف الفرع

3️⃣ const storeData = MOCK_DATA.filter(item => item.storeId === storeId)
   // تصفية البيانات

4️⃣ return <Display data={storeData} />
   // عرض البيانات المصفاة

✅ كل مستخدم يشوف بيانات فرعه فقط!
```

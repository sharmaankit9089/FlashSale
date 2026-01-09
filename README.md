# 🚀 Flash Sale System

A high-performance flash sale application designed to safely handle **high-concurrency purchases** using **inventory holds** and **race-safe locking**.

---

## ⚙️ Setup Steps

### 🔧 Backend
```bash
cd server
npm install
npx prisma migrate reset
npx prisma db seed
npm run dev
```

### 🎨 Frontend
```bash
cd client
npm install
npm run dev
```

## 🛠 Tech Stack

### Backend
- Node.js
- Express
- Prisma v6
- PostgreSQL
- Redis (locking + concurrency control)

### Frontend
- React
- React Query
- Tailwind CSS
- Chart.js
```
## 🗄 Database Schema

### Product
- `id`
- `name`
- `description`
- `price`
- `totalStock`
- `saleStartsAt`
- `saleEndsAt`
- `createdAt`

### Order
- `id`
- `productId`
- `customerEmail`
- `quantity`
- `status` (`PENDING` | `CONFIRMED` | `EXPIRED`)
- `holdExpiresAt`
- `createdAt`

### InventoryEvent
- `id`
- `productId`
- `type` (`HOLD_CREATED` | `CONFIRMED` | `EXPIRED`)
- `delta`
- `metadata`
- `createdAt`


## 🔒 Locking Strategy

To prevent overselling under high concurrency, the system uses **Redis-based locking**.

### How it works:
1. One Redis lock per product
2. Lock is acquired before modifying inventory
3. Stock validation and reservation happen inside the lock
4. Lock is released immediately after operation

### Why this works:
- Prevents race conditions
- Ensures no two requests can reserve the same stock
- Guarantees correctness even under heavy traffic

### Inventory Hold Flow:
1. User clicks **Buy**
2. Lock acquired for product
3. Stock checked and reserved
4. 2-minute hold created
5. Lock released
6. Order must be confirmed before hold expires


## 📌 Assumptions

- No authentication required (admin is read-only)
- Email is used only as a lightweight order identifier
- Admin metrics and charts are shown since server start
- Polling interval of 5 seconds is acceptable


## ⚖️ Trade-offs

- **Polling** used instead of WebSockets for simplicity
- **Derived stock** increases query cost but guarantees correctness
- **Admin console** focuses on monitoring, not management
- **Redis required**, adding infrastructure dependency

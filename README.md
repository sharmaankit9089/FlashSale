Flash Sale System

A flash sale application that safely handles high-concurrency purchases using inventory holds and race-safe locking.

Features
Live Storefront

Shows products with active sale windows

Displays product name, price, description

Product-wise sale countdown (HH:MM:SS)

Live stock indicator (remaining / total)

Stock auto-refresh every 5 seconds

Buy flow creates a 2-minute inventory hold

Checkout

Shows order details and hold timer

Confirm button to place order

Clear UI state when hold expires

Admin Console (/admin)

Auto-refresh every 5 seconds

Product table with:

Total stock

Live stock

Pending holds count

Confirmed count

Expired count

Metrics:

Total holds created

Confirmed orders

Expired orders

Chart showing Sold vs Expired orders (since server start)

Tech Stack

Backend: Node.js, Express, Prisma v6, PostgreSQL, Redis

Frontend: React, React Query, Tailwind CSS, Chart.js

Setup
Backend
cd server
npm install
npx prisma migrate reset
npx prisma db seed
npm run dev

Frontend
cd client
npm install
npm run dev

Database Schema (Summary)

Product: name, price, totalStock, sale window

Order: productId, quantity, status, hold expiry

InventoryEvent: audit log for stock changes

Locking Strategy

Inventory updates are protected using Redis locks:

One lock per product

Stock is validated and reserved inside the lock

Prevents overselling under concurrent requests

Stock is derived, not stored:

liveStock = totalStock − (confirmed + active pending)

Assumptions

No authentication required (admin is read-only)

Email is used only as a lightweight order identifier

Chart is shown since server start (allowed by spec)

Trade-offs

Polling used instead of WebSockets for simplicity

Derived stock increases queries but guarantees correctness

Admin console focuses on monitoring, not management
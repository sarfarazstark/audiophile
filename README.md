# Audiophile — E-commerce Website

Audiophile is a full-stack e-commerce application built as an extended implementation of the **Frontend Mentor – Audiophile E-commerce Website** challenge.
Beyond the original UI requirements, this project includes a complete backend, payment integration, and order tracking.

---

## 🚀 Features

- Modern e-commerce UI based on the Audiophile design system
- Product listing, category pages, and product detail pages
- Cart management with persistent state (Zustand)
- Secure checkout flow with server-side price and quantity validation
- Integrated payment gateway
- Order tracking system
- Responsive design (mobile, tablet, desktop)
- Toast notifications for user feedback
- Schema-based validation using Zod

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16 (App Router)**
- **React 19**
- **Tailwind CSS v4**
- **Zustand** (state management)
- **Zod** (validation)
- **Motion** (animations)
- **Lucide React** (icons)

### Backend
- **Prisma ORM**
- **PostgreSQL**
- **Axios** (API communication)

### Tooling
- **TypeScript**
- **ESLint**
- **Bun** (for Prisma seeding)

---

## 📦 Dependencies Overview

- `next`, `react`, `react-dom` — core framework and UI
- `prisma`, `@prisma/client`, `pg` — database layer
- `zustand` — cart and client state
- `zod` — form and API validation
- `axios` — HTTP requests
- `motion` — animations
- `tailwindcss`, `clsx`, `tailwind-merge` — styling utilities

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Bun (optional, required for seeding as configured)

### Installation

```bash
git clone <repository-url>
cd audiophile
npm install

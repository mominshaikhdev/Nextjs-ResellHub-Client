# ReSell Hub — Client

Frontend for **ReSell Hub**, a second-hand marketplace where users buy and sell pre-owned products. Built with Next.js (App Router).

## Project Purpose

People own usable items they no longer need. ReSell Hub lets **sellers** list pre-owned products and **buyers** browse, compare, wishlist, and purchase them securely. An **admin** moderates users, products, orders, and payments. Each role has its own dashboard.

## Live URLs

- Client: https://nextjs-resell-hub-client.vercel.app
- API: https://expressjs-mongo-db-resell-hub-serve.vercel.app
- Admin login: `admin@resellhub.com` / `admin123`

## NPM Packages Used

| Package | Use |
|---|---|
| `next`, `react`, `react-dom` | App framework (App Router) |
| `axios` | API requests (cookie-based auth) |
| `better-auth` | Authentication client (email/password + Google OAuth) |
| `@stripe/stripe-js`, `@stripe/react-stripe-js` | Stripe checkout |
| `framer-motion` | Animations |
| `recharts` | Dashboard charts |
| `lucide-react` | Icons |
| `tailwindcss` v4 | Styling |

## Features

**Authentication**
- Register with email/password + location
- Login with email/password and **Login with Google**
- Secure logout, JWT-protected private routes, role-based access (buyer / seller / admin)
- Session persistence via Better Auth cookies

**Home page**
- Hero with CTA + statistics, featured products (dynamic), popular categories (dynamic), success stories, marketplace statistics (total products / sellers / buyers / completed orders), sustainability section, trusted sellers
- Framer Motion animations on hero, product cards, and statistics

**Public**
- All Products: advanced search (name/category), sorting (price low↔high, newest/oldest), advanced filters (price range, condition, category, location), pagination
- Product details: image gallery, condition/price/location, seller card with verification badge, reviews & rating form, related & recently viewed products
- Categories, About, Contact

**Buyer dashboard** — overview (total orders, wishlist count, recent purchases), my orders (view / track / cancel before shipment), wishlist, payment history, profile settings (name, photo, phone, location, change password)

**Seller dashboard** — overview (total products, total sales, revenue, pending orders), add product, my products (edit / delete / search / filter), manage orders (accept / reject / update delivery status), sales analytics (monthly trend, revenue by category, top selling products)

**Admin dashboard** — overview (users / products / orders / revenue), manage users (search / block / verify seller / delete), moderate products (approve / reject / delete / reported listings), manage orders, transaction monitoring (search / filter / revenue), platform analytics (user growth, monthly orders, category performance, top categories)

**Payments** — Stripe secure checkout, payment success page, buyer payment history

**UI** — fully responsive (mobile / tablet / desktop), dark & light theme toggle (defaults to system preference, persisted), loading skeletons, custom 404

## Optional Features

1. Product Comparison (price, condition, category, seller rating — up to 3 side by side)
2. Recently Viewed Products
3. Dark / Light Theme Toggle (defaults to system preference)
4. Seller Verification Badge (cards, details, profile)
5. Product Reporting System (report button, reason, admin review, status tracking)
6. Product Availability Alerts
7. Advanced Product Filtering (price range, condition, category, location)
8. Seller Public Profile Page (info, total listings, ratings & reviews, joined date)

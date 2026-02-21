# Zest Wear - E-Commerce Landing Page

A modern, premium e-commerce landing page built with Next.js 15, Prisma, and NeonDB (PostgreSQL). Features a stunning design with glassmorphism effects, gradient animations, and a responsive product grid.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Database**: Prisma ORM with NeonDB (PostgreSQL)
- **Premium Design**: Glassmorphism, gradient effects, smooth animations
- **Product Features**:
  - Stock quantity tracking
  - Optional product variants (size, color)
  - Responsive product cards with hover effects
  - Next.js Image optimization
- **Fully Responsive**: Mobile, tablet, and desktop optimized

## 📦 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: NeonDB (PostgreSQL) via Prisma ORM
- **Fonts**: Inter from Google Fonts

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

1. Create a free NeonDB account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy your connection string
4. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

Replace with your actual NeonDB connection string.

### 3. Set Up Database

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed database with sample products
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Database Schema

The `Product` model includes:

- `id`: Auto-increment primary key
- `name`: Product name
- `description`: Product description
- `price`: Product price (Float)
- `quantity`: Stock quantity (Int)
- `imageUrl`: Path to product image
- `category`: Optional category (Electronics, Fashion, Home)
- `size`: Optional array of sizes
- `color`: Optional array of colors
- `hasVariants`: Boolean flag for products with variants
- `createdAt`: Timestamp

## 🎨 Design Features

- **Glassmorphism**: Frosted glass effects on cards and buttons
- **Gradient Text**: Eye-catching gradient text for headings
- **Smooth Animations**: Fade-in, slide-up, and hover-lift effects
- **Dark Theme**: Premium dark gradient background
- **Responsive Grid**: 1 column (mobile) → 2 (tablet) → 3-4 (desktop)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🗂️ Project Structure

```
zest-wear/
├── app/
│   ├── api/products/route.ts    # API endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── Hero.tsx                  # Hero section
│   ├── ProductCard.tsx           # Product card component
│   └── Footer.tsx                # Footer component
├── lib/
│   └── prisma.ts                 # Prisma client singleton
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script
├── public/
│   └── products/                 # Product images
└── package.json
```

## 🌟 Sample Products

The seed script includes 8 diverse products:

1. Premium Wireless Headphones (Electronics)
2. Smart Fitness Watch (Electronics)
3. Ultra Running Sneakers (Fashion)
4. Leather Laptop Backpack (Fashion)
5. Espresso Coffee Maker (Home)
6. Modern LED Desk Lamp (Home)
7. Portable Bluetooth Speaker (Electronics)
8. Classic Aviator Sunglasses (Fashion)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `DATABASE_URL` environment variable
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ using Next.js and Prisma

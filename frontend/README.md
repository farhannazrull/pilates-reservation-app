# diropilates - Pilates Reservation App 🧘‍♀️

A modern, full-stack pilates studio reservation system built with **Next.js**, **Tailwind CSS**, and **Supabase**. This application allows clients to book sessions, check real-time availability, and view their booking history with a seamless user experience.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3EC988?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## ✨ Features

- **Real-time Booking:** Instant availability checks for different studios and time slots.
- **Multilingual Support:** Support for English and Bahasa Indonesia.
- **Dark/Light Mode:** Beautiful UI with Material Design principles that adapts to your preference.
- **Booking History:** Clients can view their past reservations.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
- **Interactive Calendar:** Easy-to-use date picker with integrated availability logic.

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS & Lucide Icons
- **Backend/API:** Next.js API Routes (Serverless)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- A Supabase account

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/farhannazrull/pilates-reservation-app.git
   cd pilates-reservation-app/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database:**
   Run the SQL scripts provided in your Supabase SQL Editor to create `courts`, `time_slots`, and `reservations` tables.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Set the **Root Directory** to `frontend`.
5. Deploy!

## 📝 Architecture Note

Originally built with a Go (Golang) backend, this project has been migrated to **Next.js API Routes** to provide a 100% serverless architecture, ensuring zero-cost deployment and high availability on Vercel without the need for a separate VPS or IPv6 configuration.

## 👤 Author

**Mohammad Farhan Nazrul Ilhami**
- GitHub: [@farhannazrull](https://github.com/farhannazrull)
- Instagram: [@farhannazrul](https://instagram.com/farhannazrul)

---
Made with ❤️ for Pilates Studios everywhere.
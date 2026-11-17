# Wall

A simple real-time social wall where users can share short messages and see posts from others instantly.

## Features

- Create posts with a maximum of 280 characters.
- View posts in a live feed.
- Display newest posts first.
- Real-time updates without refreshing the page.
- Show relative timestamps (e.g., Now, 4m, 2h).

## Tech Stack

- **Next.js 15** – React framework
- **React 19** – UI library
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **shadcn/ui** – UI components
- **Supabase** – Database and real-time updates

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd wall
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

This project uses Supabase PostgreSQL to store posts and Supabase Realtime to broadcast new posts.

Create a `posts` table with the following columns:

| Column     | Type         |
| ---------- | ------------ |
| id         | UUID         |
| name       | TEXT         |
| content    | VARCHAR(280) |
| created_at | TIMESTAMPTZ  |

Enable Row Level Security (RLS) and configure policies to allow public reading and posting.

## Project Purpose

Wall was built as a small project to practice building a real-time application using Next.js, React, and Supabase.

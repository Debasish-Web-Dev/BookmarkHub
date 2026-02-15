# 🔖 BookmarkHub - Smart Bookmark Manager

A modern, full-stack bookmark management application with real-time synchronization across devices. Built with Next.js 14, Supabase, and Tailwind CSS.

## ✨ Features

- **Google OAuth Authentication** - Secure, passwordless login
- **Real-time Sync** - Changes appear instantly across all open tabs
- **Private Bookmarks** - Each user sees only their own bookmarks (Row Level Security)
- **Beautiful UI** - Modern glassmorphism design with smooth animations
- **Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Fast & Secure** - Built with Next.js App Router and Supabase

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google Cloud Platform account (for OAuth)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (takes ~2 minutes)
3. Go to **Settings** → **API** and copy:
   - Project URL(https://plgcpgweksxvfbhpymug.supabase.co)
   - Anon/Public Key(sb_publishable_ZpLCTYMk_PS-iHiPn3i7zQ_YPxsZYjB)

### 4. Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Paste the following SQL and click **Run**:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view only their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can delete only their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- Create index for faster queries
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
```

### 5. Set Up Google OAuth

#### 5.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - For local development: `http://localhost:54321/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

#### 5.2 Configure Supabase Authentication

1. In your Supabase project, go to **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste your Google **Client ID** and **Client Secret**
4. Click **Save**

#### 5.3 Add Redirect URLs

1. Still in **Authentication** → **URL Configuration**
2. Add your site URL to **Site URL**: `http://localhost:3000` (for local) or your production URL
3. Add redirect URLs to **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback` (for local)
   - `https://yourdomain.com/api/auth/callback` (for production)

### 6. Configure Environment Variables

1. Copy the example env file:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### 3. Update OAuth Redirect URLs

After deployment:

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to **Google Cloud Console** → **Credentials**
3. Add to authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. In Supabase **Authentication** → **URL Configuration**:
   - Update **Site URL** to your Vercel URL
   - Add `https://your-app.vercel.app/api/auth/callback` to **Redirect URLs**

## 🏗️ Project Structure

```
smart-bookmark-app/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (redirects)
│   ├── login/page.tsx       # Login page
│   ├── dashboard/page.tsx   # Main dashboard
│   └── api/auth/callback/   # OAuth callback handler
├── components/              # React components
│   ├── Navbar.tsx          # Navigation bar
│   ├── BookmarkForm.tsx    # Add bookmark form
│   ├── BookmarkList.tsx    # List with real-time updates
│   ├── BookmarkCard.tsx    # Individual bookmark
│   ├── EmptyState.tsx      # Empty state UI
│   └── LoadingSpinner.tsx  # Loading indicator
├── lib/                     # Utility functions
│   ├── supabase.ts         # Browser Supabase client
│   └── supabaseServer.ts   # Server Supabase client
├── types/                   # TypeScript types
│   └── bookmark.ts         # Type definitions
└── middleware.ts           # Route protection
```

## 🔒 Security Features

### Row Level Security (RLS)

All database queries are protected by RLS policies:

- Users can only **INSERT** their own bookmarks
- Users can only **SELECT** their own bookmarks
- Users can only **DELETE** their own bookmarks

### Authentication

- Google OAuth 2.0 only (no password vulnerabilities)
- Secure session management via Supabase Auth
- Protected routes via Next.js middleware

## 🎨 Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### OAuth Redirect Issues

If you get redirect errors:

1. Check that your redirect URLs match exactly in both Google Cloud Console and Supabase
2. Ensure there are no trailing slashes
3. Wait a few minutes for changes to propagate

### Real-time Not Working

1. Ensure Realtime is enabled in Supabase **Database** → **Replication**
2. Check that the `bookmarks` table is added to the publication
3. Verify RLS policies are correctly set

### Build Errors

1. Delete `.next` folder and `node_modules`
2. Run `npm install` again
3. Check that all environment variables are set

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you have any questions or run into issues, please open an issue on GitHub.

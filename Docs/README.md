# SS Supplement Website - Frontend (Docs)

This is the Next.js frontend application for the SS Supplement website.

## Backend URLs

The application connects to a Django backend API. The backend is available at:

- **Production**: https://ss-supplement-website.onrender.com
- **Local Development**: http://localhost:8000 (when running backend locally)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set the appropriate backend URL:
   - For production: `NEXT_PUBLIC_API_URL=https://ss-supplement-website.onrender.com`
   - For local development: `NEXT_PUBLIC_API_URL=http://localhost:8000`

3. **Run the development server:**
   ```bash
   pnpm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (takes precedence)
- `NEXT_PUBLIC_BACKEND_URL`: Alternative backend URL (fallback)
- `NEXT_PUBLIC_EMAILJS_*`: EmailJS configuration for OTP functionality

## Troubleshooting

### "Failed to Load Prices" Error

If you see "Failed to Load Prices" or "Order quote calculation failed", check:

1. **Backend is running**: Ensure the backend server is running at the configured URL
2. **CORS enabled**: The backend must allow requests from your frontend domain
3. **Network connectivity**: Check if you can access the backend URL directly
4. **Environment variables**: Verify NEXT_PUBLIC_API_URL is set correctly

### Switching Between Local and Production Backend

To switch backend URLs:

1. Edit `.env.local`
2. Change `NEXT_PUBLIC_API_URL` to the desired backend URL
3. Restart the development server: `pnpm run dev`

## Product Loading

The application loads products from the backend API first. If the backend is unavailable, it automatically falls back to loading products from a local CSV file (`public/products_full_export_backend_live.csv`).

### Fallback Behavior

1. **Primary**: Load from `NEXT_PUBLIC_API_URL/api/products-public/`
2. **Fallback**: Load from `/products_full_export_backend_live.csv` (local CSV file)
3. **Error State**: Show "No products found" only if both sources fail

This ensures the website remains functional even when the backend is down for maintenance or experiencing issues.
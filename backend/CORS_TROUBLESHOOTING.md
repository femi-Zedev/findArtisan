# Cloudflare R2 CORS Troubleshooting Guide

## Problem: CORS errors persist even after configuring CORS policy

**Error Message:**
```
Access to image at 'https://pub-*.r2.dev/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present 
on the requested resource.
```

## Quick Fix: Enable Next.js Image Optimization

**The easiest solution is to let Next.js proxy images server-side**, which bypasses browser CORS restrictions:

1. **Remove `unoptimized` prop** from Next.js Image components
2. Next.js will fetch images server-side and serve them through its own domain
3. This completely bypasses CORS issues

**Already done**: `FallbackImage` component has been updated to remove `unoptimized`.

**If you still see CORS errors after removing `unoptimized`**, continue with the troubleshooting steps below.

## Troubleshooting Steps

## Step 1: Verify CORS Configuration Format

Ensure your CORS policy JSON is correctly formatted:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**Common mistakes:**
- ❌ Missing array brackets `[]` around the object
- ❌ Using single quotes instead of double quotes
- ❌ Trailing commas
- ❌ Missing quotes around origin values

## Step 2: Check Propagation Time

- CORS changes can take **up to 30 seconds** to propagate
- Wait at least 30 seconds after saving the CORS policy
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear browser cache

## Step 3: Verify Public Development URL is Enabled

**CRITICAL**: CORS only works when **Public Development URL is enabled**:

1. Go to **Cloudflare Dashboard → R2 → Your Bucket (`findartisan`) → Settings**
2. Check **"Public Development URL"** section
3. Ensure it shows **"Enabled"** with a URL like `https://pub-*.r2.dev`
4. If disabled, click **"Enable"** and wait for activation (can take a few minutes)

**Important**: 
- CORS policies **only apply** to the Public Development URL (`pub-*.r2.dev`), NOT the S3 API endpoint
- If you're using the S3 endpoint URL, CORS won't work - you MUST use the Public Development URL
- Your `CF_PUBLIC_ACCESS_URL` should be set to the Public Development URL

## Step 4: Verify You're Using the Correct URL

**CRITICAL CHECK**: Ensure your images are served from the **Public Development URL**, not the S3 endpoint:

- ✅ **Correct**: `https://pub-e251308ffa3948dbaeec64b5d550d1db.r2.dev/...`
- ❌ **Wrong**: `https://98b63df6e3fd324b71eeb3d8d55a6485.r2.cloudflarestorage.com/...`

**Check in Strapi**: 
- Go to Media Library
- Check the URL of uploaded images
- They should use `CF_PUBLIC_ACCESS_URL` (the `pub-*.r2.dev` URL)

## Step 5: Test CORS Headers Directly

Test if CORS headers are being sent:

### Using curl:
```bash
# Replace with your actual image path
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -I "https://pub-e251308ffa3948dbaeec64b5d550d1db.r2.dev/1/your-image.png"
```

Look for these headers in the response:
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET, HEAD`

If these headers are **missing**, the CORS policy is not applied correctly.

### Using Browser DevTools:
1. Open Network tab
2. Try to load an image
3. Click on the failed request
4. Check **Response Headers** - you should see `Access-Control-Allow-Origin: http://localhost:3000`
5. If header is missing → CORS policy not working
6. If header exists but wrong origin → Check origin format in CORS config

## Step 6: Clear Browser Cache

Browser may have cached responses without CORS headers:

1. **Chrome/Edge**: DevTools → Network tab → Check "Disable cache" → Hard refresh
2. **Firefox**: DevTools → Network tab → Right-click → "Clear Browser Cache"
3. Or use **Incognito/Private mode** to test

## Step 7: Verify Origin Format

Ensure the origin matches **exactly**:
- ✅ `http://localhost:3000` (correct)
- ❌ `http://localhost:3000/` (trailing slash - wrong)
- ❌ `https://localhost:3000` (wrong protocol)
- ❌ `localhost:3000` (missing protocol - wrong)

## Step 8: Try Wildcard (Temporary Test)

To test if CORS is working at all, temporarily use:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**⚠️ Warning**: Only use `"*"` for testing. Remove it and use specific origins for production.

If `"*"` works but specific origin doesn't, the issue is with the origin format.

## Step 9: Check Multiple Origins Format

If you need multiple origins, format correctly:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Step 10: Verify Bucket Settings

1. Ensure you're editing CORS for the **correct bucket** (`findartisan`)
2. CORS policy is saved (check for confirmation message)
3. No syntax errors in JSON (Cloudflare should validate on save)

## Step 11: Alternative - Use Next.js Image Optimization (Already Applied)

If CORS issues persist, you can proxy images through Next.js:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-e251308ffa3948dbaeec64b5d550d1db.r2.dev',
        pathname: '/**',
      },
    ],
    // Next.js will proxy images and handle CORS
  },
};
```

This makes Next.js fetch images server-side, bypassing browser CORS restrictions.

## Common Issues Summary

| Issue | Solution |
|-------|----------|
| CORS configured but not working | Wait 30 seconds, clear cache, verify Public URL is enabled |
| Headers not appearing | Check JSON format, verify bucket, test with `*` wildcard |
| Works with `*` but not specific origin | Check origin format (no trailing slash, correct protocol) |
| Still failing after all steps | Try Next.js image optimization or Cloudflare Worker |

## Still Not Working?

If none of the above works:
1. Double-check the CORS JSON syntax in Cloudflare dashboard
2. Verify you're accessing images via the Public Development URL (not S3 endpoint)
3. Check Cloudflare status page for any service issues
4. Consider using a Cloudflare Worker to add CORS headers dynamically

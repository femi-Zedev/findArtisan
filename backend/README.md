# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Environment Variables

### Cloudflare R2 Storage Configuration

The application uses Cloudflare R2 for file storage. Configure the following environment variables:

```env
# Cloudflare R2 Configuration
CF_ACCESS_KEY_ID=your_r2_access_key_id
CF_ACCESS_SECRET=your_r2_secret_access_key
CF_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
CF_BUCKET=your_bucket_name
CF_REGION=us-east-1
CF_PUBLIC_ACCESS_URL=https://your-bucket.your-account-id.r2.dev  # Optional: Public URL for accessing files
```

**Notes:**
- `CF_ENDPOINT`: Replace `<ACCOUNT_ID>` with your Cloudflare account ID. Format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- `CF_REGION`: Set to `us-east-1` (required for S3 compatibility, R2 doesn't use regions but this is needed)
- `CF_PUBLIC_ACCESS_URL`: Optional. Can be a custom domain or R2.dev subdomain. If not set, files will still be accessible but URLs will be longer.
- To get R2 credentials: Cloudflare Dashboard → R2 → Manage R2 API Tokens

### CORS Configuration

**IMPORTANT**: You must configure CORS on your Cloudflare R2 bucket to allow your frontend to access images.

1. Go to **Cloudflare Dashboard → R2 → Your Bucket → Settings**
2. Scroll to **CORS Policy** section
3. Click **Add CORS policy**
4. Add the following JSON configuration:

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

**For Development (Less Secure):**
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

**Important:**
- Replace `https://your-production-domain.com` with your actual production domain
- CORS changes can take up to 30 seconds to propagate
- Ensure `AllowedOrigins` matches exactly (including `http://` vs `https://`, no trailing slashes)
- For production, avoid using `"*"` and specify exact origins

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

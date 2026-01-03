export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env('CF_PUBLIC_ACCESS_URL') ? env('CF_PUBLIC_ACCESS_URL').replace(/^https?:\/\//, '') : '',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            env('CF_PUBLIC_ACCESS_URL') ? env('CF_PUBLIC_ACCESS_URL').replace(/^https?:\/\//, '') : '',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '100mb', // Limit for form data
      jsonLimit: '100mb', // Limit for JSON payloads
      textLimit: '100mb', // Limit for text payloads
      formidable: {
        maxFileSize: 100 * 1024 * 1024, // 100 MB in bytes
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

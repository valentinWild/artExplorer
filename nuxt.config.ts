

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(
  {
    devtools: { enabled: true },
    runtimeConfig: {
      mongoUri: process.env.MONGO_URI,
      jwtSecret: process.env.JWT_SECRET,
      authSecret: process.env.AUTH_SECRET,
      public: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      },
    },

    modules: [
      '@nuxt/ui',
      '@nuxtjs/supabase',
    ],

    supabase: {
      redirectOptions: {
        login: '/user/login',
        callback: '/confirm',
        include: undefined,
        exclude: [
          '/user/register',
          '/',
        ],
        cookieRedirect: false,
      }
    }
  }
)

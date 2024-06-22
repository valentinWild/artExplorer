

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(
  {
    devtools: { enabled: true },
/*     nitro: {
      plugins: ['~/server/index.js'],
      preset: 'node-server',
    },
 */
/*     hooks: {
      'nitro:config': async () => {
        await mongodb()
      },
    }, */

    runtimeConfig: {
      mongoUri: process.env.MONGO_URI,
      jwtSecret: process.env.JWT_SECRET,
      authSecret: process.env.AUTH_SECRET,
    },

    modules: [
      '@nuxt/ui',
      "nuxt-server-utils",
      "@sidebase/nuxt-auth",
    ],
    nuxtServerUtils: {
      mongodbUri: process.env.MONGODB_URI,
    },
    auth: {
      baseURL: process.env.AUTH_ORIGIN,
      provider: {
        type: 'authjs',
      }
    }
  }
)

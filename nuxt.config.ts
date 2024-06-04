
import mongodb from "./server/mongodb"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(
  {
    devtools: { enabled: true },
    nitro: {
      preset: 'node-server',
    },
    hooks: {
      'nitro:config': async () => {
        await mongodb()
      },
    },
    runtimeConfig: {
      mongoUri: process.env.MONGO_URI,
    },
    modules: [
      '@nuxt/ui'
    ],
  }
)

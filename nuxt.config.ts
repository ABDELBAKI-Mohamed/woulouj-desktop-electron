// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    ["nuxt-electron", { include: ["electron", "server"] }],
  ],
  ssr: false,
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ["/"],
    },
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "~/tailwind.config.ts",
    exposeConfig: false,
    exposeLevel: 2,
    injectPosition: "first",
    viewer: false,
  },
  supabase: {
    url: "https://ulghhgjrbswyeeojlhwc.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2hoZ2pyYnN3eWVlb2psaHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM3MjAzNjQsImV4cCI6MTk5OTI5NjM2NH0.RXK2GaxWFG3nnPxO5vOl1FBzJZMCRTzHArgIkWYkgYY",
  },
  electron: {
    build: [
      {
        entry: "electron/main.ts",
      },
    ],
  },
  router: {
    options: {
      hashMode: true,
    },
  },
  vite: {
    server: {
      middlewareMode: false,
    },
  },
  app: {
    baseURL: "./",
  },
  // app: {
  //   baseURL: "./",
  // },
});

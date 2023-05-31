<script setup lang="ts">
const languages = ref([
  {
    text: "Français",
    path: "/languages/français/levels",
    image: "/fr-flag.gif",
  },
  {
    text: "Anglaise",
    path: "/languages/anglaise/levels",
    image: "/us-flag.gif",
  },
  {
    text: "Allemande",
    path: "/languages/allemande/levels",
    image: "/gm-flag.gif",
  },
  {
    text: "Italien",
    path: "/languages/italien/levels",
    image: "/it-flag.gif",
  },
]);
</script>

<template>
  <section class="w-full h-full flex justify-center flex-col items-center">
    <!-- <h1 class="w-full mb-11 text-center font-semibold text-2xl">
      Choose a language
    </h1> -->
    <div class="w-fit grid gap-2 grid-cols-4">
      <NuxtLink
        v-for="(language, index) in languages"
        :to="language.path"
        :key="index"
        class="h-44 w-48"
      >
        <div
          class="w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 flex justify-center rounded-md items-center bg-gray-200/50"
        >
          <img
            class="absolute top-0 left-0 w-full opacity-20 group-hover:opacity-60 h-full transition-all duration-250"
            :src="language.image"
            alt=""
          />
          <span
            class="text-center text-xl text-gray-900 font-bold bg-white rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
          >
            {{ language.text }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

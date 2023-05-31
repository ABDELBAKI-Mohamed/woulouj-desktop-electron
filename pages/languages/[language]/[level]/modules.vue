<script setup lang="ts">
// import useLanguagesStore from "~~/composables/useLanguagesStore";
const { language, level } = useRoute().params as Record<
  "language" | "level",
  string
>;
const { getModules, getFlag } = useLanguagesStore();
</script>

<template>
  <section class="w-full h-full flex">
    <div class="w-full h-full flex justify-center flex-col items-center">
      <!-- <h1>Choose a Module</h1> -->
      <div class="w-fit grid gap-2 grid-cols-2">
        <NuxtLink
          v-for="(module, index) in getModules(language, level)"
          :to="getRightPath(useRoute().path, module.concat('/ages'))"
          :key="index"
          class="h-44 w-48"
        >
          <div
            class="w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 flex justify-center rounded-md items-center bg-gray-200/50"
          >
            <img
              class="absolute top-0 left-0 w-full opacity-20 group-hover:opacity-60 h-full transition-all duration-250"
              :src="getFlag(language)"
              alt=""
            />
            <span
              class="text-center text-xl text-gray-900 font-bold bg-white rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              {{ module }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

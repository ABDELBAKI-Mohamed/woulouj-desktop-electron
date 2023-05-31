<script setup lang="ts">
const routes = computed(() => Object.values(useRoute().params).join(" / "));
</script>

<template>
  <nav class="w-full h-14 z-30 flex items-center shadow-lg">
    <div class="w-full flex justify-start items-center h-12">
      <div
        class="h-10 flex justify-center border-r border-gray-600 px-2 items-center gap-2"
      >
        <span
          @click="$router.back()"
          class="w-8 h-8 cursor-pointer flex hover:bg-gray-200 transition-all duration-200 hover:border-gray-700 items-center justify-center rounded-md border border-gray-600"
        >
          <img class="-rotate-90" src="../assets/svgs/arrow-up.svg" />
        </span>
        <span
          @click="$router.forward()"
          class="w-8 h-8 cursor-pointer flex hover:bg-gray-200 transition-all duration-200 hover:border-gray-700 items-center justify-center rounded-md border border-gray-600"
        >
          <img class="rotate-90" src="../assets/svgs/arrow-up.svg" />
        </span>
      </div>
      <span class="ml-2">
        <NuxtLink to="/">Home</NuxtLink>
        {{ routes ? " / " + routes : "" }}</span
      >
    </div>
  </nav>
</template>

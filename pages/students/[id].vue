<script setup lang="ts">
const { Student } = useStudent();
</script>

<template>
  <section class="w-full h-full flex px-4 py-6">
    <div class="w-full h-full flex justify-center flex-col items-center">
      <div class="w-full h-full flex flex-row gap-2">
        <UiCard v-if="Student" :Item="Student" />
      </div>
    </div>
  </section>
</template>

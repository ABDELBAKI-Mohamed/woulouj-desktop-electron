<script setup lang="ts">
defineProps<{
  Disable: boolean;
  colorTheme: string;
}>();

defineEmits<{
  (event: "on:click"): void;
}>();
</script>

<template>
  <button
    @click="$emit('on:click')"
    :disabled="Disable"
    :class="[
      'rounded-md px-4 h-10 disabled:hover:bg-gray-300 disabled:cursor-not-allowed disabled:hover:text-white disabled:bg-gray-300 disabled:hover:border-sky-200 hover:bg-sky-300/40 hover:border-sky-300 hover:text-black',
      colorTheme == 'b'
        ? ' disabled:hover:bg-sky-50 text-sky-600 bg-sky-100'
        : colorTheme == 'a'
        ? ' text-white bg-sky-400'
        : ' text-sky-500 border-2 border-sky-500 bg-sky-50',
    ]"
  >
    <div class="flex items-center w-full h-full justify-center">
      <slot></slot>
    </div>
  </button>
</template>

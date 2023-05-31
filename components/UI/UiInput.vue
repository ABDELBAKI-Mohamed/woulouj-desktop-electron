<script setup lang="ts">
const { Value } = defineProps<{
  Type?: string;
  Value?: string | number;
  Placeholder: string;
  Disable?: boolean;
}>();

defineEmits<{
  (event: "on:input", value: string): void;
}>();

const inputValue = ref<any>(Value ?? "");
</script>

<template>
  <input
    :disabled="Disable"
    @input="$emit('on:input', inputValue)"
    class="px-2 py-1 h-10 focus:outline-0 transition-all duration-200 focus:placeholder-a w-full border-2 rounded-md"
    v-model="inputValue"
    :placeholder="Placeholder"
    :type="Type ?? 'text'"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  page: number;
  items: number;
}>();

const emits = defineEmits<{
  (event: "go:back"): void;
  (event: "go:forward"): void;
}>();

const goBack = () => {
  if (props.page > 0) {
    emits("go:back");
  }
};
const goForward = () => {
  if (props.page + 1 < Math.ceil(props.items / 15)) {
    emits("go:forward");
  }
};
</script>

<template>
  <div class="h-8 w-full mt-2 flex items-center justify-center">
    <div
      class="h-fit w-fit flex items-center text-lg bg-slate-200 px-4 rounded-md font-semibold text-gray-800 gap-4"
    >
      <span
        class="rounded-full flex items-center justify-center cursor-pointer"
        @click="goBack"
      >
        -
      </span>
      <div class="flex w-full h-full items-center">
        <span class="px-1 text-base text-gray-400">
          {{ page === 0 ? "" : page }}
        </span>
        <span class="px-1">{{ page + 1 }}</span>
        <span class="px-1 text-base text-gray-400">
          {{ page + 1 === Math.ceil(items / 15) ? "" : page + 2 }}
        </span>
      </div>
      <span
        @click="goForward"
        class="rounded-full flex items-center justify-center cursor-pointer"
      >
        +
      </span>
    </div>
  </div>
</template>

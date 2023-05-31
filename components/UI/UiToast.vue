<script setup lang="ts">
defineProps<{
  toast: { text: string; role: string };
}>();

const emits = defineEmits<{
  (event: "on:close"): void;
}>();

const Progress = ref<number>(-10);
const StopProgress = ref<ReturnType<typeof setInterval>>();

onMounted(() => {
  StopProgress.value = setInterval(() => {
    Progress.value += 1;
    if (Progress.value == 100) abortProgress();
  }, 30);
});

onUnmounted(() => clearInterval(StopProgress.value));

const abortProgress = () => {
  clearInterval(StopProgress.value);
  emits("on:close");
};
</script>

<template>
  <div
    :class="[
      'w-fit h-10 relative border-l-2 overflow-hidden  rounded-md',
      toast.role === 'alert'
        ? 'border-l-red-500 bg-red-100'
        : 'border-l-green-500 bg-green-100',
    ]"
  >
    <div
      class="bg-white"
      :style="`position:absolute;width:${Progress}%;height:100%;`"
    ></div>
    <div class="grid grid-cols-[1fr_40px] gap-2 items-center pl-4 py-2">
      <span
        :class="[
          'z-10  font-medium',
          toast.role === 'alert' ? 'text-red-600' : 'text-green-600',
        ]"
        >{{ toast.text }}</span
      >
      <span
        @click="abortProgress"
        :class="[
          'w-full h-full flex cursor-pointer  transition-all duration-200 transform hover:fill-gray-800 items-center justify-end pr-[12px]',
          toast.role === 'alert' ? 'fill-red-600' : 'fill-green-600',
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
          <path
            d="m12 13.4-4.9 4.9q-.275.275-.7.275-.425 0-.7-.275-.275-.275-.275-.7 0-.425.275-.7l4.9-4.9-4.9-4.9q-.275-.275-.275-.7 0-.425.275-.7.275-.275.7-.275.425 0 .7.275l4.9 4.9 4.9-4.9q.275-.275.7-.275.425 0 .7.275.275.275.275.7 0 .425-.275.7L13.4 12l4.9 4.9q.275.275.275.7 0 .425-.275.7-.275.275-.7.275-.425 0-.7-.275Z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

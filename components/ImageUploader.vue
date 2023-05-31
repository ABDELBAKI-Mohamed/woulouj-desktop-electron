<script setup lang="ts">
const emits = defineEmits<{
  (event: "on:save", path: any): void;
}>();

const file = ref<string>("");

const inputChange = (e: any) => {
  emits("on:save", e.target.files[0] || e.dataTransfer.files[0]);
  file.value = e.target.files[0].path;
};
</script>

<template>
  <div
    class="w-36 relative m-auto h-36 rounded-md border overflow-hidden flex text-black justify-center items-center"
  >
    <img
      v-if="file"
      :src="file"
      class="absolute top-0 rounded-md object-cover w-full h-full"
    />
    <!-- src="" -->
    <div
      class="w-full bg-white/40 transition-all flex justify-center items-center rounded-md overflow-hidden duration-200 group hover:bg-white/30 absolute top-0 z-10 h-full"
    >
      <input
        @change="inputChange"
        type="file"
        class="w-full opacity-0 absolute text-gray-500 z-10 rounded-md transition-all duration-200 hover:scale-125 h-full hover:text-black justify-center items-center"
      />
      <img class="m-auto" src="../assets/svgs/inbox.svg" alt="" />
    </div>
  </div>
</template>

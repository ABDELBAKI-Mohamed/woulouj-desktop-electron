<script setup lang="ts">
const { toggleModal, deleteTitle, rowId, deleteFunction } = useGlobalState();
</script>

<template>
  <div
    class="w-1/2 rounded-md h-fit z-50 gap-3 flex flex-col bg-white p-2 min-w-[350px]"
  >
    <h1
      class="font-semibold text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      {{ deleteTitle }}
    </h1>
    <div class="flex gap-2">
      <UiButton
        :Disable="false"
        colorTheme="a"
        @on:click="deleteFunction(rowId), toggleModal(false)"
      >
        confirm
      </UiButton>
      <UiButton :Disable="false" colorTheme="b" @on:click="toggleModal(false)">
        No
      </UiButton>
    </div>
  </div>
</template>

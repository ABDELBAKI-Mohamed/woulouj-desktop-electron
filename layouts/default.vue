<script setup lang="ts">
const { showmodal } = useGlobalState();
const { showtoast, toast } = useToast();
</script>

<template>
  <main class="w-screen h-screen flex flex-col">
    <Navigation />
    <div id="teleport-parent" class="w-full relative h-full">
      <div
        v-if="showtoast"
        class="h-fit w-full left-0 mt-4 absolute flex justify-center items-center z-40"
      >
        <UiToast :toast="toast" @on:close="showtoast = false" />
      </div>
      <slot></slot>
      <Transition appear>
        <div
          v-if="showmodal"
          class="absolute w-full h-full flex justify-center items-center bg-gray-500/20 top-0 left-0 z-20"
        >
          <UiModal v-if="showmodal" />
        </div>
      </Transition>
    </div>
  </main>
</template>

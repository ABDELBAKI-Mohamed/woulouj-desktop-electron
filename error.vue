<script setup lang="ts">
const clear = () => clearError({ redirect: "/" });
defineProps(["error"]);
onBeforeMount(() => clear());
</script>

<template>
  <section class="w-full h-full flex">
    <div class="w-screen h-screen flex justify-center flex-col items-center">
      <div class="w-[300px] flex justify-center items-center">
        <!-- <UiButton :Disable="false" colorTheme="a" @on:click="clear">
          Get started
        </UiButton> -->
      </div>
    </div>
  </section>
</template>

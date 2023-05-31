<script setup lang="ts">
// import useGlobalState from "~~/composables/useGlobalState";
// import useGroup from "~~/composables/useGroup";

const { Groups } = useGroup();
const { toggleModal } = useGlobalState();

const RouteParams = useRoute().params as Record<
  "language" | "level" | "module" | "age",
  string
>;
</script>

<template>
  <section class="w-full h-full flex">
    <div class="w-full h-full flex justify-center flex-col items-center">
      <div class="w-full h-full grid grid-cols-1 grid-rows-1">
        <div class="w-full h-full flex flex-col justify-center items-center">
          <h1>Choose a group</h1>
          <div class="w-fit grid gap-2 grid-cols-3">
            <NuxtLink
              :to="getRightPath(useRoute().path, String(group.id))"
              v-for="(group, index) of Groups.filter(
                (g) =>
                  g.language == RouteParams.language &&
                  g.module == RouteParams.module &&
                  g.level == RouteParams.level &&
                  g.age == RouteParams.age
              )"
              :key="index"
              class="h-44 w-48"
            >
              <div
                class="w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 flex justify-center rounded-md items-center bg-gray-200/50"
              >
                <span
                  class="text-center text-xl text-gray-900 font-bold bg-white rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
                >
                  {{ group.name }}
                </span>
              </div>
            </NuxtLink>
          </div>
          <div class="w-full justify-center items-center flex h-28">
            <UiButton
              color-theme="a"
              @on:click="toggleModal(true, 'createGroup')"
              :Disable="false"
            >
              add new group
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

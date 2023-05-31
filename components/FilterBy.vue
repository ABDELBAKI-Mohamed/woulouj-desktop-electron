<script setup lang="ts">
defineEmits<{
  (event: "on:close", id: string): void;
}>();

defineProps<{
  IsByLanguage: boolean;
  IsByLevel: boolean;
  IsByModule: boolean;
  IsByAge: boolean;
}>();

const { getLevels, getModules } = useLanguagesStore();

const ByLanguage = ref<string>();
const ByLevel = ref<string>();
const ByModule = ref<string>();
const ByAge = ref<string>();
</script>

<template>
  <div
    class="h-full relative justify-center items-center bg-white rounded-md w-fit min-w-[24rem] flex flex-col flex-wrap gap-2"
  >
    <div class="w-full gap-2 flex">
      <UiSelect
        v-if="IsByLanguage"
        @item:select="(item) => (ByLanguage = item.text.toLowerCase())"
        DisplayFeild="text"
        :Items="[
          {
            text: 'Français',
          },
          {
            text: 'Anglaise',
          },
          {
            text: 'Allemande',
          },
          {
            text: 'Italien',
          },
        ]"
      >
        Select Language
      </UiSelect>
      <UiSelect
        v-if="IsByLevel"
        @item:select="(item) => (ByLevel = item.text)"
        DisplayFeild="text"
        :Items="
          getLevels(ByLanguage ?? 'italien').map((ite) => ({ text: ite }))
        "
      >
        Levels
      </UiSelect>
      <UiSelect
        v-if="IsByModule"
        @item:select="(item) => (ByModule = item.text)"
        DisplayFeild="text"
        :Items="
          getModules(ByLanguage ?? 'italien', ByLevel ?? 'A1').map((ite) => ({
            text: ite,
          }))
        "
      >
        Modules
      </UiSelect>
      <UiSelect
        v-if="IsByAge"
        @item:select="(item) => (ByAge = item.text.toLowerCase())"
        DisplayFeild="text"
        :Items="[
          {
            text: 'junior',
          },
          {
            text: 'youth',
          },
          {
            text: 'adults',
          },
        ]"
      >
        Age
      </UiSelect>
    </div>
  </div>
</template>

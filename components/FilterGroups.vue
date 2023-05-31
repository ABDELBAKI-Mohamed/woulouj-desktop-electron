<script setup lang="ts">
const emit = defineEmits<{
  (event: "on:select", group: any): void;
  (event: "on:close", id: string): void;
}>();

const { Groups } = useGroup();
const { getLevels, getModules } = useLanguagesStore();

const selected = ref<number>(0);

const ByLanguage = ref<string>();
const ByLevel = ref<string>();
const ByModule = ref<string>();
const ByAge = ref<string>();

const filteredGroups = computed(() =>
  Groups.value
    .filter((group) => JSON.stringify(group).includes(ByLanguage.value ?? ""))
    .filter((group) => JSON.stringify(group).includes(ByLevel.value ?? ""))
    .filter((group) => JSON.stringify(group).includes(ByModule.value ?? ""))
    .filter((group) => JSON.stringify(group).includes(ByAge.value ?? ""))
);

const selectGroup = (group: any) => {
  selected.value = group.id === selected.value ? 0 : group.id;
  emit("on:select", group);
};
</script>

<template>
  <div
    class="h-full relative justify-start items-start bg-white p-2 rounded-md w-fit min-w-[24rem] flex flex-col flex-wrap gap-2"
  >
    <span
      class="w-4 h-4 bg-white absolute top-[calc(55%)] rotate-45 -left-[0.4rem] -z-10"
    >
    </span>
    <div class="w-full gap-2 flex border-b-2 pb-1">
      <UiSelect
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
        @item:select="(item) => (ByLevel = item.text)"
        DisplayFeild="text"
        :Items="
          getLevels(ByLanguage ?? 'italien').map((ite) => ({ text: ite }))
        "
      >
        Levels
      </UiSelect>
      <UiSelect
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
    <div class="flex gap-2">
      <UiButton
        v-for="group in filteredGroups"
        @on:click="selectGroup(group)"
        :Disable="false"
        :colorTheme="selected === group?.id ? '' : 'b'"
      >
        {{ group.name }}
      </UiButton>
    </div>
    <div class="w-full mt-auto self-end flex-col flex">
      <UiButton @on:click="$emit('on:close')" :Disable="false" colorTheme="a">
        Done
      </UiButton>
    </div>
  </div>
</template>

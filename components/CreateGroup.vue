<script setup lang="ts">
import useLanguagesStore from "~~/composables/useLanguagesStore";
import useGlobalState from "~~/composables/useGlobalState";
import useTeacher from "~~/composables/useTeacher";
import useGroup from "~~/composables/useGroup";
import useToast from "~~/composables/useToast";
import { newGroupT } from "~~/types";

const { getLevels, getModules } = useLanguagesStore();
const { toggleModal } = useGlobalState();
const { createGroup } = useGroup();
const { toggleToast } = useToast();
const { Teachers } = useTeacher();

const { language, level, module, age } = useRoute().params as Record<
  "language" | "level" | "module" | "age",
  string
>;

const IsGroupPage = computed(() => useRoute().fullPath == "/groups/");

const group = reactive<newGroupT>({
  languagename: language,
  levelname: level,
  modulename: module,
  agename: age,
  name: String(),
  teacherid: 0,
});

const createAgroup = async () => {
  try {
    if (group.name !== "" && group.teacherid !== 0) {
      await createGroup(group);
      toggleModal(false);
      return;
    }
    toggleToast({ text: "fill all the feilds", role: "alert" });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div
    class="w-1/2 h-fit max-w-xl z-50 gap-3 flex flex-col rounded-md bg-white p-2 min-w-[350px]"
  >
    <div
      class="font-semibold grid grid-cols-6 text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
    >
      <span class="col-span-4 col-start-2"> create a group </span>
      <span
        @click="toggleModal(false)"
        class="cursor-pointer w-full flex items-center justify-end h-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
          <path
            d="m12 13.4-4.9 4.9q-.275.275-.7.275-.425 0-.7-.275-.275-.275-.275-.7 0-.425.275-.7l4.9-4.9-4.9-4.9q-.275-.275-.275-.7 0-.425.275-.7.275-.275.7-.275.425 0 .7.275l4.9 4.9 4.9-4.9q.275-.275.7-.275.425 0 .7.275.275.275.275.7 0 .425-.275.7L13.4 12l4.9 4.9q.275.275.275.7 0 .425-.275.7-.275.275-.7.275-.425 0-.7-.275Z"
          />
        </svg>
      </span>
    </div>
    <div class="h-full w-full flex flex-col gap-2">
      <UiInput
        Placeholder="nom du groupe"
        @on:input="(text:string | number)=> group.name = String(text)"
      />
      <UiSelect
        v-if="IsGroupPage"
        @item:select="(item) => (group.languagename = item.text.toLowerCase())"
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
        Choisir la langue
      </UiSelect>
      <UiSelect
        v-if="IsGroupPage"
        @item:select="(item) => (group.levelname = item.text)"
        DisplayFeild="text"
        :Items="
          getLevels(group.languagename ?? 'italien').map((ite) => ({
            text: ite,
          }))
        "
      >
        Choisir le niveau
      </UiSelect>
      <UiSelect
        v-if="IsGroupPage"
        @item:select="(item) => (group.modulename = item.text)"
        DisplayFeild="text"
        :Items="
          getModules(
            group.languagename ?? 'italien',
            group.levelname ?? 'A1'
          ).map((ite) => ({
            text: ite,
          }))
        "
      >
        Choisir le module
      </UiSelect>
      <UiSelect
        v-if="IsGroupPage"
        @item:select="(item) => (group.agename = item.text.toLowerCase())"
        DisplayFeild="text"
        :Items="[
          {
            text: 'juniors',
          },
          // {
          //   text: 'youth',
          // },
          {
            text: 'adults',
          },
        ]"
      >
        Choisir l'âge
      </UiSelect>
      <UiSelect
        DisplayFeild="fullname"
        @item:select="(item) => (group.teacherid = Number(item.id))"
        :Items="Teachers"
      >
        Choisir le professeur
      </UiSelect>
      <UiButton @on:click="createAgroup" :Disable="false" colorTheme="a">
        add Group
      </UiButton>
    </div>
  </div>
</template>

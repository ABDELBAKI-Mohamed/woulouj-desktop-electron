<script setup lang="ts">
import useGlobalState from "~~/composables/useGlobalState";
import useAssistant from "~~/composables/useAssistant";
import useToast from "~~/composables/useToast";
import { newAssistantT } from "~~/types";

const { toggleModal } = useGlobalState();
const { createAssistant, AssistantFeilds, AssistantPlaceHolders } =
  useAssistant();
const { toggleToast } = useToast();

const Assistant = reactive<newAssistantT>({
  firstname: "",
  lastname: "",
});

const createAAssistant = async () => {
  try {
    if (Assistant.firstname && Assistant.lastname) {
      await createAssistant(Assistant);
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
      <span class="col-span-4 col-start-2"> create a Assistant </span>
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
      <ImageUploader @on:save="(value) => (Assistant.image = value)" />
      <UiInput
        v-for="(feild, index) of AssistantFeilds"
        :Placeholder="AssistantPlaceHolders[index]"
        @on:input="(text:any)=> Assistant[feild] = text"
      />
      <UiButton @on:click="createAAssistant" :Disable="false" colorTheme="a">
        add Assistant
      </UiButton>
    </div>
  </div>
</template>

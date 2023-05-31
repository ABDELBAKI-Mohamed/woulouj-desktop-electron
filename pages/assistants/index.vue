<script setup lang="ts">
import useAssistant from "~~/composables/useAssistant";
import useGlobalState from "~~/composables/useGlobalState";

const { Assistants, deleteAssistant } = useAssistant();
const { toggleModal, defineFunction, rowId } = useGlobalState();
const searchParam = ref<string>("");

useHead({
  title: "Assistants",
});

const deleteRow = (id: number) => {
  rowId.value = id;
  defineFunction(deleteAssistant);
  toggleModal(
    true,
    "deleteRow",
    "are you sure you wanna delete this assistant"
  );
};
</script>

<template>
  <section class="w-full h-full flex px-4">
    <div class="w-full h-full flex justify-center flex-col items-center">
      <div class="w-full h-full grid grid-cols-1 grid-rows-[80px_1fr]">
        <div class="w-full h-full items-center flex justify-between">
          <div class="w-[300px]">
            <UiInput
              Placeholder="Search"
              @on:input="(value:string)=> searchParam = value"
            />
          </div>
          <UiButton
            @on:click="toggleModal(true, 'createAssistant')"
            colorTheme="a"
            :Disable="false"
          >
            Create Assistant
          </UiButton>
        </div>
        <UiTable
          @row:delete="deleteRow"
          @row:update=""
          isDeleteRow
          isUpdateRow
          isDetails
          isShowImage
          :params="searchParam"
          :feilds="['firstname', 'lastname', 'phone', 'email']"
          :labels="['firstname', 'lastname', 'phone', 'email']"
          :items="Assistants"
        />
      </div>
    </div>
  </section>
</template>

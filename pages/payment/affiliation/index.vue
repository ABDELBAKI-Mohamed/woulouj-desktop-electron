<script setup lang="ts">
import usePayment from "~~/composables/usePayment";
import useGlobalState from "~~/composables/useGlobalState";

const { Affiliations, deleteAffiliation } = usePayment();
const { toggleModal, defineFunction, rowId } = useGlobalState();

const searchParam = ref<string>("");

useHead({
  title: "Affiliations",
});

const deleteRow = (id: number) => {
  rowId.value = id;
  defineFunction(deleteAffiliation);
  toggleModal(
    true,
    "deleteRow",
    "are you sure you wanna delete this Affiliation"
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
            @on:click="toggleModal(true, 'createAffiliation')"
            colorTheme="a"
            :Disable="false"
          >
            Create Affiliation
          </UiButton>
        </div>
        <UiTable
          @row:delete="deleteRow"
          @row:update=""
          :feilds="['studentName', 'amount', 'date', 'groupName', 'month']"
          :labels="['student', 'amount', 'date', 'group', 'month']"
          :params="searchParam"
          :items="Affiliations"
          :isDetails="false"
          isDeleteRow
          isUpdateRow
        />
      </div>
    </div>
  </section>
</template>

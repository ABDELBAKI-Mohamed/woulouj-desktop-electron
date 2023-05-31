<script setup lang="ts">
import usePayment from "~~/composables/usePayment";
import useGlobalState from "~~/composables/useGlobalState";

const { Salaries, deleteSalary } = usePayment();
const { toggleModal, defineFunction, rowId } = useGlobalState();

const searchParam = ref<string>("");

useHead({
  title: "Salary",
});

const deleteRow = (id: number) => {
  rowId.value = id;
  defineFunction(deleteSalary);
  toggleModal(true, "deleteRow", "are you sure you wanna delete this Salary");
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
            @on:click="toggleModal(true, 'createSalary')"
            colorTheme="a"
            :Disable="false"
          >
            Create Salary
          </UiButton>
        </div>
        <UiTable
          @row:delete="deleteRow"
          @row:update=""
          :feilds="['fullname', 'amount', 'date', 'month', 'group']"
          :labels="['teacher', 'amount', 'date', 'month', 'group']"
          :params="searchParam"
          :items="Salaries"
          :is-details="false"
          is-delete-row
          is-update-row
        />
      </div>
    </div>
  </section>
</template>

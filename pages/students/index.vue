<script setup lang="ts">
import useGlobalState from "~~/composables/useGlobalState";
import useStudent from "~~/composables/useStudent";

const { Students, StudentFeilds, deleteStudent } = useStudent();
const { toggleModal, defineFunction, rowId } = useGlobalState();
const searchParam = ref<string>("");

useHead({
  title: "Students",
});

const deleteRow = (id: number) => {
  rowId.value = id;
  defineFunction(deleteStudent);
  toggleModal(true, "deleteRow", "are you sure you wanna delete this student");
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
            @on:click="toggleModal(true, 'createStudent')"
            colorTheme="a"
            :Disable="false"
          >
            Create Student
          </UiButton>
        </div>
        <UiTable
          isDeleteRow
          isShowImage
          isUpdateRow
          isDetails
          @row:delete="deleteRow"
          @row:update=""
          :labels="StudentFeilds"
          :feilds="StudentFeilds"
          :params="searchParam"
          :items="Students"
        />
      </div>
    </div>
  </section>
</template>

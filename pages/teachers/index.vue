<script setup lang="ts">
import useTeacher from "~~/composables/useTeacher";
import useGlobalState from "~~/composables/useGlobalState";

useHead({
  title: "Teachers",
});

const { Teachers, TeacherFeilds, deleteTeacher } = useTeacher();
const { toggleModal, rowId, defineFunction } = useGlobalState();
const searchParam = ref<string>("");

const deleteRow = (id: number) => {
  rowId.value = id;
  defineFunction(deleteTeacher);
  toggleModal(true, "deleteRow", "are you sure you wanna delete this teacher");
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
            @on:click="toggleModal(true, 'createTeacher')"
            colorTheme="a"
            :Disable="false"
          >
            Create Teacher
          </UiButton>
        </div>
        <UiTable
          @row:delete="deleteRow"
          @row:update=""
          :labels="TeacherFeilds"
          :feilds="TeacherFeilds"
          :params="searchParam"
          :items="Teachers ?? []"
          isDeleteRow
          isUpdateRow
          isShowImage
          isDetails
        />
      </div>
    </div>
  </section>
</template>

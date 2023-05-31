<script setup lang="ts">
import { A } from "@tauri-apps/api/cli-3e179c0b";
import useGlobalState from "~~/composables/useGlobalState";
import useStudent from "~~/composables/useStudent";
import useToast from "~~/composables/useToast";
import { newStudentT } from "~~/types";

const { toggleModal } = useGlobalState();
const { toggleToast } = useToast();
const { createStudent, StudentFeilds, StudentPlaceHolders } = useStudent();

const IsSelectGroup = ref<boolean>(false);

const student = reactive<newStudentT>({
  firstname: "",
  lastname: "",
  phone: "",
  // groupid: 1,
});

const groupName = ref<string>();

// const selectGroup = (group: any) => {
//   student.groupid = student.groupid == group.id ? 1 : group.id;
//   groupName.value = groupName.value == group.name ? null : group.name;
// };

const createAStudent = async () => {
  try {
    if (student.firstname && student.lastname) {
      await createStudent(student);
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
    :class="[
      'w-fit h-fit grid transition-all duration-150 gap-3 justify-center items-center min-w-[50%]',
      IsSelectGroup ? 'grid-cols-2 grid-rows-1' : 'grid-cols-1 grid-rows-1',
    ]"
  >
    <div
      class="max-w-2xl m-auto w-full z-50 gap-3 flex flex-col rounded-md bg-white p-2"
    >
      <div
        class="font-semibold grid grid-cols-6 text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
      >
        <span class="col-span-4 col-start-2"> create a student </span>
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
        <ImageUploader @on:save="(value) => (student.image = value)" />
        <UiInput
          v-for="(feild, index) of StudentFeilds"
          :Placeholder="StudentPlaceHolders[index]"
          @on:input="(text:any)=> student[feild] = text"
        />
        <!-- <UiButton
          @on:click="IsSelectGroup = !IsSelectGroup"
          :Disable="false"
          colorTheme="b"
        >
          {{ groupName ?? "select a group" }}
        </UiButton> -->
        <UiButton @on:click="createAStudent" :Disable="false" colorTheme="a">
          add Student
        </UiButton>
      </div>
    </div>
    <!-- <FilterGroups
      v-if="IsSelectGroup"
      @on:close="IsSelectGroup = false"
      @on:select="selectGroup"
    /> -->
  </div>
</template>

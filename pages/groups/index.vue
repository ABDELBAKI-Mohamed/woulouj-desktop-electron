<script setup lang="ts">
import useGlobalState from "~~/composables/useGlobalState";
import useGroup from "~~/composables/useGroup";

const { Groups, GroupFeilds, deleteGroup } = useGroup();
const { toggleModal, defineFunction, rowId } = useGlobalState();
const searchParam = ref<string>("");

useHead({
  title: "Groups",
});

const deleteRow = (id: number) => {
  rowId.value = id;
  defineFunction(deleteGroup);
  toggleModal(true, "deleteRow", "are you sure you wanna delete this group?");
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
          <FilterBy IsByLanguage IsByLevel IsByModule IsByAge />
          <UiButton
            @on:click="toggleModal(true, 'createGroup')"
            colorTheme="a"
            :Disable="false"
          >
            Create Group
          </UiButton>
        </div>
        <UiTable
          isDeleteRow
          isUpdateRow
          isDetails
          @row:delete="deleteRow"
          @row:update=""
          :feilds="GroupFeilds"
          :labels="[
            'name',
            'teacher name',
            'Language',
            'level',
            'module',
            'age',
          ]"
          :params="searchParam"
          :items="Groups"
        />
      </div>
    </div>
  </section>
</template>

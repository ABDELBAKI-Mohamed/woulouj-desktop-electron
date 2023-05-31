<script setup lang="ts">
import useGlobalState from "~~/composables/useGlobalState";
import usePayment from "~~/composables/usePayment";
import useToast from "~~/composables/useToast";
import { newAffiliationT } from "~~/types";

const { createAffiliation } = usePayment();
const { toggleModal } = useGlobalState();
const { toggleToast } = useToast();
const { Students } = useStudent();

const IsSelectMonth = ref<boolean>(false);
const IsSelectGroup = ref<boolean>(false);
const months = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const affliation = reactive<newAffiliationT>({
  studentid: 0,
  group: 0,
  amount: 0,
  months: Array(),
});

const groupName = ref<string>();

const create = async () => {
  try {
    if (affliation.studentid !== 0 && affliation.group) {
      await createAffiliation(affliation);
      toggleModal(false);
      return;
    }
    toggleToast({ text: "fill all the feilds", role: "alert" });
  } catch (error) {
    console.log(error);
  }
};

const SelectGroup = (group: any) => {
  affliation.group = group.id === affliation.group ? 0 : group.id;
  groupName.value = affliation.group == 0 ? null : group.name;
};

const SelectMonth = (month: number) => {
  if (!affliation.months.includes(month)) {
    affliation.months.push(month);
    return;
  }
  affliation.months.splice(affliation.months.indexOf(month), 1);
};
</script>

<template>
  <div
    :class="[
      'w-fit h-fit grid transition-all duration-150 gap-3 justify-center items-center min-w-[50%]',
      IsSelectMonth || IsSelectGroup
        ? 'grid-cols-2 grid-rows-1'
        : 'grid-cols-1 grid-rows-1',
    ]"
  >
    <!-- main create -->
    <div
      class="max-w-xl m-auto w-full z-50 gap-3 flex flex-col rounded-md bg-white p-2"
    >
      <div
        class="font-semibold grid grid-cols-6 text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
      >
        <span class="col-span-4 col-start-2"> create a Affiliation </span>
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
        <UiSelect
          @item:select="(item) => (affliation.studentid = Number(item.id))"
          DisplayFeild="fullname"
          :Items="Students.map((st) => ({ fullname: st.fullname, id: st.id }))"
        >
          Select student
        </UiSelect>
        <UiButton
          @on:click="(IsSelectMonth = !IsSelectMonth), (IsSelectGroup = false)"
          :Disable="false"
          colorTheme="b"
        >
          {{
            affliation.months.length > 0
              ? `${affliation.months.length} months selected`
              : "select months"
          }}
        </UiButton>
        <UiButton
          @on:click="(IsSelectGroup = !IsSelectGroup), (IsSelectMonth = false)"
          :Disable="false"
          colorTheme="b"
        >
          {{ groupName ?? "select a group" }}
        </UiButton>

        <UiInput
          Type="number"
          Placeholder="amount"
          @on:input="(amount) => (affliation.amount = Number(amount))"
        />

        <UiButton @on:click="create" :Disable="false" colorTheme="a">
          Create Aff
        </UiButton>
      </div>
    </div>
    <!-- choose  -->
    <div
      v-if="IsSelectMonth"
      class="h-fit justify-start relative items-start bg-white p-2 rounded-md w-fit max-w-[26rem] flex flex-wrap gap-2"
    >
      <span
        class="w-4 h-4 bg-white absolute top-[calc(50%-2rem)] rotate-45 -left-[0.4rem] -z-10"
      >
      </span>
      <div
        class="font-semibold grid w-full grid-cols-6 text-lg text-gray-800 border-b-2 border-b-gray-500 pb-2 uppercase text-center"
      >
        <span class="col-span-4 col-start-2"> Months </span>
        <span
          @click="IsSelectMonth = false"
          class="cursor-pointer w-full h-full"
        >
          x
        </span>
      </div>
      <div class="w-full h-full flex flex-wrap gap-2">
        <UiButton
          v-for="(month, index) in months"
          @on:click="SelectMonth(index + 1)"
          :Disable="false"
          :colorTheme="affliation.months.includes(index + 1) ? '' : 'b'"
        >
          {{ month }}
        </UiButton>
      </div>
      <div class="w-full flex-col flex">
        <UiButton
          @on:click="IsSelectMonth = false"
          :Disable="false"
          colorTheme="a"
        >
          Done
        </UiButton>
      </div>
    </div>
    <!-- choose group -->
    <FilterGroups
      v-if="IsSelectGroup"
      @on:close="IsSelectGroup = false"
      @on:select="SelectGroup"
    />
  </div>
</template>

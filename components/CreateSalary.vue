<script setup lang="ts">
import useGlobalState from "~~/composables/useGlobalState";
import usePayment from "~~/composables/usePayment";
import useToast from "~~/composables/useToast";
import useTeacher from "~~/composables/useTeacher";
import useGroup from "~~/composables/useGroup";
import { GroupT, newSalaryT, AffiliationT } from "~~/types";

const { createSalary } = usePayment();
const { toggleModal } = useGlobalState();
const { toggleToast } = useToast();
const { Teachers, getTeacherPayments } = useTeacher();
const { Groups } = useGroup();

const amount = ref<number>();

const IsSelectMonth = ref<boolean>(false);
const IsSelectGroup = ref<boolean>(false);

const salary = reactive<newSalaryT>({
  teacherid: 0,
  amount: 0,
  groupid: 0,
  monthid: 0,
  date: "",
  payment_type: "",
  payment_amount: 0,
});

const IsOkayToContinue = (watchedS: newSalaryT) => {
  return (
    watchedS.monthid !== 0 &&
    watchedS.groupid !== 0 &&
    watchedS.payment_type !== "" &&
    watchedS.payment_amount !== 0
  );
};

const unWatch = watch(
  () => salary,
  async (watchedS) => {
    if (IsOkayToContinue(watchedS)) {
      if (watchedS.payment_type === "fix") {
        amount.value = watchedS.payment_amount;
        salary.amount = amount.value;
        return;
      }
      const { data, error } = await getTeacherPayments(
        watchedS.monthid,
        watchedS.groupid
      );
      if (error) {
        console.log(error);
      }
      amount.value =
        (data?.reduce((prv: number, cr: AffiliationT) => prv + cr.amount, 0) ??
          0) *
        (watchedS.payment_amount / 100);
      salary.amount = amount.value;
    }
  },
  {
    deep: true,
  }
);

onUnmounted(() => unWatch());

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

const create = async () => {
  try {
    if (salary.teacherid !== 0 && salary.groupid !== 0) {
      await createSalary(salary);
      toggleModal(false);
      return;
    }
    toggleToast({ text: "fill all the feilds", role: "alert" });
  } catch (error) {
    console.log(error);
  }
};

const SelectGroup = (group: GroupT) => {
  if (salary.groupid !== group.id) {
    salary.groupid = group.id;
    return;
  }
  salary.groupid = 0;
};

const SelectMonth = (month: number) => {
  if (salary.monthid !== month) {
    salary.monthid = month;
    return;
  }
  salary.monthid = 0;
};
</script>

<template>
  <div
    :class="[
      'w-fit h-fit grid transition-all duration-150 gap-3 justify-center items-center min-w-[350px]',
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
        <span class="col-span-4 col-start-2"> create a Salary </span>
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
          @item:select="(item) => (salary.teacherid = Number(item.id))"
          DisplayFeild="fullname"
          :Items="Teachers.map((st) => ({ fullname: st.fullname, id: st.id }))"
        >
          Select Teacher
        </UiSelect>
        <UiButton
          @on:click="(IsSelectMonth = !IsSelectMonth), (IsSelectGroup = false)"
          :Disable="false"
          colorTheme="b"
        >
          {{
            salary.monthid !== 0 ? months[salary.monthid - 1] : "select months"
          }}
        </UiButton>
        <UiButton
          @on:click="(IsSelectGroup = !IsSelectGroup), (IsSelectMonth = false)"
          :Disable="false"
          colorTheme="b"
        >
          {{
            salary.groupid !== 0
              ? Groups.find((gr) => gr.id === salary.groupid)?.name
              : "select a group"
          }}
        </UiButton>

        <div class="w-full grid grid-cols-2 gap-2">
          <UiSelect
            @item:select="
              (item) => (salary.payment_type = item.text.toLowerCase())
            "
            DisplayFeild="text"
            :Items="[
              {
                text: 'fix',
              },
              {
                text: 'pourcentage',
              },
            ]"
          >
            {{ salary.payment_type == "" ? "method" : salary.payment_type }}
          </UiSelect>
          <UiInput
            Placeholder="amount"
            Type="number"
            @on:input="(v) => (salary.payment_amount = Number(v))"
          />
        </div>
        <div
          class="px-2 py-1 flex items-center h-10 focus:outline-0 transition-all duration-200 focus:placeholder-a w-full border-2 rounded-md"
        >
          {{ amount ?? 0 }} DH
        </div>
        <!-- <UiInput
          Type="number"
          Placeholder="amount"
          :Value="amount"
          @on:input="(amount) => (salary.amount = Number(amount))"
        /> -->

        <UiButton @on:click="create" :Disable="false" colorTheme="a">
          Create Salary
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
          :colorTheme="salary.monthid === index + 1 ? '' : 'b'"
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
      :selected="salary.groupid"
      :groups="Groups"
      @on:select="SelectGroup"
    />
  </div>
</template>

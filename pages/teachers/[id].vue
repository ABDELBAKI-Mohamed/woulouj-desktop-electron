<script setup lang="ts">
import { GroupT } from "~~/types";

const { Teacher, getTeacherById, getTeacherPayments } = useTeacher();
const { Groups } = useGroup();

// computed vars
const teacherid = computed(() => Number(useRoute().params.id));
const relatedGroups = computed(() =>
  Groups.value.filter((gr) => gr.teacherid == teacherid.value)
);
// vars
const selectedMonth = ref<number>();
const selectedGroup = ref<GroupT>();
const amount = ref<number>(0);
// hooks
onBeforeMount(() => getTeacherById(teacherid.value));

useHead({
  title: `Teacher : ${Teacher.value?.fullname}`,
});

// onMounted(() => {
//   watch([selectedGroup, selectedMonth], async ([group, month]) => {
//     if (month && group) {
//       if (group.payment.type === "fix") {
//         amount.value = group.payment.amount;
//         return;
//       }
//       const { data, error } = await getTeacherPayments(month, group.id);
//       if (error) {
//         console.log(error);
//       }
//       amount.value =
//         (data?.reduce((prv: number, cr: any) => prv + cr?.amount, 0) ?? 0) *
//         (group.payment.amount / 100);
//     }
//   });
// });

// const makePayment = async () => {
//   try {
//     if (selectedMonth.value && selectedGroup.value?.id) {
//       await createSalary({
//         teacherid: teacherid.value,
//         groupid: selectedGroup.value?.id,
//         monthid: selectedMonth.value,
//         amount: amount.value,
//         date: "",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

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
</script>

<template>
  <section class="w-full h-full flex px-4 py-6">
    <div class="w-full h-full flex justify-center flex-col items-center">
      <div class="w-full h-full flex flex-row gap-2">
        <UiCard :Item="Teacher" />
        <div
          class="w-full h-fit flex flex-col bg-white shadow-md px-2 py-2 rounded-md"
        >
          <div class="flex flex-col gap-1 w-full">
            <h1 class="underline">Groups:</h1>
            <div class="flex gap-2 flex-wrap">
              <UiButton
                v-for="group in relatedGroups"
                @on:click="selectedGroup = group"
                :colorTheme="selectedGroup?.id == group.id ? 'a' : 'b'"
                :Disable="false"
              >
                {{ group.name }}
              </UiButton>
            </div>
          </div>
          <div class="flex flex-col gap-1 w-full">
            <h1 class="underline">Months:</h1>
            <div class="flex gap-2 flex-wrap">
              <UiButton
                v-for="(month, index) in months"
                @on:click="selectedMonth = index + 1"
                :colorTheme="selectedMonth == index + 1 ? 'a' : 'b'"
                :Disable="false"
              >
                {{ month }}
              </UiButton>
              <!-- all the groups related to this teacher -->
            </div>
          </div>
          <div class="flex flex-col gap-1 w-full">
            <h1 class="underline">Amount:</h1>
            <div class="flex gap-2">
              <!-- <div
                class="w-full h-10 border-2 flex items-center rounded-md px-2 py-1"
              >
                {{ amount }} DH
              </div> -->
              <!-- <UiButton
                :Disable="!selectedGroup || !selectedMonth"
                @on:click="makePayment"
                colorTheme="a"
              >
                Pay
              </UiButton> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

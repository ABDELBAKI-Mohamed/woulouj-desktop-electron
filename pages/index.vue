<script setup lang="ts">
useHead({
  title: "Home",
});

const pages = [
  /*{
    page: "Pedagogy",
    path: "/languages/",
    bg: "from-sky-300 to-sky-500",
    img: "/Icons/pedagogy.png",
  },*/
  {
    page: "Students",
    path: "/students/",
    bg: "from-emerald-300 to-emerald-500",
    img: "/Icons/student.png",
  },
  {
    page: "Teachers",
    path: "/teachers/",
    bg: "from-violet-300 to-violet-500",
    img: "/Icons/teacher.png",
  },
  {
    page: "Assistants",
    path: "/assistants/",
    bg: "from-orange-300 to-orange-500",
    img: "/Icons/assistant.png",
  },
  {
    page: "Affiliation",
    path: "/payment/affiliation",
    bg: "from-blue-300 to-blue-500",
    img: "/Icons/affiliation.png",
  },
  {
    page: "Salary",
    path: "/payment/salary",
    bg: "from-amber-300 to-amber-500",
    img: "/Icons/salary.png",
  },
  {
    page: "Groups",
    path: "/groups/",
    bg: "from-amber-300 to-amber-500",
    img: "/Icons/groups.png",
  },
];
</script>

<template>
  <section class="w-full h-full flex">
    <div class="w-full h-full flex justify-center flex-col items-center">
      <div class="w-fit grid gap-12 md:grid-cols-4 xl:grid-cols-6 px-2">
        <!-- <NuxtLink
          v-for="(page, index) in pages"
          :to="page.path"
          :key="index"
          class="w-40"
        >
          <div
            :class="page.bg"
            class="bg-gradient-to-br w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 rounded-lg items-center bg-gray-200/50"
          >
            <div :class="'p-2 mx-auto w-24 rounded-full'">
              <img
                class="group-hover:opacity-80 transition-all duration-250 mx-auto"
                :src="page.img"
                alt=""
              />
            </div>
            <span
              class="text-white text-center text-xl font-bold rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              {{ page.page }}
            </span>
          </div>
        </NuxtLink> -->
        <NuxtLink to="/students/" class="w-40">
          <div
            class="from-emerald-300 to-emerald-500 bg-gradient-to-br w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 rounded-lg items-center bg-gray-200/50"
          >
            <div :class="'p-2 mx-auto w-24 rounded-full'">
              <img
                class="group-hover:opacity-80 transition-all duration-250 mx-auto"
                src="~~/assets/Icons/student.png"
                alt=""
              />
            </div>
            <span
              class="text-white text-center text-xl font-bold rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              Students
            </span>
          </div>
        </NuxtLink>
        <NuxtLink to="/teachers/" class="w-40">
          <div
            class="from-violet-300 to-violet-500 bg-gradient-to-br w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 rounded-lg items-center bg-gray-200/50"
          >
            <div :class="'p-2 mx-auto w-24 rounded-full'">
              <img
                class="group-hover:opacity-80 transition-all duration-250 mx-auto"
                src="~~/assets/Icons/teacher.png"
                alt=""
              />
            </div>
            <span
              class="text-white text-center text-xl font-bold rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              Teachers
            </span>
          </div>
        </NuxtLink>
        <NuxtLink to="/assistants/" class="w-40">
          <div
            class="from-orange-300 to-orange-500 bg-gradient-to-br w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 rounded-lg items-center bg-gray-200/50"
          >
            <div :class="'p-2 mx-auto w-24 rounded-full'">
              <img
                class="group-hover:opacity-80 transition-all duration-250 mx-auto"
                src="~~/assets/Icons/assistant.png"
                alt=""
              />
            </div>
            <span
              class="text-white text-center text-xl font-bold rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              Assistants
            </span>
          </div>
        </NuxtLink>
        <NuxtLink to="/payment/affiliation" class="w-40">
          <div
            class="from-blue-300 to-blue-500 bg-gradient-to-br w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 rounded-lg items-center bg-gray-200/50"
          >
            <div :class="'p-2 mx-auto w-24 rounded-full'">
              <img
                class="group-hover:opacity-80 transition-all duration-250 mx-auto"
                src="~~/assets/Icons/affiliation.png"
                alt=""
              />
            </div>
            <span
              class="text-white text-center text-xl font-bold rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              Affiliation
            </span>
          </div>
        </NuxtLink>
        <NuxtLink to="/payment/salary" class="w-40">
          <div
            class="from-amber-300 to-amber-500 bg-gradient-to-br w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 rounded-lg items-center bg-gray-200/50"
          >
            <div :class="'p-2 mx-auto w-24 rounded-full'">
              <img
                class="group-hover:opacity-80 transition-all duration-250 mx-auto"
                src="~~/assets/Icons/salary.png"
                alt=""
              />
            </div>
            <span
              class="text-white text-center text-xl font-bold rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              Salary
            </span>
          </div>
        </NuxtLink>
        <NuxtLink to="/groups/" class="w-40">
          <div
            class="from-amber-300 to-amber-500 bg-gradient-to-br w-full h-full overflow-hidden cursor-pointer relative hover:-translate-y-1 group transition-all duration-250 rounded-lg items-center bg-gray-200/50"
          >
            <div :class="'p-2 mx-auto w-24 rounded-full'">
              <img
                class="group-hover:opacity-80 transition-all duration-250 mx-auto"
                src="~~/assets/Icons/groups.png"
                alt=""
              />
            </div>
            <span
              class="text-white text-center text-xl font-bold rounded-md px-4 z-20 py-2 flex justify-center items-center transition-all duration-250"
            >
              Groups
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

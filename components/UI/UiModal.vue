<script lang="ts">
import useGlobalState from "~~/composables/useGlobalState";
export default {
  components: {
    createGroup: defineAsyncComponent(() => import("../CreateGroup.vue")),
    createSalary: defineAsyncComponent(() => import("../CreateSalary.vue")),
    createAffiliation: defineAsyncComponent(
      () => import("../CreateAffiliation.vue")
    ),
    createTeacher: defineAsyncComponent(() => import("../CreateTeacher.vue")),
    createStudent: defineAsyncComponent(() => import("../CreateStudent.vue")),
    createAssistant: defineAsyncComponent(
      () => import("../CreateAssistant.vue")
    ),
    deleteRow: defineAsyncComponent(() => import("../Delete.vue")),
  },
  setup() {
    const { whichname } = useGlobalState();
    return {
      whichname,
    };
  },
};
</script>
<template>
  <component :is="whichname" />
</template>

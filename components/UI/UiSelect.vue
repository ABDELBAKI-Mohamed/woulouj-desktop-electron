<script setup lang="ts">
const { DisplayFeild } = defineProps<{
  Items: any[];
  DisplayFeild: string;
}>();
const emit = defineEmits<{
  (event: "item:select", item: Record<string, string>): void;
}>();

const selectedValue = ref<string>("");
const open = ref<boolean>(false);

const select = (item: any) => {
  open.value = false;
  selectedValue.value =
    item[DisplayFeild] == selectedValue.value ? "" : item[DisplayFeild];
  emit("item:select", item);
};
</script>

<template>
  <div class="relative h-10">
    <div
      :class="[
        'h-10 z-10 px-4 font-semibold w-full disabled:cursor-default disabled:hover:bg-gray-50 disabled:hover:border-gray-200 hover:bg-gray-300 hover:border-gray-300 hover:text-black text-gray-600 transition-all duration-200 flex items-center whitespace-nowrap justify-center text-center bg-gray-50 rounded-md border-2',
        selectedValue == '' ? '' : 'border-sky-400',
      ]"
    >
      <div
        @click="open = !open"
        class="w-full flex items-center text-gray-400 font-normal text-base justify-center h-full"
      >
        <slot v-if="!selectedValue"></slot>
        <span class="text-sky-400" v-else>{{ selectedValue }}</span>
      </div>
    </div>
    <Transition appear>
      <div
        v-if="open"
        class="flex rounded-md scrollbar-none bg-white scrollbar-thumb-transparent flex-col max-h-[105px] overflow-auto gap-[2px] w-full absolute z-50 mt-1"
      >
        <div
          class="px-2 z-50 py-1 hover:bg-gray-300 bg-gray-200"
          v-for="item in Items"
          @click="select(item)"
        >
          {{ item[DisplayFeild] }}
        </div>
      </div>
    </Transition>
  </div>
</template>

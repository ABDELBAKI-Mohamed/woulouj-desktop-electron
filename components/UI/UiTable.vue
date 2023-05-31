<script setup lang="ts">
defineProps<{
  feilds: ReadonlyArray<string>;
  labels: ReadonlyArray<string>;
  isShowImage?: boolean;
  isDeleteRow: boolean;
  isUpdateRow: boolean;
  isDetails: boolean;
  params: string;
  items: any[];
}>();

defineEmits<{
  (event: "row:delete", id: number): void;
  (event: "row:update", row: any): void;
}>();

const pagination = ref<number>(0);
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <table class="w-full">
      <thead
        class="text-xs h-10 bg-gray-300 max-w-lg w-fit font-semibold uppercase text-[rgba(25,23,17,0.6)]"
      >
        <tr>
          <th class="rounded-l-md"></th>
          <th
            v-for="label in labels"
            :class="[
              'p-2 w-fit',
              isDeleteRow || isUpdateRow || isDetails
                ? ''
                : 'last:rounded-r-md',
            ]"
          >
            <div class="font-semibold uppercase text-left">
              {{ label }}
            </div>
          </th>
          <th
            v-if="isDeleteRow || isUpdateRow || isDetails"
            class="rounded-r-md"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-100">
        <tr
          class="h-10"
          v-for="item in items
            .filter((c) =>
              JSON.stringify(Object.values(c))
                .toLowerCase()
                .includes(params.toLowerCase())
            )
            .slice(pagination * 15, pagination * 15 + 15)"
        >
          <td class="p-2">
            <span class="h-full w-full grid">
              <img
                v-if="isShowImage && item['image'] !== ''"
                class="w-12 h-12 rounded-full"
                :src="item['image']"
                sizes="md:48px"
                alt="image"
                format="webp"
              />
            </span>
          </td>
          <td v-for="feild in feilds" class="p-2">
            <div class="font-medium text-gray-800">
              {{
                typeof item[feild] === "object"
                  ? item[feild].length
                  : item[feild]
              }}
            </div>
          </td>
          <td class="p-2">
            <div class="flex w-fit m-auto justify-center gap-4">
              <img
                v-if="isDeleteRow"
                class="cursor-pointer"
                src="../../assets/svgs/trash.svg"
                @click="$emit('row:delete', item.id)"
              />
              <img
                v-if="isUpdateRow"
                class="cursor-pointer"
                src="../../assets/svgs/eye.svg"
                @click="$emit('row:update', item)"
              />
              <NuxtLink
                v-if="isDetails"
                :to="getRightPath(useRoute().path, item.id)"
              >
                <img src="../../assets/svgs/kebab.svg" />
              </NuxtLink>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <UiPagination
        @go:back="pagination--"
        @go:forward="pagination++"
        :items="items.length"
        :page="pagination"
      />
    </div>
  </div>
</template>

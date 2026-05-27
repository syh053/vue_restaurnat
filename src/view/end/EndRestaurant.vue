<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getEndRestaurantApi } from "@/api/end_restaurant"

const data = ref<string>('')

onMounted(async () => {
  const res = await getEndRestaurantApi()

  data.value = res.data
  console.log(data.value)
})
</script>

<template>
  <p class="pt-20">{{ data }}</p>
</template>

<style scoped>

</style>

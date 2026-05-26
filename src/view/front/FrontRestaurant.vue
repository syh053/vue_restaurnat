<script setup lang="ts">
import { onMounted, ref } from "vue"
import { getRestaurantApi } from "@/api/front_restaurant"

const data = ref<string>('')

onMounted(async () => {
  const res = await getRestaurantApi()

  data.value = res.data
  console.log(data.value)
})
</script>

<template>
  <p>{{ data }}</p>
</template>

<style scoped>

</style>

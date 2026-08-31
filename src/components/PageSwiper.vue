<script setup lang="ts">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-cube'
import 'swiper/css/pagination'

// import required modules
import { EffectCube, Pagination } from 'swiper/modules';

const modules = [EffectCube, Pagination]
</script>

<template>
  <swiper
      :effect="'cube'"
      :grabCursor="true"
      :cubeEffect="{
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      }"
      :pagination="true"
      :loop="true"
      :modules="modules"
      class="mySwiper"
  >
    <slot>
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 4</swiper-slide>
      <swiper-slide>Slide 5</swiper-slide>
    </slot>
  </swiper>
</template>

<style scoped lang="scss">
.swiper {
  width: 700px;
  height: 700px;
  margin: auto auto;
}

@media (max-width: 1024px) {
  .swiper {
    width: 300px;
    height: 300px;
  }
}
</style>

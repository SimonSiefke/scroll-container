<template>
  <div
    ref="root"
    data-sc-role="root"
  >
    <div data-sc-role="content">
      <div class="inside">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima tempora cumque atque
          doloribus, unde accusantium voluptatibus enim consequatur.
        </p>
        <br>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima tempora cumque atque
          doloribus, unde accusantium voluptatibus enim consequatur.
        </p>
        <br>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima tempora cumque atque
          doloribus, unde accusantium voluptatibus enim consequatur.
        </p>
        <br>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima tempora cumque atque
          doloribus, unde accusantium voluptatibus enim consequatur.
        </p>
      </div>
    </div>
    <div
      role="presentation"
      aria-hidden="true"
      data-sc-role="scrollbar"
    >
      <div data-sc-role="scrollbar-track">
        <div data-sc-role="scrollbar-thumb" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'scroll-container/src/ScrollContainer.styl'
import 'scroll-container/src/ScrollContainerDemo.styl'
import SimpleBar from 'scroll-container'

// const root = document.querySelector('[data-sc="root"]') as HTMLElement
// createScrollContainer({ root })
export default {
  name: 'ScrollContainer',
  mounted(){
    SimpleBar(this.$refs.root)
  }
}
</script>

<style>
[data-sc-role='root'] {
  height: 300px;
}
</style>

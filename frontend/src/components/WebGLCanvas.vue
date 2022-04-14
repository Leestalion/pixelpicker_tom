<template>
  <div class="flex flex-col items-center justify-center">
    <canvas id="glCanvas" class="mt-20 border-2 border-black"></canvas>
  </div>

</template>


<script>
import { init, main } from "../helpers/pixel.js"

export default {
  mounted() {
    init();
    main();
  },
}
</script>
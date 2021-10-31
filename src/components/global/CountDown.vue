<template>
  <div>
    {{ timerCount }}
  </div>
</template>

<script>
export default {
  name: "CountDown",
  emits: ["answered"],
  data() {
    return {
      timerCount: this.timer,
      audioCountdown: new Audio(require("@/assets/sounds/countdown.mp3")),
    };
  },
  props: {
    timer: {
      type: Number,
    },
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
          if (value == 5) {
            this.audioCountdown.volume = this.$store.state.masterVolume;
            this.audioCountdown.play();
          }
        } else {
          this.$emit("answered");
        }
      },
      immediate: true,
    },
  },
};
</script>

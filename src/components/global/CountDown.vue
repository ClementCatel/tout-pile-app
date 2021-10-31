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
  computed: {
    isMuted() {
      return this.$store.state.muted;
    },
  },
  methods: {
    stopSound() {
      this.audioCountdown.pause();
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
            this.$store.dispatch("playAudio", this.audioCountdown);
          }
        } else {
          this.$emit("answered");
        }
      },
      immediate: true,
    },

    isMuted(value) {
      if (value) {
        this.audioCountdown.muted = true;
      } else {
        this.audioCountdown.muted = false;
      }
    },
  },
};
</script>

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
      timerCount: 15,
    };
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        } else {
          this.$emit("answered");
        }
      },
      immediate: true,
    },
  },
};
</script>

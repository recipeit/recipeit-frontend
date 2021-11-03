<template>
  <div class="base-icon-wrapper" v-html="iconObject" />
</template>

<script>
import icons from "@/src/components/base/icons";

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      default: "regular",
    },
  },
  computed: {
    iconObject() {
      // if (typeof this.icon === 'string') {
      const set = icons[this.weight];
      return set ? set[this.icon] : null;
      // } else {
      //   return this.icon
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.base-icon-wrapper {
  display: inline-flex;

  ::v-deep(svg) {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
}
</style>

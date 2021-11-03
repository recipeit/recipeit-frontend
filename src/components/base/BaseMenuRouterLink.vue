<template>
  <NuxtLink v-slot="{ href, navigate }" :to="to" custom>
    <BaseMenuLink :href="href" @click="navigate($event)"><slot /></BaseMenuLink>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
  },
};
</script>

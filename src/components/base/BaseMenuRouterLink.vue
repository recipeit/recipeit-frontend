<template>
  <router-link v-slot="{ href, navigate }" :to="to" custom>
    <BaseMenuLink :href="href" @click="navigate($event)"><slot /></BaseMenuLink>
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true
    }
  }
}
</script>

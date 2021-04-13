<template>
  <router-link :to="to" v-slot="{ href, navigate }" custom>
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

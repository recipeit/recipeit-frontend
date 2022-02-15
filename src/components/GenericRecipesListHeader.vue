<template>
  <div class="recipes-list__header">
    <slot name="count" :count="count" :fetching="fetching">
      <div class="total-count">
        <!-- <template v-if="count !== null && !recipes.fetching"> -->
        <template v-if="count !== null">
          {{ $tc('shared.recipes', count) }}
        </template>
        <template v-else-if="fetching">
          <SkeletonBox class="total-count-skeleton" />
        </template>
      </div>
    </slot>
    <div v-if="showAllLink" class="show-all">
      <router-link v-slot="{ href, navigate }" :to="showAllLink" custom>
        <BaseLink :href="href" color="primary" class="show-all-button" @click="navigate($event)">
          {{ $t('shared.seeAll') }}
        </BaseLink>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import SkeletonBox from '@/components/skeletons/SkeletonBox.vue'

export default defineComponent({
  components: { SkeletonBox },

  props: {
    count: {
      type: Number
    },
    showAllLink: {
      type: [String, Object]
    },
    fetching: {
      type: Boolean
    }
  }
})
</script>

<style lang="scss">
.recipes-list__header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: bold;

  .total-count {
    color: var(--color-text-secondary);
  }

  .total-count-skeleton {
    height: 12px;
    margin: 0.375em 0;
    border-radius: 8px;
    width: 88px;
  }

  .show-all {
    cursor: pointer;
  }

  .show-all-button {
    display: flex;
    align-items: center;
  }
}
</style>

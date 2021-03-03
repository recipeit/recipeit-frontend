<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>{{ $t('filterModal.title') }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div class="filters">
        <div v-for="(group, groupValue) in options" :key="groupValue" class="filter__group">
          <div class="filter__group__title">
            <div class="filter__group__name">{{ $t(`recipeFilterGroups.${groupValue}`) }}</div>
            <transition name="fade">
              <BaseLink
                tag="button"
                color="primary"
                class="filter__group__clear"
                v-if="selected[groupValue] && selected[groupValue].length > 0"
                @click.stop="clearFilterGroup($event, groupValue)"
              >
                wyczyść
              </BaseLink>
            </transition>
          </div>
          <div class="filter__group__options">
            <div v-for="option in group.options" :key="option.value">
              <BasePillCheckbox v-model="selected[groupValue]" :value="option.key" :excluding="group.type === 'None'">
                {{ $t(`recipeFilterOptions.${groupValue}.${option.value}`) }}
              </BasePillCheckbox>
            </div>
          </div>
        </div>
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" stroked color="white" @click="$emit('close')">
        {{ $t('filterModal.cancelButton') }}
      </BaseButton>
      <BaseButton class="submit-button" raised color="contrast" @click="submit">
        {{ $t('filterModal.submitButton') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    defaultSelected: {
      type: Object
    }
  },
  data: () => ({
    selected: {}
  }),
  computed: {},
  methods: {
    submit() {
      this.$emit('close', this.selected)
    },
    prepareSelected(options, selected) {
      return {
        ...Object.fromEntries(Object.keys(options).map(o => [o, []])),
        ...selected
      }
    },
    clearFilterGroup(event, groupValue) {
      this.selected[groupValue] = []
    }
  },
  created() {
    this.selected = this.prepareSelected(this.options, this.defaultSelected)
  }
}
</script>

<style lang="scss" scoped>
.submit-button {
  width: 100%;

  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}

.filter {
  &__group {
    & + & {
      margin-top: 24px;
    }

    &__title {
      display: flex;
      font-size: 14px;
      position: relative;
      font-weight: 600;
      margin-bottom: 12px;
    }

    &__name {
      color: var(--color-text-secondary);
    }

    &__clear {
      margin-left: auto;
    }

    &__options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }
}
</style>

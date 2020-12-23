<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>{{ $t('filterModal.title') }}</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div class="filters">
        <div v-for="(group, groupValue) in filterGroups" :key="groupValue" class="filter__group">
          <div class="filter__group__title">
            <div class="filter__group__name">{{ group.name }}</div>
            <transition name="fade">
              <div
                class="filter__group__clear"
                v-if="selected[groupValue] && selected[groupValue].length > 0"
                @click.stop="clearFilterGroup($event, groupValue)"
              >
                wyczyść
              </div>
            </transition>
          </div>
          <div class="filter__group__options">
            <div v-for="option in group.options" :key="option.value">
              <BasePillCheckbox v-model="selected[groupValue]" :value="option.value">
                {{ option.name }}
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
      <BaseButton class="submit-button" raised color="black" @click="submit">
        {{ $t('filterModal.submitButton') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
export default {
  props: {
    defaultSelected: {
      type: Object
    }
  },
  data() {
    return {
      selected: {},
      filterGroups: {}
    }
  },
  computed: {},
  methods: {
    submit() {
      console.log(JSON.parse(JSON.stringify(this.selected)))
      this.$emit('close', this.selected)
    },
    prepareOptions(options, selected) {
      this.filterGroups = options
      this.selected = {
        ...Object.fromEntries(Object.keys(options).map(o => [o, []])),
        ...selected
      }
    },
    clearFilterGroup(event, groupValue) {
      this.selected[groupValue] = []
    }
  },
  created() {
    var options = {
      type: {
        name: 'Typ',
        type: 'checkbox',
        options: [
          {
            value: 'breakfast',
            name: 'Śniadanie'
          },
          {
            value: 'dinner',
            name: 'Obiad'
          },
          {
            value: 'supper',
            name: 'Kolacja'
          },
          {
            value: 'dessert',
            name: 'Deser'
          },
          {
            value: 'cake',
            name: 'Ciasto'
          },
          {
            value: 'snack',
            name: 'Przekąska'
          }
        ]
      },
      diet: {
        name: 'Dieta',
        type: 'checkbox',
        options: [
          {
            value: 'vegan',
            name: 'Wegańska'
          },
          {
            value: 'vegetarian',
            name: 'Wegetariańska'
          }
        ]
      },
      allergens: {
        name: 'Pomiń dania zawierające',
        type: 'checkbox',
        options: [
          {
            value: 'dairy',
            name: 'Nabiał'
          },
          {
            value: 'gluten',
            name: 'Gluten'
          },
          {
            value: 'eggs',
            name: 'Jaja'
          },
          {
            value: 'fishes',
            name: 'Ryby'
          },
          {
            value: 'nuts',
            name: 'Orzechy'
          }
        ]
      }
    }

    this.prepareOptions(options, this.defaultSelected)
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
    }

    &__name {
      color: $text-secondary;
    }

    &__clear {
      margin-left: 0.5rem;
      cursor: pointer;
      color: $blue;
      transition: all 0.2s ease;

      &:hover {
        color: lighten($blue, 10%);
      }

      &:active {
        color: lighten($blue, 20%);
      }
    }

    &__options {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }
}
</style>

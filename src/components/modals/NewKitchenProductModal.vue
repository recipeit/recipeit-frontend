<template>
  <sheet-modal-content>
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Dodaj nowy produkt</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <div>
        <div class="basa-input base-input">
          <input id="x" v-model="newProduct.name" type="text" />
          <label for="x">Nazwa</label>
        </div>

        <BaseSelect
          placeholder="Gotowy produkt"
          class="basa-input"
          v-model="selectedBaseProduct"
          trackBy="id"
          label="name"
          :options="baseProducts"
          :searchable="true"
        >
          <!-- <template v-slot:label="props">
            {{ $t(`units.${props.option.toLowerCase()}`) }}
          </template>
          <template v-slot:option="props">
            {{ $t(`units.${props.option.toLowerCase()}`) }}
          </template> -->
        </BaseSelect>

        <div class="he">
          <div class="basa-input base-input" style="width: 128px">
            <input v-model.number="newProduct.amount" type="text" />
            <label for="x">Ilość</label>
          </div>
          <BaseSelect
            style="flex: 1"
            placeholder="Jednostka"
            class="basa-input"
            v-model="newProduct.unit"
            :options="units"
            :searchable="true"
          >
            <template v-slot:label="props">
              {{ $t(`units.${props.option.toLowerCase()}`) }}
            </template>
            <template v-slot:option="props">
              {{ $t(`units.${props.option.toLowerCase()}`) }}
            </template>
          </BaseSelect>
        </div>
      </div>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="submit-button" raised color="black" @click="addProduct">
        <BaseIcon class="submit-button__icon" icon="plus" weight="semiBold" />
        {{ loading ? '...dodawanie' : $t('shared.addProduct') }}
      </BaseButton>
    </BaseModalFooter>
  </sheet-modal-content>
</template>

<script>
import { units } from '@/constants'
import { mapState } from 'vuex'

export default {
  data: () => ({
    units: units,
    loading: false,
    newProduct: this.emptyProduct(),
    selectedBaseProduct: null
  }),
  computed: {
    ...mapState({
      baseProducts: state => state.ingredients.baseProducts
    })
  },
  methods: {
    emptyProduct() {
      return {
        name: '',
        amount: null,
        baseProductId: null,
        unit: null
      }
    },
    addProduct() {
      this.$store.dispatch('myKitchen/addProducts', [this.newProduct]).then(() => {
        this.newProduct = this.emptyProduct()
        this.selectedBaseProduct = null
        this.$emit('close')
      })
    }
  },
  watch: {
    selectedBaseProduct(newValue) {
      if (newValue && newValue.id) {
        this.newProduct.baseProductId = newValue.id
      }
    }
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

.basa-input {
  & + & {
    margin-top: 16px;
  }
}

.he {
  display: flex;
  margin-top: 16px;
  // align-items: center;

  .basa-input + .basa-input {
    margin-top: 0;
    margin-left: 16px;
  }
}

.base-input {
  position: relative;

  label {
    position: absolute;
    display: flex;
    top: 0;
    // height: 100%;
    align-items: center;
    user-select: none;
    font-size: 12px;
    font-weight: bold;
  }

  input {
    display: flex;
    width: 100%;
    border: none;
    border-bottom: 2px solid $border;
    height: 48px;
    padding-top: 11px;
    font-family: inherit;
    font-weight: inherit;
    font-size: 16px;
  }
}
</style>

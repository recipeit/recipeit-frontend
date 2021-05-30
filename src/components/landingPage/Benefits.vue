<template>
  <div class="benefits">
    <Container class="benefits-container">
      <div class="benefit-list">
        <Benefit
          v-for="(benefit, index) in benefits"
          :key="index"
          :icon="benefit.icon"
          :title="benefit.title"
          :description="benefit.description"
        />
      </div>
    </Container>
  </div>
</template>

<script>
import Container from './Container'
import Benefit from './Benefit'

export default {
  components: { Container, Benefit },
  setup() {
    const benefits = [
      {
        icon: 'tableware',
        title: 'Zainspiruj się',
        description: 'Z Recipeit poznasz nowe kuchnie i przepisy.'
      },
      {
        icon: 'money',
        title: 'Oszczędź pieniądze',
        description: 'Recipeit pomoże Ci uniknąć marnowania jedzenia.'
      },
      {
        icon: 'clock',
        title: 'Zaoszczędź swój czas',
        description: 'Wystarczy kilka chwil, by znaleźć przepis z Twoich składników.'
      }
    ]

    return {
      benefits
    }
  }
}
</script>

<style lang="scss" scoped>
.benefits {
  margin-top: 4rem;
  padding: 0 1.5rem;

  .benefits-container {
    background-color: mix(#e2e9ed, #fff, 35%);
    border-radius: 1.5rem;
  }

  .benefit-list {
    display: flex;
  }

  @media (max-width: 720px) {
    padding: 0;

    .benefits-container {
      border-radius: 0;
    }

    .benefit-list {
      flex-direction: column;
    }
  }
}
</style>

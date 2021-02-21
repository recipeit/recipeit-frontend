<template>
  <div class="layout__page__content">
    <h1>
      <span style="font-weight: 500">{{ $t(welcomeType) }},</span> Kamil!
    </h1>
    <div>{{ userProfile || 'nie ma' }}</div>
    <!-- <base-link color="primary">Kliknij we mnie</base-link> -->
    <base-select
      placeholder="Wybierz stan"
      class="base-select"
      :searchable="true"
      v-model="selectModel"
      :options="selectOptions"
    ></base-select>
    <base-select placeholder="Wybierz stan" class="base-select" v-model="selectModel2" :options="selectOptions"></base-select>
    <base-select
      placeholder="Wybierz stan"
      class="base-select"
      v-model="selectModel3"
      :options="selectOptions3"
      :searchable="true"
      trackBy="id"
      label="name"
    ></base-select>
    {{ selectModel3 }}
    <br />
    <br />
    <input type="text" v-model="userLogin.email" />
    <input type="password" v-model="userLogin.password" />
    <button @click="login">Login</button>
  </div>
</template>

<script>
import identityService from '@/services/identity'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      userProfile: state => state.user.userProfile
    })
  },
  data() {
    const hour = new Date().getHours()
    const welcomeType = hour < 5 || hour > 16 ? 'welcome.evening' : hour < 12 ? 'welcome.morning' : 'welcome.afternoon'

    return {
      userLogin: {
        email: '',
        password: ''
      },
      welcomeType,
      selectModel: null,
      selectModel2: null,
      selectModel3: null,
      selectOptions: ['Alaska', 'Alabama', 'Kalifornia'],
      selectOptions3: [
        { id: 1, name: 'Alaska' },
        { id: 2, name: 'Alabama' },
        { id: 3, name: 'Kalifornia' }
      ]
    }
  },
  methods: {
    login() {
      identityService.login(this.userLogin, this.$store.dispatch)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  margin: 16px 0;
}
</style>

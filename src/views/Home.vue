<template>
  <div class="layout__page__content">
    <h1>
      <span style="font-weight: 500">{{ $t(welcomeType) }}</span
      ><span v-if="userProfile && userProfile.username">, {{ userProfile.username }}</span>
    </h1>
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
    <template v-if="!isAuthenticated">
      <input type="text" v-model="userLogin.email" />
      <input type="password" v-model="userLogin.password" />
      <button @click="login">Zaloguj</button>
    </template>
    <template v-else>
      <button @click="logout">Wyloguj</button>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      userProfile: state => state.user.userProfile
    }),
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
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
      this.$store.dispatch('user/login', this.userLogin)
    },
    logout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  margin: 16px 0;
}
</style>

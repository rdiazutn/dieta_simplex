<template>
  <v-app dark class="w-75vw">
    <v-row justify="center">
      <v-col cols="10">
        <CompanyLogo src="/dieta_simplex/chrome.png" size="big" />
        <h1>Oops...</h1>
        <p>{{ $t('errors.oops') }}</p>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import CompanyLogo from '~/components/General/CompanyLogo'
export default {
  components: {
    CompanyLogo
  },
  methods: {
    goToLogin () {
      this.$router.push('/')
    }
  }
}
</script>

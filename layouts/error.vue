<template>
  <v-app dark class="w-75vw">
    <v-row justify="center">
      <v-col cols="10">
        <CompanyLogo src="/chrome.png" size="big" />
        <h1>Oops...</h1>
        <p>{{ $t('errors.oops') }}</p>
        <ThePrimaryButton
          :inner-text="$t('errors.go_to_start')"
          @click="goToLogin"
        />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import ThePrimaryButton from '~/components/General/Buttons/ThePrimaryButton'
import CompanyLogo from '~/components/General/CompanyLogo'
export default {
  components: {
    ThePrimaryButton,
    CompanyLogo
  },
  methods: {
    goToLogin () {
      this.$router.push('/')
    }
  }
}
</script>

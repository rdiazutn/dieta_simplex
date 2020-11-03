<template>
  <v-card outlined>
    <v-card-title v-text="'Formulario físico'" />
    <v-card-text>
      <v-row>
        <v-col md="6" lg="4">
          <TheTextInput v-model="phisicalInfo.name" label="Nombre" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import TheTextInput from '~/components/General/Inputs/TheTextInput'
export default {
  components: {
    TheTextInput
  },
  data () {
    return {
      phisicalInfo: {

      }
    }
  }
}
</script>

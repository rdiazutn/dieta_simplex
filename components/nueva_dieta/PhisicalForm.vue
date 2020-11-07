<template>
  <v-card outlined>
    <v-card-title v-text="'Formulario físico'" />
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <TheTextInput v-model="phisicalInfo.name" label="Nombre" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <TheTextInput v-model="phisicalInfo.age" label="Edad" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <TheAutocompleteInput v-model="phisicalInfo.sex" :items="['Masculino', 'Femenino']" label="Sexo" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <TheTextInput v-model="phisicalInfo.weight" label="Peso" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <TheTextInput v-model="phisicalInfo.height" label="Altura" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <TheTextInput v-model="phisicalInfo.height" label="Circunferencia cintura" />
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <TheSwitchInput v-model="phisicalInfo.doesExercise" label="Hace ejercicio" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import TheTextInput from '~/components/General/Inputs/TheTextInput'
import TheAutocompleteInput from '~/components/General/Inputs/TheAutocompleteInput'
import TheSwitchInput from '~/components/General/Inputs/TheSwitchInput'

export default {
  components: {
    TheTextInput,
    TheAutocompleteInput,
    TheSwitchInput
  },
  data () {
    return {
      phisicalInfo: {}
    }
  }
}
</script>

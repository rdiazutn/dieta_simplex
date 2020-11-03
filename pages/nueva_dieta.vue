<template>
  <TheLayoutWithHeader title="nueva_dieta.titulo">
    <template #body>
      <v-row class="headline my-4" justify="center" align="center">
        Por favor complete el formulario para generar su dieta
      </v-row>
      <PhisicalForm class="my-4" />
      <PreferencesForm class="my-4" />
      <!-- <DietResults /> -->
    </template>
  </TheLayoutWithHeader>
</template>
<script>
import TheLayoutWithHeader from '~/components/General/Layouts/TheLayoutWithHeader'
import PhisicalForm from '~/components/nueva_dieta/PhisicalForm'
import PreferencesForm from '~/components/nueva_dieta/PreferencesForm'

export default {
  components: {
    TheLayoutWithHeader,
    PhisicalForm,
    PreferencesForm
  }
}
</script>

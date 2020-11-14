<template>
  <v-menu
    bottom
    left
    class="mr-10"
  >
    <template v-slot:activator="{ on, attrs }">
      <TheButtonWithTooltip
        :title="$t('lenguajes')"
        icon="mdi-translate"
        color="accent"
        dark
        v-bind="attrs"
        v-on="on"
      />
      <v-icon>mdi-dots-vertical</v-icon>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in languages"
        :key="index"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import TheButtonWithTooltip from '~/components/General/Buttons/TheButtonWithTooltip'
export default {
  components: {
    TheButtonWithTooltip
  },
  computed: {
    languages () {
      return [
        {
          name: 'Español',
          key: ''
        }
      ]
    }
  }
}
</script>

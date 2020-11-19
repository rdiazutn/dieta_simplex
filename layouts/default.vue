<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <LanguageMenu />
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          align-with-title
        >
          <v-tab
            v-for="(item,idx) in menus"
            :key="idx"
            nuxt
            :to="item.to"
          >
            <v-icon>
              {{ item.icon }}
            </v-icon>
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main class="nuxt-component">
      <v-layout
        column
        align-center
      >
        <v-flex
          xs12
          sm10
          md8
        >
          <v-container class="pageContainer">
            <nuxt class="nuxt-component-inner" />
          </v-container>
        </v-flex>
      </v-layout>
    </v-main>
    <v-footer
      absolute
      app
    >
      <v-row justify="center" align="center">
        &copy; {{ new Date().getFullYear() }}
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import LanguageMenu from '~/components/General/Menus/LanguageMenu'
export default {
  components: {
    LanguageMenu
  },
  data () {
    return {
      title: 'Simplex dieta',
      tab: 0
    }
  },
  computed: {
    menus () {
      return [
        {
          icon: 'mdi-home',
          title: this.$t('inicio'),
          to: '/'
        },
        {
          icon: 'mdi-plus',
          title: this.$t('nueva_dieta.titulo'),
          to: '/nueva_dieta'
        }
      ]
    }
  }
}
</script>

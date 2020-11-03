<template>
  <v-card outlined>
    <v-card-title v-text="'Formulario de preferencias'" />
    <v-card-text>
      <template v-if="!finComparacion">
        <template v-for="(comparacion,idx) in listadoComparaciones">
          <v-row v-show="idx === pagina - 1" :key="idx" justify="center" align="center">
            <v-col cols="4">
              <v-row justify="end" align="end" no-gutters>
                <ThePrimaryButton
                  :inner-text="comparacion.categoria.productos[comparacion.elemento1].nombre"
                  @click="puntuarElemento1(comparacion)"
                />
              </v-row>
            </v-col>
            <v-col cols="4">
              <TheAccentButton
                :inner-text="comparacion.categoria.productos[comparacion.elemento2].nombre"
                @click="puntuarElemento2(comparacion)"
              />
            </v-col>
          </v-row>
        </template>
        <v-row justify="center" align="center">
          {{ pagina }} / {{ listadoComparaciones.length }}
        </v-row>
      </template>
      <template v-if="finComparacion">
        <v-row justify="center" align="center">
          <v-chip
            color="primary"
            dark
          >
            Usted ha finalizado la comparación de productos, por favor continúe para observar los resultados
          </v-chip>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>
<script>
import { random } from 'lodash'
import ThePrimaryButton from '~/components/General/Buttons/ThePrimaryButton'
import TheAccentButton from '~/components/General/Buttons/TheAccentButton'
export default {
  components: {
    ThePrimaryButton,
    TheAccentButton
  },
  data () {
    return {
      pagina: 1,
      listadoComparaciones: []
    }
  },
  computed: {
    comidasPorCategoria () {
      return this.$store.state.comidasPorCategoria
    },
    finComparacion () {
      return this.pagina - 1 === this.listadoComparaciones.length
    }
  },
  mounted () {
    this.generarListadoComparaciones()
  },
  methods: {
    generarListadoComparaciones () {
      this.comidasPorCategoria.forEach((categoria) => {
        let i
        for (i = 0; i < categoria.productos.length && categoria.productos.length > 1; i++) {
          const parejaRandom = this.generarParejaRandom(categoria)
          if (parejaRandom) {
            this.listadoComparaciones.push(parejaRandom)
          }
        }
      })
    },
    generarParejaRandom (categoria) {
      const productos = categoria.productos
      let elemento1 = null
      let elemento2 = null
      let cont = 0
      do {
        cont++
        elemento1 = random(0, productos.length - 1)
        elemento2 = random(0, productos.length - 1)
        while (elemento1 === elemento2) {
          elemento2 = random(0, productos.length - 1)
        }
        if (cont === 50) {
          return null
        }
      } while (this.existeComparacion(categoria, elemento1, elemento2))
      return this.existeComparacion(categoria, elemento1, elemento2) ? null : {
        elemento1,
        elemento2,
        categoria
      }
    },
    existeComparacion (categoria, elemento1, elemento2) {
      return this.listadoComparaciones
        .find(comparacion => comparacion.categoria === categoria &&
          ((comparacion.elemento1 === elemento1 &&
          comparacion.elemento2 === elemento2) ||
          (comparacion.elemento2 === elemento1 &&
          comparacion.elemento1 === elemento2)))
    },
    puntuarElemento1 (comparacion) {
      this.pagina++
      this.intercambiarPuntos(comparacion.elemento1, comparacion.elemento2, comparacion.categoria)
    },
    puntuarElemento2 (comparacion) {
      this.pagina++
      this.intercambiarPuntos(comparacion.elemento2, comparacion.elemento1, comparacion.categoria)
    },
    intercambiarPuntos (productoGanador, productoPerdedor, categoria) {
      this.$store.commit('intercambiarPuntos', { productoGanador, productoPerdedor, categoria })
    }
  }
}
</script>

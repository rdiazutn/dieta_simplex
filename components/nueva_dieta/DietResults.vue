<template>
  <v-card outlined>
    <v-card-title v-text="'Resultados'" />
    <v-card-text>
      <v-row>
        <v-col md="6" lg="4">
          <ThePrimaryButton
            inner-text="Procesar resultados"
            icon="mdi-cog"
            @click="procesarResultados"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import { SimplexDiaz } from '~/service/simplex'
import ThePrimaryButton from '~/components/General/Buttons/ThePrimaryButton'
export default {
  components: {
    ThePrimaryButton
  },
  data () {
    return {
    }
  },
  computed: {
    comidasPorCategoria () {
      return this.$store.state.comidasPorCategoria
    }
  },
  mounted () {
    const toProcess = this.procesarResultados()
    console.log(toProcess)
    console.log(SimplexDiaz.ejecutarSimplex(toProcess))
  },
  methods: {
    procesarResultados () {
      const coeficientes = this.getCoeficientesFuncion()
      const restricciones = []
      this.comidasPorCategoria.forEach((categoria) => {
        const restriccionDieta = this.getRestriccionDieta(categoria)
        const restriccionMejor = this.getRestriccionMejor(categoria)
        const restriccionPeor = this.getRestriccionPeor(categoria)
        restricciones.push(restriccionDieta, restriccionMejor, restriccionPeor)
      })
      return {
        funcionMaximizacion: {
          coeficientes
        },
        restricciones
      }
    },
    getCoeficientesFuncion () {
      const objectiveObject = {}
      this.comidasPorCategoria.forEach((categoria) => {
        categoria.productos.forEach((producto) => {
          objectiveObject[this.getAttributeName(categoria, producto)] = -producto.precio
        })
      })
      return objectiveObject
    },
    getCoeficientesCategoria (categoria) {
      const coeficientes = {}
      categoria.productos.forEach((producto) => {
        coeficientes[this.getAttributeName(categoria, producto)] = 1
      })
      return coeficientes
    },
    getRestriccionDieta (categoria) {
      const coeficientes = this.getCoeficientesCategoria(categoria)
      return {
        coeficientes,
        tipo: '>=',
        terminoIndependiente: categoria.totalDeDieta
      }
    },
    getRestriccionMejor (categoria) {
      const coeficientes = {}
      let mejor = {
        puntaje: -Infinity
      }
      categoria.productos.forEach((producto) => {
        if (producto.puntaje > mejor.puntaje) {
          mejor = producto
        }
      })
      coeficientes[this.getAttributeName(categoria, mejor)] = 1
      return {
        coeficientes,
        tipo: '>=',
        terminoIndependiente: categoria.totalDeDieta / 2
      }
    },
    getRestriccionPeor (categoria) {
      const coeficientes = {}
      let peor = {
        puntaje: Infinity
      }
      categoria.productos.forEach((producto) => {
        if (producto.puntaje < peor.puntaje) {
          peor = producto
        }
      })
      coeficientes[this.getAttributeName(categoria, peor)] = 1
      return {
        coeficientes,
        tipo: '<=',
        terminoIndependiente: categoria.totalDeDieta / 10
      }
    },
    getAttributeName (categoria, producto) {
      return `${categoria.nombre}_${producto.nombre}`
    }
  }
}
</script>

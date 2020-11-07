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
import SimpleSimplex from 'simple-simplex'
import { cloneDeep } from 'lodash'
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
    const simplexResult = SimplexDiaz.testMayorOIgualSimplex()
    console.log(simplexResult)
  },
  methods: {
    procesarResultados () {
      const objective = this.getObjective()
      const constraints = []
      const ceroObjective = this.getObjective(0)
      this.comidasPorCategoria.forEach((categoria) => {
        const restriccionDieta = this.getRestriccionDieta(ceroObjective, categoria)
        const restriccionMejor = this.getRestriccionMejor(ceroObjective, categoria)
        const restriccionPeor = this.getRestriccionPeor(ceroObjective, categoria)
        constraints.push(restriccionDieta, restriccionMejor, restriccionPeor)
      })
      const optimizationType = 'max'
      console.log(objective)
      console.log(constraints)
      const solver = new SimpleSimplex({ objective, constraints, optimizationType })
      const result = solver.solve({
        methodName: 'simplex'
      })
      console.log({
        solution: result.solution,
        isOptimal: result.details.isOptimal
      })
    },
    getObjective (initValue) {
      const objectiveObject = {}
      this.comidasPorCategoria.forEach((categoria) => {
        categoria.productos.forEach((producto) => {
          objectiveObject[this.getAttributeName(categoria, producto)] = initValue === 0 ? initValue : -producto.precio
        })
      })
      return objectiveObject
    },
    getNamedVector (categoria) {
      const namedVector = {}
      categoria.productos.forEach((producto) => {
        namedVector[this.getAttributeName(categoria, producto)] = 1
      })
      return namedVector
    },
    getRestriccionDieta (objective, categoria) {
      const namedVector = {
        ...cloneDeep(objective),
        ...this.getNamedVector(categoria)
      }
      return {
        namedVector,
        constraint: '>=',
        constant: categoria.totalDeDieta
      }
    },
    getRestriccionMejor (objective, categoria) {
      const namedVector = cloneDeep(objective)
      let mejor = {
        puntaje: 1
      }
      categoria.productos.forEach((producto) => {
        if (producto.puntaje > mejor.puntaje) {
          mejor = producto
        }
      })
      namedVector[this.getAttributeName(categoria, mejor)] = 1
      return {
        namedVector,
        constraint: '>=',
        constant: categoria.totalDeDieta / 2
      }
    },
    getRestriccionPeor (objective, categoria) {
      const namedVector = cloneDeep(objective)
      let peor = {
        puntaje: 1000000
      }
      categoria.productos.forEach((producto) => {
        if (producto.puntaje < peor.puntaje) {
          peor = producto
        }
      })
      namedVector[this.getAttributeName(categoria, peor)] = 1
      return {
        namedVector,
        constraint: '<=',
        constant: categoria.totalDeDieta / 10
      }
    },
    getAttributeName (categoria, producto) {
      return `${categoria.nombre}_${producto.nombre}`
    }
  }
}
</script>

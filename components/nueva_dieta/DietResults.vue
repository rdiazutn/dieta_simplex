<template>
  <v-card outlined>
    <v-card-title v-text="'Resultados'" />
    <v-card-text>
      <v-row v-if="!resultado">
        <v-col md="6" lg="4">
          <ThePrimaryButton
            inner-text="Procesar resultados"
            icon="mdi-cog"
            @click="procesarYEjecutarSimplex"
          />
        </v-col>
      </v-row>
      <v-row v-else justify="center" align="center">
        <v-col cols="12" md="10" lg="8">
          <v-card
            outlined
            class="w-100"
          >
            <v-data-table
              :headers="headersResultado"
              :items-per-page="30"
              hide-default-footer
              :items="resultado.matriz"
            >
              <template #[`body.append`]="{}">
                <tr>
                  <td colspan="3" class="pl-10">
                    <strong>
                      {{ $t('resultado.total') }}
                    </strong>
                  </td>
                  <td colspan="1" class="text-right pr-6">
                    $ {{ Math.round(-resultado.z * 100) / 100 }}
                  </td>
                </tr>
              </template>
              <template #[`item.coeficiente`]="{ item }">
                $ {{ -item.coeficiente }}
              </template>
              <template #[`item.total`]="{ item }">
                $ {{ Math.round(item.coeficiente * -item.terminoIndependienteFila * 100) / 100 }}
              </template>
            </v-data-table>
          </v-card>
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
    headersResultado () {
      return [
        {
          text: this.$t('resultado.producto'),
          sortable: true,
          value: 'nombre',
          width: '40%'
        },
        {
          text: this.$t('resultado.precio_por_unidad'),
          align: 'right',
          sortable: true,
          width: '20%',
          value: 'coeficiente'
        },
        {
          text: this.$t('resultado.cantidad'),
          align: 'right',
          sortable: true,
          width: '20%',
          value: 'terminoIndependienteFila'
        },
        {
          text: this.$t('resultado.total'),
          align: 'right',
          sortable: true,
          width: '20%',
          value: 'total'
        }
      ]
    },
    resultado () {
      return this.$store.state.ultimoResultado
    },
    comidasPorCategoria () {
      const categoriasVisibles = []
      this.$store.state.comidasPorCategoria.forEach((categoria) => {
        categoriasVisibles.push({
          ...categoria,
          productos: categoria.productos.filter(producto => producto.precio < 2)
        })
      })
      return categoriasVisibles
    }
  },
  methods: {
    procesarYEjecutarSimplex () {
      const toProcess = this.procesarResultados()
      const result = SimplexDiaz.ejecutarSimplex(toProcess)
      if (result.z) {
        this.$store.commit('agregarResultado', result)
      }
    },
    procesarResultados () {
      const coeficientes = this.getCoeficientesFuncion()
      const restricciones = []
      this.comidasPorCategoria.forEach((categoria) => {
        const restriccionDieta = this.getRestriccionDieta(categoria)
        const restriccionMejor = this.getRestriccionMejor(categoria)
        const restriccionPeor = this.getRestriccionPeor(categoria)
        restricciones.push(restriccionDieta, restriccionMejor)
        if (this.sonDistintasRestricciones(restriccionPeor, restriccionMejor)) {
          restricciones.push(restriccionPeor)
        }
      })
      return {
        funcionMaximizacion: {
          coeficientes
        },
        restricciones
      }
    },
    sonDistintasRestricciones (restriccion, otraRestrccion) {
      return Object.keys(restriccion.coeficientes)[0] !== Object.keys(otraRestrccion.coeficientes)[0]
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

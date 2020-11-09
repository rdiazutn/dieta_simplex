import { cloneDeep } from 'lodash'
export const SimplexDiaz = {
  getValorSuficientementeAlto () {
    return 1000
  },

  ejecutarSimplex (valoresSinEstandarizar) {
    const valuesEstandarizados = this.estandarizar(valoresSinEstandarizar)
    const resultado = this.executeSimplex(valuesEstandarizados)
    return resultado
  },

  testEstandarizacion () {
    const values = this.getValoresAEstandarizar()
    const valuesEstandarizados = this.estandarizar(values)
    const resultado = this.executeSimplex(valuesEstandarizados)
    return resultado
  },

  testEstandarizacion2 () {
    const values = this.getValoresAEstandarizar2()
    const valuesEstandarizados = this.estandarizar(values)
    const resultado = this.executeSimplex(valuesEstandarizados)
    return resultado
  },

  testSimplex () {
    const dummyValues = this.getDummyValues()
    return this.executeSimplex(dummyValues)
  },

  testSimplex2 () {
    const dummyValues = this.getDummyValuesMin()
    return this.executeSimplex(dummyValues)
  },

  testMayorOIgualSimplex () {
    const dummyValues = this.getDummyValuesToGT()
    return this.executeSimplex(dummyValues)
  },

  estandarizar (values) {
    const variablesDeDecision = this.getVariablesDeDecision(values)
    const restricciones = this.getRestriccionesEstandarizadas(variablesDeDecision, values.restricciones)
    return [
      ...variablesDeDecision,
      ...restricciones
    ]
  },

  getVariablesDeDecision (values) {
    return Object.keys(values.funcionMaximizacion.coeficientes)
      .map(variable => ({
        nombre: variable,
        coeficiente: values.funcionMaximizacion.coeficientes[variable],
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      }))
  },

  getRestriccionesEstandarizadas (variablesDeDecision, restricciones) {
    const cantVariables = variablesDeDecision.length
    const cantColumnas = cantVariables + restricciones.length
    const nombreRestriccion = 'r_'
    return restricciones.map((restriccion, index) => {
      const valoresFila = new Array(cantColumnas).fill(0)
      variablesDeDecision.forEach((variable, indiceVar) => {
        valoresFila[indiceVar] = restriccion.coeficientes[variable.nombre] || 0
      })
      valoresFila[cantVariables + index] = 1
      // TODO: Coeficiente -M
      return {
        nombre: `${nombreRestriccion}${index}`,
        coeficiente: restriccion.tipo === '<=' ? 0 : -this.getValorSuficientementeAlto(),
        valoresFila,
        estaEnBase: true,
        terminoIndependienteFila: restriccion.terminoIndependiente
      }
    })
  },

  executeSimplex (matrizValores) {
    let currentMatriz = matrizValores
    let x = 0
    // Límite de iteraciones
    while (x < 20) {
      x++
      const pivot = this.getPivot(currentMatriz)
      if (!pivot) {
        return {
          matriz: currentMatriz,
          z: currentMatriz
            .filter(elemento => elemento.estaEnBase)
            .reduce((prev, curr) => prev + curr.coeficiente * curr.terminoIndependienteFila, 0)
        }
      }
      currentMatriz = this.generateNewMatrix(pivot, currentMatriz)
    }
    return 'ERROR'
  },

  getPivot (matriz) {
    const elementosBase = matriz.filter(elemento => elemento.estaEnBase)
    // Determino columna
    const columnaPivot = this.getColumnaPivot(matriz, elementosBase)
    if (columnaPivot.esResultadoFinal) {
      return
    }
    // Determino fila
    const filaPivot = this.getFilaPivot(matriz, elementosBase, columnaPivot)
    return {
      elementoEntrante: columnaPivot,
      elementoSaliente: filaPivot
    }
  },

  getColumnaPivot (matriz, elementosBase) {
    // Se calcula menor zj - cj
    let menorZjMenosCjVaABase = {
      zjMenosCj: Infinity,
      elementoNoBaseMenor: {},
      esResultadoFinal: true,
      columna: 0
    }
    matriz.forEach((elemento, indice) => {
      if (!elemento.estaEnBase) {
        const zj = elementosBase
          .reduce((prev, currentElementoBase) =>
            prev + currentElementoBase.valoresFila[indice] *
              currentElementoBase.coeficiente, 0)
        const zjMenosCj = zj - elemento.coeficiente
        if (zjMenosCj < menorZjMenosCjVaABase.zjMenosCj && zjMenosCj <= 0) {
          menorZjMenosCjVaABase = {
            zjMenosCj,
            elemento,
            columna: indice
          }
        }
      }
    })
    return menorZjMenosCjVaABase
  },

  getFilaPivot (matriz, elementosBase, columnaPivot) {
    // Se calcula menor tita j
    let menorTitaASacarDeBase = {
      tita: Infinity,
      elementoDeBaseMenor: {}
    }
    elementosBase.forEach((elementoBase) => {
      let valorColumna = elementoBase.valoresFila[columnaPivot.columna]
      valorColumna = Math.max(valorColumna, 1 / this.getValorSuficientementeAlto())
      const tita = elementoBase.terminoIndependienteFila / valorColumna
      if (tita < menorTitaASacarDeBase.tita) {
        menorTitaASacarDeBase = {
          tita,
          elemento: elementoBase
        }
      }
    })
    return menorTitaASacarDeBase
  },

  generateNewMatrix (p, m) {
    const pivot = cloneDeep(p)
    const matriz = cloneDeep(m)
    // Valores auxiliares
    const elementoEntrante = pivot.elementoEntrante.elemento
    const columnaDeEntrante = pivot.elementoEntrante.columna
    const elementoSaliente = pivot.elementoSaliente.elemento
    // Se recalcula matriz
    const valorPivot = elementoSaliente.valoresFila[columnaDeEntrante]

    const nuevaTabla = matriz.map((elementoARecalcular) => {
      if (elementoARecalcular.estaEnBase) {
        const valorColumnaDePivot = elementoARecalcular.valoresFila[columnaDeEntrante]
        let valoresFila
        let terminoIndependienteFila

        if (elementoARecalcular.nombre === elementoSaliente.nombre) {
          valoresFila = elementoARecalcular.valoresFila.map(valor => valor / valorPivot)
          terminoIndependienteFila = elementoARecalcular.terminoIndependienteFila / valorPivot
        } else {
          valoresFila = this.calcularValoresConPivot(elementoARecalcular, elementoSaliente,
            columnaDeEntrante, valorColumnaDePivot, valorPivot)
          terminoIndependienteFila = elementoARecalcular.terminoIndependienteFila -
              valorColumnaDePivot * elementoSaliente.terminoIndependienteFila /
              valorPivot
        }

        return {
          ...cloneDeep(elementoARecalcular),
          valoresFila,
          terminoIndependienteFila
        }
      } else {
        return elementoARecalcular
      }
    })
    // Se pivotea
    const pivotEntrante = nuevaTabla.find(elemento => elemento.nombre === elementoEntrante.nombre)
    const pivotSaliente = nuevaTabla.find(elemento => elemento.nombre === elementoSaliente.nombre)
    pivotEntrante.estaEnBase = true
    pivotSaliente.estaEnBase = false
    pivotEntrante.valoresFila = pivotSaliente.valoresFila
    pivotEntrante.terminoIndependienteFila = pivotSaliente.terminoIndependienteFila
    pivotSaliente.terminoIndependienteFila = null
    pivotSaliente.valoresFila = null
    return nuevaTabla
  },

  calcularValoresConPivot (elementoARecalcular, elementoSaliente, columnaDeEntrante,
    valorColumnaDePivot, valorPivot) {
    const valoresFila = elementoARecalcular.valoresFila.map((valor, indice) => {
      if (indice === columnaDeEntrante) {
        return 0
      }
      const valorRecalculado = valor -
        (elementoSaliente.valoresFila[indice] * valorColumnaDePivot) /
        valorPivot
      return valorRecalculado
    })
    return valoresFila
  },

  getValoresAEstandarizar2 () {
    return {
      funcionMaximizacion: {
        coeficientes: {
          x1: 2,
          x2: 3,
          x3: 4
        },
        tipo: 'max'
      },
      restricciones: [
        {
          coeficientes: {
            x1: 1
          },
          tipo: '>=',
          terminoIndependiente: 10
        },
        {
          coeficientes: {
            x2: 1,
            x3: 3
          },
          tipo: '<=',
          terminoIndependiente: 20
        },
        {
          coeficientes: {
            x1: 1,
            x2: 1
          },
          tipo: '<=',
          terminoIndependiente: 20
        }
      ]
    }
  },

  getValoresAEstandarizar () {
    return {
      funcionMaximizacion: {
        coeficientes: {
          x1: 2,
          x2: 3
        },
        tipo: 'max'
      },
      restricciones: [
        {
          coeficientes: {
            x1: 1
          },
          tipo: '>=',
          terminoIndependiente: 10
        },
        {
          coeficientes: {
            x1: 1,
            x2: 1
          },
          tipo: '<=',
          terminoIndependiente: 20
        }
      ]
    }
  },

  getDummyValuesToGT () {
    const matrizValores = [
      {
        nombre: 'x1',
        coeficiente: -5,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x2',
        coeficiente: 6,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x3',
        coeficiente: 7,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x4',
        coeficiente: 0,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x5',
        coeficiente: 0,
        valoresFila: [5, -6, 10, 0, 1, 0, 0],
        estaEnBase: true,
        terminoIndependienteFila: 15
      },
      {
        nombre: 'x6',
        coeficiente: -100,
        valoresFila: [1, 5, -3, -1, 0, 1, 0],
        estaEnBase: true,
        terminoIndependienteFila: 15
      },
      {
        nombre: 'x7',
        coeficiente: -100,
        valoresFila: [1, 1, 1, 0, 0, 0, 1],
        estaEnBase: true,
        terminoIndependienteFila: 5
      }
    ]
    return matrizValores
  },

  getDummyValuesMin () {
    const matrizValores = [
      {
        nombre: 'x1',
        coeficiente: 4,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x2',
        coeficiente: 3,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x3',
        coeficiente: 0,
        valoresFila: [1, 1, 1, 0, 0, 0],
        estaEnBase: true,
        terminoIndependienteFila: 50
      },
      {
        nombre: 'x4',
        coeficiente: 0,
        valoresFila: [1, 1, 0, 1, 0, 0],
        estaEnBase: true,
        terminoIndependienteFila: 10
      },
      {
        nombre: 'x5',
        coeficiente: 0,
        valoresFila: [1, 1, 0, 0, -1, 0],
        estaEnBase: true,
        terminoIndependienteFila: 100
      },
      {
        nombre: 'x6',
        coeficiente: 0,
        valoresFila: [1, 1, 0, 0, 0, 1],
        estaEnBase: true,
        terminoIndependienteFila: 100
      }
    ]
    return matrizValores
  },

  getDummyValues () {
    const matrizValores = [
      {
        nombre: 'x1',
        coeficiente: 4,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x2',
        coeficiente: 3,
        valoresFila: null,
        estaEnBase: false,
        terminoIndependienteFila: null
      },
      {
        nombre: 'x3',
        coeficiente: 0,
        valoresFila: [6, 16, 1, 0, 0],
        estaEnBase: true,
        terminoIndependienteFila: 480
      },
      {
        nombre: 'x4',
        coeficiente: 0,
        valoresFila: [12, 6, 0, 1, 0],
        estaEnBase: true,
        terminoIndependienteFila: 420
      },
      {
        nombre: 'x5',
        coeficiente: 0,
        valoresFila: [9, 9, 0, 0, 1],
        estaEnBase: true,
        terminoIndependienteFila: 360
      }
    ]
    return matrizValores
  }
}

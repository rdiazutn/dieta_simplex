import { cloneDeep } from 'lodash'
export const SimplexDiaz = {
  testSimplex () {
    console.log('Testing!')
    const dummyValues = this.getDummyValues()
    return this.executeSimplex(dummyValues)
    // console.log(result)
  },

  executeSimplex (matrizValores) {
    let currentMatriz = matrizValores
    let x = 0
    // Límite de iteraciones
    while (x < 20) {
      x++
      const pivot = this.getPivot(currentMatriz)
      if (!pivot) {
        return currentMatriz
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
      zjMenosCj: 1000000,
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
      tita: 10000000,
      elementoDeBaseMenor: {}
    }
    elementosBase.forEach((elementoBase) => {
      const valorColumna = elementoBase.valoresFila[columnaPivot.columna]
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

import React, { Component } from "react";
import * as d3 from "d3";
import './App.css';
import AppFirstGraph from './AppFirstGraph';
import AppSecondGraph from './AppSecondGraph';
import cancer from './cancer.txt';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { datosPrimerGrafica: [], datosSegundaGrafica: [], nombresGenes: [] };
    }

    componentDidMount() {

        let shannon = (array) => {
            if (array.length === 0)
                return null;

            let modeMap = {};

            for (let i = 0; i < array.length; i++) {
                let el = array[i];
                if (modeMap[el] == null) {
                    modeMap[el] = 1;
                }
                else {
                    modeMap[el]++;
                }
            }

            let resultado = 0;
            let tamanoArreglo = array.length;

            Object.keys(modeMap).forEach(element => {
                resultado += -1 * (modeMap[element] / tamanoArreglo) * (Math.log2(modeMap[element] / tamanoArreglo))
            });

            return resultado;
        }

        d3.text(cancer).then(data => {
            let resultadoPrimeraGrafica = [];
            let resultadoSegundaGrafica = [];
            let arreglosIniciales = data.split(">");
            let respuesta = [];
            let nombres = [];

            for (let index = 0; index < arreglosIniciales.length; index++) {
                if (index === 0) {
                    continue;
                }
                let myString = arreglosIniciales[index];
                nombres.push(myString.substring(0, myString.indexOf('\n')))
                myString = myString.substring(myString.indexOf('\n') + 1);
                respuesta.push(myString);
            }

            let posPromedio = 0;
            let valPromedio = 0;

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
                let correccionSalto = 0;
                let componentes = []

                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }

                valPromedio += shannon(componentes);

                if (posPromedio >= 9 || index + 1 == respuesta[2].length) {
                    let objetoTemp = new myObject(index - correccionSalto, valPromedio / (posPromedio + 1));
                    resultadoPrimeraGrafica.push(objetoTemp);
                    valPromedio = 0;
                    posPromedio = 0;
                }
                else {
                    posPromedio++;
                }

            }

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
                let componentes = [];

                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    continue;
                }

                let objetoTemp = "{ \"posicion\":" + (index + 1) + "";

                for (let pos = 0; pos < componentes.length; pos++) {

                    objetoTemp += ", \"" + nombres[pos] + "\":\"" + respuesta[pos][index] + "\"";
                }

                objetoTemp += "}";
                let res = JSON.parse(objetoTemp)
                resultadoSegundaGrafica.push(res);
            }

            this.setState({
                datosPrimerGrafica: resultadoPrimeraGrafica,
                datosSegundaGrafica: resultadoSegundaGrafica,
                nombresGenes: nombres
            })
        })
    }

    render() {
        return (
            <div className="App">
                {/* {this.state.datosSegundaGrafica.length > 0 && this.state.nombresGenes.length > 0 ? <AppSecondGraph datosSegundaGrafica={this.state.datosSegundaGrafica} nombresGenes={this.state.nombresGenes} /> : <h2>Loading...</h2>} */}
                {this.state.datosPrimerGrafica.length > 0 ? <AppFirstGraph datosPrimerGrafica={this.state.datosPrimerGrafica} /> : <h2>Loading...</h2>}
            </div>
        );
    }
}

class myObject {
    constructor(posicion, porcentaje) {
        this.posicion = posicion;
        this.porcentaje = porcentaje;
    }
}

export default App;
import React, { Component } from "react";
import * as d3 from "d3";
import './App.css';
import AppFirstGraph from './AppFirstGraph';
import AppSecondGraph from './AppSecondGraph';
import AppThirdGraph from './AppThirdGraph';
// import cancer from './cancer.txt';
import cancer from './archivoJorge.txt';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { datosPrimerGrafica: [], datosSegundaGrafica: [], nombresGenes: [], datosGraficaPruebas: [], primerValorFiltro: 0, segundoValorFiltro: 0 };
        this.selecciones = this.selecciones.bind(this);
        this.filtroAppJS = this.filtroAppJS.bind(this);
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

        let objetoSegundaGrafica = (array, posicion) => {
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

            let tamanoArreglo = array.length;
            let numeroA = modeMap["A"] ? modeMap["A"] : 0;
            let numeroC = modeMap["C"] ? modeMap["C"] : 0;
            let numeroG = modeMap["G"] ? modeMap["G"] : 0;
            let numeroT = modeMap["T"] ? modeMap["T"] : 0;
            let numeroMenos = modeMap["-"] ? modeMap["-"] : 0;

            let respuesta = new myObjectSegundaGrafica(posicion, numeroA / tamanoArreglo, numeroC / tamanoArreglo, numeroG / tamanoArreglo, numeroT / tamanoArreglo, numeroMenos / tamanoArreglo);

            return respuesta;
        }

        d3.text(cancer).then(data => {
            let resultadoPrimeraGrafica = [];
            let resultadoSegundaGrafica = [];
            let resultadoGraficaPruebas = [];
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
            let correccionSalto = 0;

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {

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

            correccionSalto = 0;

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
                let componentes = [];

                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }

                let objetoTemp = "{\"posicion\":" + (index + 1 - correccionSalto) + "";

                for (let pos = 0; pos < componentes.length; pos++) {
                    objetoTemp += ",\"" + nombres[pos] + "\":\"" + respuesta[pos][index] + "\"";
                }

                objetoTemp += "}";
                objetoTemp = objetoTemp.replace( /[\r\n]+/gm, "" );
                let res = JSON.parse(objetoTemp)
                resultadoSegundaGrafica.push(res);
            }

            //GRAFICA DE PRUEBAS LULWAYNE BRUH

            let objetoPosicion = null;
            correccionSalto = 0;

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
                let componentes = []


                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }

                objetoPosicion = objetoSegundaGrafica(componentes, (index + 1 - correccionSalto));
                resultadoGraficaPruebas.push(objetoPosicion);
            }

            this.setState({
                datosPrimerGrafica: resultadoPrimeraGrafica,
                datosSegundaGrafica: resultadoSegundaGrafica,
                datosGraficaPruebas: resultadoGraficaPruebas,
                primerValorFiltro: 1,
                segundoValorFiltro: resultadoSegundaGrafica.length,
                nombresGenes: nombres
            })
        })
    }

    filtroAppJS(event) {
        let primerValor = parseInt(event.target.value.split(" - ")[0]);
        let segundoValor = parseInt(event.target.value.split(" - ")[1]);
        this.setState({
            segundoValorFiltro: segundoValor, primerValorFiltro: primerValor
        });
    }

    selecciones() {
        let tamanoTotal = this.state.datosSegundaGrafica.length;
        let numerosSobrantes = tamanoTotal % 100;
        let arregloMapeo = []

        arregloMapeo.push(1 + " - " + tamanoTotal);

        for (let index = 0; index < tamanoTotal - numerosSobrantes; index += 100) {
            arregloMapeo.push((index + 1) + " - " + (index + 100));
        }

        if((tamanoTotal - numerosSobrantes) != 0)
        {
            arregloMapeo.push((tamanoTotal - numerosSobrantes + 1) + " - " + tamanoTotal);
        }

        return (
            arregloMapeo.map(function (item, i) {
                return <option value={item} key={i}>{item}</option>
            }))
    }

    render() {
        return (
            <div className="App">
                {this.state.datosSegundaGrafica.length > 0 ?
                    <div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md">
                                    <form>
                                        <select width="500" className="form-control" onChange={this.filtroAppJS}>
                                            {this.selecciones()}
                                        </select>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* <AppThirdGraph datosSegundaGrafica={this.state.datosSegundaGrafica} nombresGenes={this.state.nombresGenes} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro} /> */}
                        <AppFirstGraph datosPrimerGrafica={this.state.datosPrimerGrafica} />
                        {/* <AppSecondGraph datosGraficaPruebas={this.state.datosGraficaPruebas} nombresGenes={this.state.nombresGenes} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro}/> */}
                    </div> : <h2>Loading...</h2>}
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

class myObjectSegundaGrafica {
    constructor(posicion, porcentajea, porcentajec, porcentajeg, porcentajet, porcentajemenos) {
        this.posicion = posicion;
        this.porcentajea = porcentajea;
        this.porcentajec = porcentajec;
        this.porcentajeg = porcentajeg;
        this.porcentajet = porcentajet;
        this.porcentajemenos = porcentajemenos;
    }
}

export default App;
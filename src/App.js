import React, { Component } from "react";
import * as d3 from "d3";
import './App.css';
import AppFirstGraph from './AppFirstGraph';
import AppSecondGraph from './AppSecondGraph';
import AppThirdGraph from './AppThirdGraph';
import AppFourthGraph from './AppFourthGraph';
import cancer from './archivoJorge.txt';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { respuesta: [], datosPrimerGrafica: [], datosSegundaGrafica: [], nombresGenes: [], datosGraficaPruebas: [], primerValorFiltro: 0, segundoValorFiltro: 0, boxesseleccionados: [] };
        this.selecciones = this.selecciones.bind(this);
        this.filtroAppJS = this.filtroAppJS.bind(this);
        this.checkboxes = this.checkboxes.bind(this);
        this.filter = this.filter.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deselectAll = this.deselectAll.bind(this);
        this.shannon = this.shannon.bind(this);
        this.objetoSegundaGrafica = this.objetoSegundaGrafica.bind(this);
    }

    shannon = (array) => {
        if (array.length === 0)
            return 0;

        let modeMap = {};
        let el;

        for (let i = 0; i < array.length; i++) {
            el = array[i];
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

    objetoSegundaGrafica = (array, posicion) => {
        if (array.length === 0)
            return new myObjectSegundaGrafica(posicion, 0, 0, 0, 0, 0);

        let modeMap = {};
        let el;
        for (let i = 0; i < array.length; i++) {
            el = array[i];
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

    componentDidMount() {

        d3.text(cancer).then(data => {
            let resultadoPrimeraGrafica = [];
            let resultadoTerceraGrafica = [];
            let resultadoSegundaGrafica = [];
            const arreglosIniciales = data.split(">");
            let respuesta = [];
            let nombres = [];
            let myString;

            for (let index = 0; index < arreglosIniciales.length; index++) {
                if (index === 0) {
                    continue;
                }
                myString = arreglosIniciales[index];
                nombres.push(myString.substring(0, myString.indexOf('\n')))
                myString = myString.substring(myString.indexOf('\n') + 1);
                respuesta.push(myString);
            }

            let posPromedio = 0;
            let valPromedio = 0;
            let correccionSalto = 0;
            let componentes;

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {

                componentes = []

                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }

                valPromedio += this.shannon(componentes);

                if (posPromedio >= 10 || index + 1 == respuesta[2].length) {
                    let objetoTemp = new myObject(index - correccionSalto, valPromedio / (posPromedio + 1));
                    resultadoPrimeraGrafica.push(objetoTemp);
                    valPromedio = 0;
                    posPromedio = 0;
                }
                else {
                    posPromedio++;
                }
            }

            //TERCERA GRAFICA

            correccionSalto = 0;
            componentes = [];

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
                componentes = [];

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
                objetoTemp = objetoTemp.replace(/[\r\n]+/gm, "");
                let res = JSON.parse(objetoTemp)
                resultadoTerceraGrafica.push(res);
            }

            //SEGUNDA GRAFICA

            let objetoPosicion = null;
            correccionSalto = 0;
            componentes = [];

            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
                componentes = []

                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }

                objetoPosicion = this.objetoSegundaGrafica(componentes, (index + 1 - correccionSalto));
                resultadoSegundaGrafica.push(objetoPosicion);
            }

            this.setState({
                datosPrimerGrafica: resultadoPrimeraGrafica,
                datosSegundaGrafica: resultadoTerceraGrafica,
                datosGraficaPruebas: resultadoSegundaGrafica,
                primerValorFiltro: 1,
                boxesseleccionados: nombres,
                segundoValorFiltro: resultadoTerceraGrafica.length,
                nombresGenes: nombres,
                respuesta: respuesta
            })

            d3.selectAll(".table-check")
                .style("height", "300px")
                .style("overflow", "auto");

        })
    }

    filtroAppJS(event) {
        const primerValor = parseInt(event.target.value.split(" - ")[0]);
        const segundoValor = parseInt(event.target.value.split(" - ")[1]);
        this.setState({
            segundoValorFiltro: segundoValor, primerValorFiltro: primerValor
        });
    }

    selecciones() {
        const tamanoTotal = this.state.datosSegundaGrafica.length;
        const numerosSobrantes = tamanoTotal % 100;
        let arregloMapeo = []

        arregloMapeo.push(1 + " - " + tamanoTotal);

        for (let index = 0; index < tamanoTotal - numerosSobrantes; index += 100) {
            arregloMapeo.push((index + 1) + " - " + (index + 100));
        }

        if ((tamanoTotal - numerosSobrantes) != 0) {
            arregloMapeo.push((tamanoTotal - numerosSobrantes + 1) + " - " + tamanoTotal);
        }

        return (
            arregloMapeo.map(function (item, i) {
                return <option value={item} key={i}>{item}</option>
            }))
    }

    checkboxes() {
        const nombres = this.state.nombresGenes;
        return (
            nombres.map(function (item, i) {
                return (<div className="form-check espacioCheckbox" key={i}>
                    <input className="form-check-input" type="checkbox" id={i} value={item} defaultChecked />
                    <label className="form-check-label" htmlFor={i}>{item}</label>
                </div>)
            }))
    }

    filter() {
        let arregloNombres = [];

        let boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            if (item.checked === true) {
                arregloNombres.push(item.value);
            }
        })

        //PRIMER GRAFICA

        let objetoTemp = null;
        let posPromedio = 0;
        let resultadoPrimeraGrafica = [];
        let valPromedio = 0;
        let correccionSalto = 0;
        const respuesta = this.state.respuesta;
        const nombreGenes = this.state.nombresGenes;

        for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {

            let componentes = []

            for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                if (arregloNombres.includes(nombreGenes[indexInterno])) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }
            }

            if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                correccionSalto++;
                continue;
            }

            valPromedio += this.shannon(componentes);

            if (posPromedio >= 10 || index + 1 == respuesta[2].length) {
                objetoTemp = new myObject(index - correccionSalto, valPromedio / (posPromedio + 1));
                resultadoPrimeraGrafica.push(objetoTemp);
                valPromedio = 0;
                posPromedio = 0;
            }
            else {
                posPromedio++;
            }
        }

        //GRAFICA DE COLORES

        let objetoPosicion = null;
        correccionSalto = 0;
        let resultadoSegundaGrafica = [];

        for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
            let componentes = []

            for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                if (arregloNombres.includes(nombreGenes[indexInterno])) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }
            }

            if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                correccionSalto++;
                continue;
            }

            objetoPosicion = this.objetoSegundaGrafica(componentes, (index + 1 - correccionSalto));
            resultadoSegundaGrafica.push(objetoPosicion);
        }

        this.setState({
            boxesseleccionados: arregloNombres,
            datosGraficaPruebas: resultadoSegundaGrafica,
            datosPrimerGrafica: resultadoPrimeraGrafica
        });
    }

    selectAll() {
        const boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            item.checked = true;
        })
        this.filter();
    }

    deselectAll() {
        const boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            item.checked = false;
        })
        this.filter();
    }

    render() {
        return (
            <div className="App">
                {this.state.datosSegundaGrafica.length > 0 ?
                    <div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md">
                                    <button className="btn btn-primary" type="submit" onClick={this.filter}>Filter</button>
                                    <button className="btn btn-primary" type="submit" onClick={this.selectAll}>Select All Genes</button>
                                    <button className="btn btn-primary" type="submit" onClick={this.deselectAll}>Deselect All Genes</button>
                                </div>
                            </div>
                            <div className="row table-check">
                                <div className="col-md">
                                    {this.checkboxes()}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md">
                                    <form>
                                        <select width="500" id="barraNumero" className="form-control" onChange={this.filtroAppJS}>
                                            {this.selecciones()}
                                        </select>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* <AppThirdGraph datosTerceraGrafica={this.state.datosSegundaGrafica} nombresGenes={this.state.nombresGenes} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro} /> */}
                        {/* <AppFirstGraph datosPrimerGrafica={this.state.datosPrimerGrafica} /> */}
                        <AppSecondGraph datosGraficaPruebas={this.state.datosGraficaPruebas} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro} />
                        {/* <AppFourthGraph nombresGenes={this.state.boxesseleccionados} datosCuartaGrafica={this.state.datosSegundaGrafica} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro} /> */}
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
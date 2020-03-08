import React, { Component } from "react";
import * as d3 from "d3";
import './App.css';
import AppFirstGraph from './AppFirstGraph';
import AppSecondGraph from './AppSecondGraph';
import AppThirdGraph from './AppThirdGraph';
import AppFourthGraph from './AppFourthGraph';
import AppFifthGraph from './AppFifthGraph';
import cancer from './archivoJorge.txt';
//import cancer from './proteinasfasta.txt';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { esProteina: false, respuesta: [], datosPrimerGrafica: [], datosSegundaGrafica: [], nombresGenes: [], datosGraficaPruebas: [], primerValorFiltro: 0, segundoValorFiltro: 0, boxesseleccionados: [] };
        this.selecciones = this.selecciones.bind(this);
        this.filtroAppJS = this.filtroAppJS.bind(this);
        this.checkboxes = this.checkboxes.bind(this);
        this.filter = this.filter.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deselectAll = this.deselectAll.bind(this);
        this.shannon = this.shannon.bind(this);
        this.objetoSegundaGrafica = this.objetoSegundaGrafica.bind(this);
        this.objetoSegundaGraficaProteinas = this.objetoSegundaGraficaProteinas.bind(this);
        this.tableref = React.createRef();
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
        let numeroA = modeMap["A"] ? modeMap["A"] / tamanoArreglo : 0;
        let numeroC = modeMap["C"] ? modeMap["C"] / tamanoArreglo : 0;
        let numeroG = modeMap["G"] ? modeMap["G"] / tamanoArreglo : 0;
        let numeroT = modeMap["T"] ? modeMap["T"] / tamanoArreglo : 0;
        let numeroMenos = modeMap["-"] ? modeMap["-"] / tamanoArreglo : 0;

        let respuesta = new myObjectSegundaGrafica(posicion, numeroA, numeroC, numeroG, numeroT, numeroMenos);

        return respuesta;
    }

    objetoSegundaGraficaProteinas = (array, posicion) => {
        if (array.length === 0)
            return new myObjectSegundaGraficaProteinas(posicion, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

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
        let numeroA = modeMap["A"] ? modeMap["A"] / tamanoArreglo : 0;
        let numeroC = modeMap["C"] ? modeMap["C"] / tamanoArreglo : 0;
        let numeroG = modeMap["G"] ? modeMap["G"] / tamanoArreglo : 0;
        let numeroT = modeMap["T"] ? modeMap["T"] / tamanoArreglo : 0;
        let numeroR = modeMap["R"] ? modeMap["R"] / tamanoArreglo : 0;
        let numeroN = modeMap["N"] ? modeMap["N"] / tamanoArreglo : 0;
        let numeroD = modeMap["D"] ? modeMap["D"] / tamanoArreglo : 0;
        let numeroB = modeMap["B"] ? modeMap["B"] / tamanoArreglo : 0;
        let numeroE = modeMap["E"] ? modeMap["E"] / tamanoArreglo : 0;
        let numeroQ = modeMap["Q"] ? modeMap["Q"] / tamanoArreglo : 0;
        let numeroZ = modeMap["Z"] ? modeMap["Z"] / tamanoArreglo : 0;
        let numeroH = modeMap["H"] ? modeMap["H"] / tamanoArreglo : 0;
        let numeroI = modeMap["I"] ? modeMap["I"] / tamanoArreglo : 0;
        let numeroL = modeMap["L"] ? modeMap["L"] / tamanoArreglo : 0;
        let numeroK = modeMap["K"] ? modeMap["K"] / tamanoArreglo : 0;
        let numeroM = modeMap["M"] ? modeMap["M"] / tamanoArreglo : 0;
        let numeroF = modeMap["F"] ? modeMap["F"] / tamanoArreglo : 0;
        let numeroP = modeMap["P"] ? modeMap["P"] / tamanoArreglo : 0;
        let numeroS = modeMap["S"] ? modeMap["S"] / tamanoArreglo : 0;
        let numeroW = modeMap["W"] ? modeMap["W"] / tamanoArreglo : 0;
        let numeroY = modeMap["Y"] ? modeMap["Y"] / tamanoArreglo : 0;
        let numeroV = modeMap["V"] ? modeMap["V"] / tamanoArreglo : 0;
        let numeroMenos = modeMap["-"] ? modeMap["-"] / tamanoArreglo : 0;

        let respuesta = new myObjectSegundaGraficaProteinas(posicion, numeroA, numeroC, numeroG, numeroT, numeroR, numeroN, numeroD, numeroB, numeroE, numeroQ,
            numeroZ, numeroH, numeroI, numeroL, numeroK, numeroM, numeroF, numeroP, numeroS, numeroW, numeroY, numeroV, numeroMenos);

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
            let esProteina = false;

            for (let index = 0; index < arreglosIniciales.length; index++) {
                if (index === 0) {
                    continue;
                }
                myString = arreglosIniciales[index];
                nombres.push(myString.substring(0, myString.indexOf('\n')))
                myString = myString.substring(myString.indexOf('\n') + 1);
                respuesta.push(myString);
            }

            const letrasSoloProteinas = ["R", "N", "D", "B", "E", "Q", "Z", "H", "I", "L", "K", "M", "F", "P", "S", "W", "Y", "V"];
            if (letrasSoloProteinas.some(el => respuesta[0].includes(el))) {
                esProteina = true;
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

                if (!esProteina) {
                    if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                        correccionSalto++;
                        continue;
                    }
                }
                else {
                    if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                        && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                        && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                        correccionSalto++;
                        continue;
                    }
                }

                valPromedio += this.shannon(componentes);

                if (posPromedio >= 5 || index + 1 == respuesta[respuesta.length - 1].length) {
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

                if (!esProteina) {
                    if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                        correccionSalto++;
                        continue;
                    }
                }
                else {
                    if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                        && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                        && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                        correccionSalto++;
                        continue;
                    }
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

                if (!esProteina) {
                    if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                        correccionSalto++;
                        continue;
                    }

                    objetoPosicion = this.objetoSegundaGrafica(componentes, (index + 1 - correccionSalto));
                    resultadoSegundaGrafica.push(objetoPosicion);
                }
                else {
                    //FALTAN
                    if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                        && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                        && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                        correccionSalto++;
                        continue;
                    }

                    objetoPosicion = this.objetoSegundaGraficaProteinas(componentes, (index + 1 - correccionSalto));
                    resultadoSegundaGrafica.push(objetoPosicion);
                }
            }

            //QUINTA GRAFICA
            let resultadoQuintaGrafica = [];
            let llaves = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet"];
            let nombreMayor;
            let valorMayor;

            resultadoSegundaGrafica.map(function (item, i) {
                nombreMayor = null;
                valorMayor = 0;
                llaves.forEach(element => {
                    if(item[element] > valorMayor){
                        nombreMayor = element;
                        valorMayor = item[element];
                    } 
                });
                resultadoQuintaGrafica.push(new myObjectQuintaGrafica(i+1, nombreMayor))
            })

            this.setState({
                datosPrimerGrafica: resultadoPrimeraGrafica,
                datosSegundaGrafica: resultadoTerceraGrafica,
                datosGraficaPruebas: resultadoSegundaGrafica,
                datosQuintaGrafica: resultadoQuintaGrafica,
                primerValorFiltro: 1,
                boxesseleccionados: nombres,
                segundoValorFiltro: resultadoTerceraGrafica.length,
                nombresGenes: nombres,
                respuesta: respuesta,
                esProteina: esProteina
            })

            if (this.tableref.current.offsetHeight > 300) {
                d3.selectAll(".table-check")
                    .style("height", "300px")
                    .style("overflow", "auto");
            } else {
                d3.selectAll(".table-check")
                    .style("height", null)
                    .style("overflow", "auto");
            }
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
        const esProteina = this.state.esProteina;

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
        let componentes = [];

        for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {

            componentes = []

            for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                if (arregloNombres.includes(nombreGenes[indexInterno])) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }
            }

            if (!esProteina) {
                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }
            }
            else {
                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                    && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                    && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                    correccionSalto++;
                    continue;
                }
            }

            valPromedio += this.shannon(componentes);

            if (posPromedio >= 5 || index + 1 == respuesta[respuesta.length - 1].length) {
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
        componentes = [];
        for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
            componentes = [];

            for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                if (arregloNombres.includes(nombreGenes[indexInterno])) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }
            }

            if (!esProteina) {
                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }

                objetoPosicion = this.objetoSegundaGrafica(componentes, (index + 1 - correccionSalto));
                resultadoSegundaGrafica.push(objetoPosicion);
            }
            else {
                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                    && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                    && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                    correccionSalto++;
                    continue;
                }

                objetoPosicion = this.objetoSegundaGraficaProteinas(componentes, (index + 1 - correccionSalto));
                resultadoSegundaGrafica.push(objetoPosicion);
            }
        }

        console.log(resultadoSegundaGrafica);

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
                            <div className="row table-check" ref={this.tableref}>
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
                        {/* <AppThirdGraph esProteina={this.state.esProteina} datosTerceraGrafica={this.state.datosSegundaGrafica} nombresGenes={this.state.nombresGenes} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro} /> */}
                        {/* <AppFirstGraph datosPrimerGrafica={this.state.datosPrimerGrafica} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro}/> */}
                        {/* <AppSecondGraph esProteina={this.state.esProteina} datosGraficaPruebas={this.state.datosGraficaPruebas} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro} /> */}
                        {/* <AppFourthGraph nombresGenes={this.state.boxesseleccionados} datosCuartaGrafica={this.state.datosSegundaGrafica} primerValor={this.state.primerValorFiltro} segundoValor={this.state.segundoValorFiltro} /> */}
                        <AppFifthGraph datosQuintaGrafica={this.state.datosQuintaGrafica} />
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

class myObjectQuintaGrafica {
    constructor(posicion, letra) {
        this.posicion = posicion;
        this.letra = letra;
    }
}

class myObjectSegundaGraficaProteinas {
    constructor(posicion, porcentajea, porcentajec, porcentajeg, porcentajet, porcentajer, porcentajen, porcentajed, porcentajeb, porcentajee,
        porcentajeq, porcentajez, porcentajeh, porcentajei, porcentajel, porcentajek, porcentajem, porcentajef, porcentajep,
        porcentajes, porcentajew, porcentajey, porcentajev, porcentajemenos) {
        this.posicion = posicion;
        this.porcentajea = porcentajea;
        this.porcentajec = porcentajec;
        this.porcentajeg = porcentajeg;
        this.porcentajet = porcentajet;
        this.porcentajer = porcentajer;
        this.porcentajen = porcentajen;
        this.porcentajed = porcentajed;
        this.porcentajeb = porcentajeb;
        this.porcentajee = porcentajee;
        this.porcentajeq = porcentajeq;
        this.porcentajez = porcentajez;
        this.porcentajeh = porcentajeh;
        this.porcentajei = porcentajei;
        this.porcentajel = porcentajel;
        this.porcentajek = porcentajek;
        this.porcentajem = porcentajem;
        this.porcentajef = porcentajef;
        this.porcentajep = porcentajep;
        this.porcentajes = porcentajes;
        this.porcentajew = porcentajew;
        this.porcentajey = porcentajey;
        this.porcentajev = porcentajev;
        this.porcentajemenos = porcentajemenos;
    }
}

export default App;
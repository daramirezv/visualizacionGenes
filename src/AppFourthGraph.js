import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './AppFourthGraph.css';

class AppFourthGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { informacion4: "Hola4" };
        this.posiciones = this.posiciones.bind(this);
        this.caracteres = this.caracteres.bind(this);
        this.nombres = this.nombres.bind(this);
    }

    componentDidUpdate() {
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 750) {
            d3.selectAll(".tabla-vertical")
                .style("height", "750px")
        }
        else {
            d3.selectAll(".tabla-vertical")
                .style("height", null);
        }
    }

    componentDidMount() {
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 750) {
            d3.selectAll(".tabla-vertical")
                .style("height", "750px");
        }
        else {
            d3.selectAll(".tabla-vertical")
                .style("height", null);
        }
    }

    posiciones() {
        const primerValor = this.props.primerValor;
        const segundoValor = this.props.segundoValor;
        const datosCuartaGrafica = this.props.datosCuartaGrafica.slice(primerValor - 1, segundoValor);
        return (
            datosCuartaGrafica.map(function (item, i) {
                return <th scope="col" className="stickyhead" key={i}>{i + primerValor}</th>
            }))
    }

    nombres(funcionCaracteres) {
        const nombres = this.props.nombresGenes;
        return (
            nombres.map(function (item, i) {
                return (
                    <tr key={i}>
                        <td scope="row" className="stickyleft" key={i}>{item}</td>
                        {funcionCaracteres(item)}
                    </tr>)
            }))
    }

    caracteres(nombreGen) {
        const primerValor = this.props.primerValor;
        const segundoValor = this.props.segundoValor;
        const datosCuartaGrafica = this.props.datosCuartaGrafica.slice(primerValor - 1, segundoValor);
        let clase;
        let caracter;
        return (
            datosCuartaGrafica.map(function (item, i) {
                caracter = datosCuartaGrafica[i][nombreGen.replace(/[\r\n]+/gm, "")];
                if (caracter === "-") {
                    clase = "gap"
                }
                else {
                    clase = caracter;
                }
                return <td className={clase} key={i}><b>{caracter}</b></td>
            }))
    }

    render() {
        return (
            <div className="cuerpo cuartaGraficaMargen">
                <h1 className="margentitulo4">Sequence Matrix <Tooltip placement="right" trigger="click" tooltip={this.state.informacion4}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className="table-responsive tabla-vertical">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="stickyhead" scope="col"></th>
                                            {this.posiciones()}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.nombres(this.caracteres)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppFourthGraph;
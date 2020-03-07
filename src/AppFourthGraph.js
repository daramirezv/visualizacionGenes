import React, { Component } from "react";
import * as d3 from "d3";
import './AppFourthGraph.css';

class AppFourthGraph extends Component {

    constructor(props) {
        super(props);
        this.posiciones = this.posiciones.bind(this);
        this.caracteres = this.caracteres.bind(this);
        this.nombres = this.nombres.bind(this);
    }

    componentDidUpdate() {
        d3.selectAll(".tabla-table")
            .style("height", null);
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 750) {
            d3.selectAll(".tabla-vertical")
                .style("height", "750px");
        }
    }

    componentDidMount() {
        d3.selectAll(".tabla-table")
            .style("height", null);
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 750) {
            d3.selectAll(".tabla-vertical")
                .style("height", "750px");
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
            <div className="cuerpo">
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
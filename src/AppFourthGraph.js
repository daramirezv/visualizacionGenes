import React, { Component } from "react";
import './AppFourthGraph.css';

class AppFourthGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.posiciones = this.posiciones.bind(this);
        this.anidada = this.anidada.bind(this);
        this.tableref = React.createRef();
    }

    posiciones() {
        var primerValor = this.props.primerValor;
        var segundoValor = this.props.segundoValor;
        var datosSegundaGrafica = this.props.datosSegundaGrafica.slice(primerValor - 1, segundoValor);

        return (
            datosSegundaGrafica.map(function (item, i) {
                return <th scope="col" className="stickyhead" key={i}>{i + primerValor}</th>
            }))
    }

    valores(anidada) {
        var nombres = this.props.nombresGenes;
        return (
            nombres.map(function (item, i) {
                return (
                    <tr key={i}>
                        <th scope="row" key={i}>{item}</th>
                        {anidada(item)}
                    </tr>)
            }))
    }

    anidada(nombreGen) {
        var primerValor = this.props.primerValor;
        var segundoValor = this.props.segundoValor;
        var datosSegundaGrafica = this.props.datosSegundaGrafica.slice(primerValor - 1, segundoValor);
        return (
            datosSegundaGrafica.map(function (item, i) {
                let caracter = datosSegundaGrafica[i][nombreGen.replace(/[\r\n]+/gm, "")];
                let clase = "";
                if(caracter === "-")
                {
                    clase = "gap"
                }
                else{
                    clase = caracter;
                }
                return <td className={clase} key={i}><b>{caracter}</b></td>
            }))
    }

    render() {
        return (
            <div id="my_dataviz">
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className ="table-responsive tabla-vertical">
                            <table className="table table-striped table-bordered" ref={this.tableref}>
                                <thead>
                                    <tr>
                                        <th className="stickyhead"scope="col">Name</th>
                                        {this.posiciones()}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.valores(this.anidada)}
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
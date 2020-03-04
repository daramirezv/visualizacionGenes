import React, { Component } from "react";
import * as d3 from "d3";
import './AppFourthGraph.css';

class AppFourthGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { boxesseleccionados: [] };
        this.posiciones = this.posiciones.bind(this);
        this.anidada = this.anidada.bind(this);
        this.checkboxes = this.checkboxes.bind(this);
        this.filter = this.filter.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deselectAll = this.deselectAll.bind(this);
        this.tableref = React.createRef();
    }

    componentDidMount() {
        this.selectAll();
    }

    componentDidUpdate() {
        d3.selectAll(".tabla-vertical")
            .style("height", null);
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 750) {
            d3.selectAll(".tabla-vertical")
                .style("height", "750px");
        }
    }

    posiciones() {
        let primerValor = this.props.primerValor;
        let segundoValor = this.props.segundoValor;
        let datosSegundaGrafica = this.props.datosSegundaGrafica.slice(primerValor - 1, segundoValor);

        return (
            datosSegundaGrafica.map(function (item, i) {
                return <th scope="col" className="stickyhead" key={i}>{i + primerValor}</th>
            }))
    }

    valores(anidada) {
        let nombres = this.state.boxesseleccionados;
        return (
            nombres.map(function (item, i) {
                return (
                    <tr key={i}>
                        <td scope="row" className="stickyleft" key={i}>{item}</td>
                        {anidada(item)}
                    </tr>)
            }))
    }

    anidada(nombreGen) {

        let primerValor = this.props.primerValor;
        let segundoValor = this.props.segundoValor;
        let datosSegundaGrafica = this.props.datosSegundaGrafica.slice(primerValor - 1, segundoValor);
        return (
            datosSegundaGrafica.map(function (item, i) {
                let caracter = datosSegundaGrafica[i][nombreGen.replace(/[\r\n]+/gm, "")];
                let clase = "";
                if (caracter === "-") {
                    clase = "gap"
                }
                else {
                    clase = caracter;
                }
                return <td className={clase} key={i}><b>{caracter}</b></td>
            }))
    }

    checkboxes() {
        let nombres = this.props.nombresGenes;
        return (
            nombres.map(function (item, i) {
                return (<div className="form-check espacioCheckbox" key={i}>
                    <input className="form-check-input" type="checkbox" id={i} value={item} />
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

        this.setState({
            boxesseleccionados: arregloNombres
        });
    }

    selectAll() {
        let boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            item.checked = true;
        })
        this.filter();
    }

    deselectAll() {
        let boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            item.checked = false;
        })
        this.filter();
    }

    render() {
        return (
            <div className="cuerpo">
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className="table-responsive tabla-vertical" ref={this.tableref}>
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="stickyhead" scope="col"></th>
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
                    <div className="row">
                        <div className="col-md">
                            <button className="btn btn-primary" type="submit" onClick={this.filter}>Filter</button>
                            <button className="btn btn-primary" type="submit" onClick={this.selectAll}>Select All Genes</button>
                            <button className="btn btn-primary" type="submit" onClick={this.deselectAll}>Deselect All Genes</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            {this.checkboxes()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppFourthGraph;
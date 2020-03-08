import React, { Component } from "react";
import * as d3 from "d3";
import './AppFifthGraph.css';

class AppFifthGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { solucion1: [], solucion2: [], solucion3: [] };
        this.posiciones = this.posiciones.bind(this);
        this.valores = this.valores.bind(this);
        this.mapeocaracteres = this.mapeocaracteres.bind(this);
    }

    componentDidMount() {
        let diccionario = {};
        diccionario["UUU"] = "F";
        diccionario["UUC"] = "F";
        diccionario["UUA"] = "L";
        diccionario["UUG"] = "L";
        diccionario["CUU"] = "L";
        diccionario["CUC"] = "L";
        diccionario["CUA"] = "L";
        diccionario["CUG"] = "L";
        diccionario["AUU"] = "I";
        diccionario["AUC"] = "I";
        diccionario["AUA"] = "I";
        diccionario["AUG"] = "M";
        diccionario["GUU"] = "V";
        diccionario["GUC"] = "V";
        diccionario["GUA"] = "V";
        diccionario["GUG"] = "V";

        diccionario["UCU"] = "S";
        diccionario["UCC"] = "S";
        diccionario["UCA"] = "S";
        diccionario["UCG"] = "S";
        diccionario["CCU"] = "P";
        diccionario["CCC"] = "P";
        diccionario["CCA"] = "P";
        diccionario["CCG"] = "P";
        diccionario["ACU"] = "T";
        diccionario["ACC"] = "T";
        diccionario["ACA"] = "T";
        diccionario["ACG"] = "T";
        diccionario["GCU"] = "A";
        diccionario["GCC"] = "A";
        diccionario["GCA"] = "A";
        diccionario["GCG"] = "A";

        diccionario["UAU"] = "T";
        diccionario["UAC"] = "T";
        diccionario["UAA"] = "Stop";
        diccionario["UAG"] = "Stop";
        diccionario["CAU"] = "H";
        diccionario["CAC"] = "H";
        diccionario["CAA"] = "Q";
        diccionario["CAG"] = "Q";
        diccionario["AAU"] = "N";
        diccionario["AAC"] = "N";
        diccionario["AAA"] = "K";
        diccionario["AAG"] = "K";
        diccionario["GAU"] = "D";
        diccionario["GAC"] = "D";
        diccionario["GAA"] = "E";
        diccionario["GAG"] = "E";

        diccionario["UGU"] = "C";
        diccionario["UGC"] = "C";
        diccionario["UGA"] = "Stop";
        diccionario["UGG"] = "W";
        diccionario["CGU"] = "R";
        diccionario["CGC"] = "R";
        diccionario["CGA"] = "R";
        diccionario["CGG"] = "R";
        diccionario["AGU"] = "S";
        diccionario["AGC"] = "S";
        diccionario["AGA"] = "R";
        diccionario["AGG"] = "R";
        diccionario["GGU"] = "G";
        diccionario["GGC"] = "G";
        diccionario["GGA"] = "G";
        diccionario["GGG"] = "G";

        const datos = this.props.datosQuintaGrafica;
        let codon;
        let traduccion;
        let solucion1 = [];
        let solucion2 = [];
        let solucion3 = [];
        let valor1;
        let valor2;
        let valor3;

        for (let index = 0; index + 2 < datos.length; index += 3) {

            valor1 = this.mapeocaracteres(datos[index].letra);
            valor2 = this.mapeocaracteres(datos[index + 1].letra);
            valor3 = this.mapeocaracteres(datos[index + 2].letra);
            codon = valor1 + valor2 + valor3;
            traduccion = diccionario[codon];
            solucion1.push(traduccion);
        }

        for (let index = 1; index + 2 < datos.length; index += 3) {

            valor1 = this.mapeocaracteres(datos[index].letra);
            valor2 = this.mapeocaracteres(datos[index + 1].letra);
            valor3 = this.mapeocaracteres(datos[index + 2].letra);
            codon = valor1 + valor2 + valor3;
            traduccion = diccionario[codon];
            solucion2.push(traduccion);
        }

        for (let index = 2; index + 2 < datos.length; index += 3) {

            valor1 = this.mapeocaracteres(datos[index].letra);
            valor2 = this.mapeocaracteres(datos[index + 1].letra);
            valor3 = this.mapeocaracteres(datos[index + 2].letra);
            codon = valor1 + valor2 + valor3;
            traduccion = diccionario[codon];
            solucion3.push(traduccion);
        }
        
        this.setState({
            solucion1: solucion1,
            solucion2: solucion2,
            solucion3: solucion3
        })
    }

    posiciones() {
        const primerArreglo = this.state.solucion1;
        return (
            primerArreglo.map(function (item, i) {
                return <th scope="col" className="tableheadleft" key={i}>{i + 1}</th>
            }))
    }

    valores(numeroArreglo) {
        let arreglo;
        switch (numeroArreglo) {
            case 1:
                arreglo = this.state.solucion1;
                break;
            case 2:
                arreglo = this.state.solucion2;
                break;
            default:
                arreglo = this.state.solucion3;
                break;
        }
        return (
            arreglo.map(function (item, i) {
                return (<td className={arreglo[i] + "tabla"} key={i}><b>{arreglo[i]}</b></td>)
            }))
    }

    mapeocaracteres(d) {
        switch (d) {
            case "porcentajea":
                return "A"
            case "porcentajet":
                return "U"
            case "porcentajeg":
                return "G"
            default:
                return "C"
        }
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
                                            <th className="tableheadleft" scope="col"></th>
                                            {this.posiciones()}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>1</b></td>
                                            {this.valores(1)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>2</b></td>
                                            {this.valores(2)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>3</b></td>
                                            {this.valores(3)}
                                        </tr>
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

export default AppFifthGraph;
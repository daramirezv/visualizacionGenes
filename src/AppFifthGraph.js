import React, { Component } from "react";
import './AppFifthGraph.css';

class AppFifthGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { solucion1: [], solucion2: [], solucion3: [], cadenaOriginal: [] };
        this.posiciones = this.posiciones.bind(this);
        this.valores = this.valores.bind(this);
        this.mapeocaracteres = this.mapeocaracteres.bind(this);
        this.original = this.original.bind(this);
        this.ultimaPosicion = this.ultimaPosicion.bind(this);
        this.download = this.download.bind(this);
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
        diccionario["UAA"] = "stop";
        diccionario["UAG"] = "stop";
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
        diccionario["UGA"] = "stop";
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
        let cadenaOriginal = [];
        let solucion1 = [];
        let solucion2 = [];
        let solucion3 = [];
        let valor1;
        let valor2;
        let valor3;

        for (let index = 0; index < datos.length; index++) {
            cadenaOriginal.push(this.mapeocaracteres(datos[index].letra));
        }

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
            cadenaOriginal: cadenaOriginal,
            solucion1: solucion1,
            solucion2: solucion2,
            solucion3: solucion3
        })
    }

    posiciones() {
        const cadenaOriginal = this.state.cadenaOriginal;
        return (
            cadenaOriginal.map(function (item, i) {
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
                return (<td className={arreglo[i] + "tabla"} key={i} colSpan="3"><b>{arreglo[i]}</b></td>)
            }))
    }

    ultimaPosicion(numeroSolucion) {
        let sobrante;
        let totalSolucion;
        let total = this.state.cadenaOriginal.length;
        switch (numeroSolucion) {
            case 1:
                totalSolucion = 3 * this.state.solucion1.length;
                sobrante = total - totalSolucion;
                break;
            case 2:
                totalSolucion = 3 * this.state.solucion2.length;
                sobrante = total - totalSolucion + 1;
                break;
            default:
                totalSolucion = 3 * this.state.solucion3.length;
                sobrante = total - totalSolucion + 2;
                break;
        }
        if (sobrante !== 0) {
            return <td colSpan={sobrante}></td>
        }
    }

    original() {
        let cadenaOriginal = this.state.cadenaOriginal;
        let clase;
        return (
            cadenaOriginal.map(function (item, i) {
                if (item === "-") {
                    clase = "gap";
                }
                if (item === "U") {
                    item = "T";
                    clase = "T";
                }
                else {
                    clase = item;
                }
                return (<td className={clase} key={i}><b>{item}</b></td>)
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

    download() {
        let element = document.createElement('a');
        const solucion1 = this.state.solucion1;
        const solucion2 = this.state.solucion2;
        const solucion3 = this.state.solucion3;

        let texto = ">First Solution\n";

        for (let index = 0; index < solucion1.length; index++) {
            if(index % 60 === 0 && index !== 0){
                texto += "\n";
            }
            texto += solucion1[index];
        }

        texto += "\n>Second Solution\n";

        for (let index = 0; index < solucion2.length; index++) {
            if(index % 60 === 0 && index !== 0){
                texto += "\n";
            }
            texto += solucion2[index];
        }

        texto += "\n>Third Solution\n";

        for (let index = 0; index < solucion3.length; index++) {
            if(index % 60 === 0 && index !== 0){
                texto += "\n";
            }
            texto += solucion3[index];
        }

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texto));
        element.setAttribute('download', "hello.txt");
        element.click();
    }

    render() {
        return (
            <div className="cuerpo quintaGraficaMargen">
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className="table-responsive">
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
                                            {this.ultimaPosicion(1)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>2</b></td>
                                            <td></td>
                                            {this.valores(2)}
                                            {this.ultimaPosicion(2)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>3</b></td>
                                            <td colSpan="2"></td>
                                            {this.valores(3)}
                                            {this.ultimaPosicion(3)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>Nucleotides</b></td>
                                            {this.original()}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <button className="btn btn-primary" type="submit" onClick={this.download}>Download Table</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppFifthGraph;
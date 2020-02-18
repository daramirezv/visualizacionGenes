import React, { Component } from "react";
import * as d3 from "d3";
import './App.css';
import cancer from './cancer.txt';
import * as c3 from "c3";
import 'c3/c3.css';
const uuidv4 = require('uuid/v4');

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { mesActual: "", objetosSitios: [] };
        // this.onMouseOver = this.onMouseOver.bind(this);
    }



    componentDidMount() {
        //Arreglo donde se va a guardar el arreglo que usa D3 para la primera grafica
        var resultadofinal = [];

        //Función que calcula la entropia de shannon para la posición "x" de los genes.
        //Usa la libreria uuidv4 para asegurarse que cada "-" se tome como diferente.
        let promedioMayor = (array) => {
            if (array.length === 0)
                return null;

            let modeMap = {};

            for (let i = 0; i < array.length; i++) {
                let el = array[i];
                if (el === "-") {
                    modeMap[uuidv4()] = 1;
                }
                else if (modeMap[el] == null) {
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

        //Método que lee el archivo
        d3.text(cancer).then(data => {

            //Esto se usa para partir la informacion inicial en 3 arreglos
            let arreglosIniciales = data.split(">");
            let respuesta = [];

            for (let index = 0; index < arreglosIniciales.length; index++) {
                if (index === 0) {
                    continue;
                }
                let myString = arreglosIniciales[index];
                myString = myString.substring(myString.indexOf('\n') + 1);
                respuesta.push(myString);
            }


            let posPromedio = 0;
            let valPromedio = 0;

            //El metodo que va a creando cada objeto de llave valor con la posicion y la entropia
            for (let index = 0; index < respuesta[2].length; index++) {
                let correccionSalto = 0;
                let componentes = []

                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    correccionSalto++;
                    continue;
                }

                valPromedio += promedioMayor(componentes);

                if (posPromedio >= 9 || index + 1 == respuesta[2].length) {
                    let objetoTemp = new myObject(index - correccionSalto, valPromedio / (posPromedio + 1));
                    resultadofinal.push(objetoTemp);
                    valPromedio = 0;
                    posPromedio = 0;
                }
                else {
                    posPromedio++;
                }
            }

            //D3 PRIMER GRAFICO

            // var svg = d3.select("svg"),
            //     margin = { top: 20, right: 20, bottom: 110, left: 40 },
            //     margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            //     width = +svg.attr("width") - margin.left - margin.right,
            //     height = +svg.attr("height") - margin.top - margin.bottom,
            //     height2 = +svg.attr("height") - margin2.top - margin2.bottom;

            // var x = d3.scaleLinear().range([0, width]),
            //     x2 = d3.scaleLinear().range([0, width]),
            //     y = d3.scaleLinear().range([height, 0]),
            //     y2 = d3.scaleLinear().range([height2, 0]);

            // var xAxis = d3.axisBottom(x),
            //     xAxis2 = d3.axisBottom(x2),
            //     yAxis = d3.axisLeft(y);

            // var brush = d3.brushX()
            //     .extent([[0, 0], [width, height2]])
            //     .on("brush end", brushed);

            // var zoom = d3.zoom()
            //     .scaleExtent([1, Infinity])
            //     .translateExtent([[0, 0], [width, height]])
            //     .extent([[0, 0], [width, height]])
            //     .on("zoom", zoomed);

            // var area = d3.area()
            //     .curve(d3.curveMonotoneX)
            //     .x(function (d) { return x(d.posicion); })
            //     .y0(height)
            //     .y1(function (d) { return y(d.porcentaje); });

            // var area2 = d3.area()
            //     .curve(d3.curveMonotoneX)
            //     .x(function (d) { return x2(d.posicion); })
            //     .y0(height2)
            //     .y1(function (d) { return y2(d.porcentaje); });

            // svg.append("defs").append("clipPath")
            //     .attr("id", "clip")
            //     .append("rect")
            //     .attr("width", width)
            //     .attr("height", height);

            // var focus = svg.append("g")
            //     .attr("class", "focus")
            //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // var context = svg.append("g")
            //     .attr("class", "context")
            //     .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


            // x.domain(d3.extent(resultadofinal, function (d) { return d.posicion; }));
            // y.domain([0, d3.max(resultadofinal, function (d) { return d.porcentaje; })]);
            // x2.domain(x.domain());
            // y2.domain(y.domain());

            // focus.append("path")
            //     .datum(resultadofinal)
            //     .attr("class", "area")
            //     .attr("d", area);

            // focus.append("g")
            //     .attr("class", "axis axis--x")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(xAxis);

            // focus.append("g")
            //     .attr("class", "axis axis--y")
            //     .call(yAxis);

            // context.append("path")
            //     .datum(resultadofinal)
            //     .attr("class", "area")
            //     .attr("d", area2);

            // context.append("g")
            //     .attr("class", "axis axis--x")
            //     .attr("transform", "translate(0," + height2 + ")")
            //     .call(xAxis2);

            // context.append("g")
            //     .attr("class", "brush")
            //     .call(brush)
            //     .call(brush.move, x.range());

            // svg.append("rect")
            //     .attr("class", "zoom")
            //     .attr("width", width)
            //     .attr("height", height)
            //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            //     .call(zoom);

            // function brushed() {
            //     if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            //     var s = d3.event.selection || x2.range();
            //     x.domain(s.map(x2.invert, x2));
            //     focus.select(".area").attr("d", area);
            //     focus.select(".axis--x").call(xAxis);
            //     svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            //         .scale(width / (s[1] - s[0]))
            //         .translate(-s[0], 0));
            // }

            // function zoomed() {
            //     if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            //     var t = d3.event.transform;
            //     x.domain(t.rescaleX(x2).domain());
            //     focus.select(".area").attr("d", area);
            //     focus.select(".axis--x").call(xAxis);
            //     context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
            // }
        })
    }


    render() {
        return (
            <div className="App">
                <svg width="960" height="500"></svg>
                <div id="chart"></div>;
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
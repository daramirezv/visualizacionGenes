import React, { Component } from "react";
import * as d3 from "d3";
import './AppC3.css';
import cancer from './cars.csv';
import gen from './cancer.txt';
const uuidv4 = require('uuid/v4');

class AppC3 extends Component {

    constructor(props) {
        super(props);
        this.state = { mesActual: "", objetosSitios: [] };
        // this.onMouseOver = this.onMouseOver.bind(this);
    }

    componentDidMount() {

        var resultadofinal = [];

        d3.text(gen).then(data => {
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


            for (let index = 0; index < respuesta[respuesta.length - 1].length; index++) {
                let componentes = [];

                for (let indexInterno = 0; indexInterno < respuesta.length; indexInterno++) {
                    componentes.push(respuesta[indexInterno].charAt(index));
                }

                if (componentes.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    continue;
                }

                let objetoTemp = "{ \"posicion\":" + (index + 1) + "";

                for (let pos = 0; pos < componentes.length; pos++) {

                    objetoTemp += ", \"" + nombres[pos] + "\":\"" + respuesta[pos][index] + "\"";
                }

                objetoTemp += "}";
                let res = JSON.parse(objetoTemp)
                resultadofinal.push(res);
            }

            console.log(resultadofinal);
            var svg = d3.select("svg"),
                margin = { top: 20, right: 20, bottom: 110, left: 40 },
                margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                height2 = +svg.attr("height") - margin2.top - margin2.bottom;

            var x = d3.scaleLinear().range([0, width]),
                x2 = d3.scaleLinear().range([0, width]),
                y = d3.scaleBand().range([height, 0]),
                y2 = d3.scaleBand().range([height2, 0]),
                color = d3.scaleOrdinal().range(d3.schemeCategory10);

            var xAxis = d3.axisBottom(x),
                xAxis2 = d3.axisBottom(x2),
                yAxis = d3.axisLeft(y);

            var brush = d3.brushX()
                .extent([[0, 0], [width, height2]])
                .on("brush end", brushed);

            var zoom = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            var line = d3.line()
                .curve(d3.curveLinear)
                .x(function (d) { return x(d["posicion"]); })
                .y(function (d) { return y(d["nucleotido"]); });

            var line2 = d3.line()
                .curve(d3.curveLinear)
                .x(function (d) { return x2(d["posicion"]); })
                .y(function (d) { return y2(d["nucleotido"]); });

            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);

            var Line_chart = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + (2.81*margin.top) + ")")
                .attr("clip-path", "url(#clip)");

            var focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var context = svg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            var concentrations = nombres.map(function (category2) {
                return {
                    category: category2,
                    datapoints: resultadofinal.map(function (d) {
                        return { posicion: d.posicion, nucleotido: d[category2] };
                    })
                };
            });

            x.domain(d3.extent(resultadofinal, function (d) { return d.posicion; }));
            y.domain(["-", "G", "T", "C", "A"]);
            x2.domain(x.domain());
            y2.domain(y.domain());
            color.domain(nombres);

            focus.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            var Line_chartGroup = Line_chart.selectAll("g")
                .data(concentrations)
                .enter()
                .append("g");

            Line_chartGroup.append("path")
                .attr("class", "line")
                .attr("d", function (d) { return line(d.datapoints); })
                .style("stroke", function (d) { return color(d.category); })

            var ContextGroup = context.selectAll("g")
                .data(concentrations)
                .enter()
                .append("g");

            ContextGroup.append("path")
                .attr("class", "line")
                .attr("d", function (d) { return line2(d.datapoints); })
                .style("stroke", function (d) { return color(d.category); })

            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

            svg.append("rect")
                .attr("class", "zoom")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom);

            function brushed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
                var s = d3.event.selection || x2.range();
                x.domain(s.map(x2.invert, x2));
                Line_chart.selectAll(".line").attr("d", function (d) { return line(d.datapoints) });
                focus.select(".axis--x").call(xAxis);
                svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(width / (s[1] - s[0]))
                    .translate(-s[0], 0));
            }

            function zoomed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
                var t = d3.event.transform;
                x.domain(t.rescaleX(x2).domain());
                Line_chart.selectAll(".line").attr("d", function (d) { return line(d.datapoints) });
                focus.select(".axis--x").call(xAxis);
                context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
            }
        })
    }

    render() {
        return (
            <div className="App">
                <svg width="960" height="500"></svg>
            </div>
        );
    }
}

export default AppC3;
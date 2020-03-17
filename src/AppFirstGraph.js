import React, { Component } from "react";
import * as d3 from "d3";
import './AppFirstGraph.css';

class AppFirstGraph extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        let resultadofinal = this.props.datosPrimerGrafica;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;

        resultadofinal = resultadofinal.filter(function (element) {
            return element.posicion >= (primerValor - 1) && element.posicion <= (segundoValor);
        });


        let svg = d3.select("#svg1"),
            margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        let xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        let brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", brushed);

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x(d.posicion); })
            .y0(height)
            .y1(function (d) { return y(d.porcentaje); });

        let area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x2(d.posicion); })
            .y0(height2)
            .y1(function (d) { return y2(d.porcentaje); });

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        x.domain(d3.extent(resultadofinal, function (d) { return d.posicion; }));
        y.domain([0, d3.max(resultadofinal, function (d) { return d.porcentaje; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", area);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5)
                .attr("y", -margin.top)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Entropy"));

        context.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", area2);

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
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }
    }

    componentDidUpdate() {

        d3.selectAll("#svg1 > *").remove();

        let resultadofinal = this.props.datosPrimerGrafica;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;

        resultadofinal = resultadofinal.filter(function (element) {
            return element.posicion >= (primerValor - 1) && element.posicion <= (segundoValor);
        });

        let svg = d3.select("#svg1"),
            margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        let xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        let brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", brushed);

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x(d.posicion); })
            .y0(height)
            .y1(function (d) { return y(d.porcentaje); });

        let area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x2(d.posicion); })
            .y0(height2)
            .y1(function (d) { return y2(d.porcentaje); });

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        x.domain(d3.extent(resultadofinal, function (d) { return d.posicion; }));
        y.domain([0, d3.max(resultadofinal, function (d) { return d.porcentaje; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", area);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5)
                .attr("y", -margin.top)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Entropy"));

        context.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", area2);

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
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }
    }

    render() {
        return (
            <div className="App centrar primeraGraficaMargen">
                <svg id="svg1" width="1200" height="500"></svg>
            </div>
        );
    }
}

export default AppFirstGraph;
import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './AppSecondGraph.css';

class AppSecondGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { filtro: "All Genes", informacion2: "Hola2" };
        this.mapeoLetras = this.mapeoLetras.bind(this);
    }

    componentDidMount() {

        const esProteina = this.props.esProteina;
        let funcionMapeoLetras = this.mapeoLetras;
        let nombreNucleotidos = [];

        if (esProteina) {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajer", "porcentajen", "porcentajed", "porcentajeb",
                "porcentajee", "porcentajeq", "porcentajez", "porcentajeh", "porcentajei", "porcentajel", "porcentajek", "porcentajem", "porcentajef",
                "porcentajep", "porcentajes", "porcentajew", "porcentajey", "porcentajev", "porcentajemenos"];
        } else {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajemenos"];
        }

        let data = this.props.datosGraficaPruebas;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;
        data = data.slice(primerValor - 1, segundoValor);

        let series = d3.stack()
            .keys(nombreNucleotidos)
            .offset(d3.stackOffsetDiverging)(data);

        let svg = d3.select("#svg2");

        let margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]),
            xBand = d3.scaleBand().range([0, width])

        let color;

        if (esProteina) {
            color = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#B5CF61", "#FFAA52", "#FF82DB", "#A89E81",
                "#696C71", "#9AFF1C", "#B88BB3", "#45B8AC", "#52703F", "#D7B7AA", "#7D303D", "#E25A06", "#3B4B87",
                "#7B5EC6", "#CFB023", "#99D6EA", "#C800A1", "#212322", "#AA6B24"]);
        } else {
            color = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#AA6B24"]);
        }

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

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        let Line_chart = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
            .attr("clip-path", "url(#clip)");

        x.domain(d3.extent(data, function (d) { return d.posicion; }));
        y.domain([d3.min(series, stackMin), d3.max(series, stackMax)])
        x2.domain(x.domain());
        y2.domain(y.domain());
        xBand.domain(d3.range(x.domain()[0], x.domain()[1]));

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
                .attr("y", -8)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Percentage"));

        Line_chart.selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", (d, i) => color(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr('x', function (d) { return x(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return y(d[1]); })
            .attr("width", xBand.bandwidth() * 0.9)
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })

        context.selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", (d, i) => color(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr('x', function (d) { return x2(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return y2(d[1]); })
            .attr("width", xBand.bandwidth() * 0.9)
            .attr("height", function (d) { return y2(d[0]) - y2(d[1]); })

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

        let svgLegend = d3.select("#legend2");

        svgLegend.attr("height", 150 + margin.top);

        if (esProteina) {
            svgLegend.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return margin.left + 15 + i * 50 })
                .attr("y", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegend.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return margin.left + i * 50 })
                .attr("cy", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => color(i))
        }
        else {
            svgLegend.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return margin.left + 415 + i * 75 })
                .attr("y", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegend.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return margin.left + 400 + i * 75 })
                .attr("cy", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => color(i))
        }

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            Line_chart.selectAll("rect")
                .attr('x', function (d) { return x(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            xBand.domain(d3.range(x.domain()[0], x.domain()[1]));
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            Line_chart.selectAll("rect")
                .attr('x', function (d) { return x(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
                .attr("width", xBand.bandwidth() * 0.9)
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        function stackMin(serie) {
            return d3.min(serie, function (d) { return d[0]; });
        }

        function stackMax(serie) {
            return d3.max(serie, function (d) { return d[1]; });
        }
    }

    componentDidUpdate() {

        d3.selectAll("#svg2 > *").remove();
        d3.selectAll("#legend2 > *").remove();

        const esProteina = this.props.esProteina;
        let funcionMapeoLetras = this.mapeoLetras;
        let nombreNucleotidos = [];

        if (esProteina) {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajer", "porcentajen", "porcentajed", "porcentajeb",
                "porcentajee", "porcentajeq", "porcentajez", "porcentajeh", "porcentajei", "porcentajel", "porcentajek", "porcentajem", "porcentajef",
                "porcentajep", "porcentajes", "porcentajew", "porcentajey", "porcentajev", "porcentajemenos"];
        } else {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajemenos"];
        }

        let data = this.props.datosGraficaPruebas;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;
        data = data.slice(primerValor - 1, segundoValor);

        let series = d3.stack()
            .keys(nombreNucleotidos)
            .offset(d3.stackOffsetDiverging)(data);

        let svg = d3.select("#svg2");

        let margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]),
            xBand = d3.scaleBand().range([0, width]);

        let color;

        if (esProteina) {
            color = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#B5CF61", "#FFAA52", "#FF82DB", "#A89E81",
                "#696C71", "#9AFF1C", "#B88BB3", "#45B8AC", "#52703F", "#D7B7AA", "#7D303D", "#E25A06", "#3B4B87",
                "#7B5EC6", "#CFB023", "#99D6EA", "#C800A1", "#212322", "#AA6B24"]);
        } else {
            color = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#AA6B24"]);
        }

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

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        let Line_chart = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
            .attr("clip-path", "url(#clip)");

        x.domain(d3.extent(data, function (d) { return d.posicion; }));
        y.domain([d3.min(series, stackMin), d3.max(series, stackMax)])
        x2.domain(x.domain());
        y2.domain(y.domain());
        xBand.domain(d3.range(x.domain()[0], x.domain()[1]));

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
                .attr("y", -8)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Percentage"));

        Line_chart.selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", (d, i) => color(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr('x', function (d) { return x(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return y(d[1]); })
            .attr("width", xBand.bandwidth() * 0.9)
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })

        context.selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", (d, i) => color(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr('x', function (d) { return x2(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return y2(d[1]); })
            .attr("width", xBand.bandwidth() * 0.9)
            .attr("height", function (d) { return y2(d[0]) - y2(d[1]); })

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

        let svgLegend = d3.select("#legend2");

        svgLegend.attr("height", 150 + margin.top);

        if (esProteina) {
            svgLegend.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return margin.left + 15 + i * 50 })
                .attr("y", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegend.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return margin.left + i * 50 })
                .attr("cy", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => color(i))
        }
        else {
            svgLegend.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return margin.left + 415 + i * 75 })
                .attr("y", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegend.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return margin.left + 400 + i * 75 })
                .attr("cy", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => color(i))
        }

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            Line_chart.selectAll("rect")
                .attr('x', function (d) { return x(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            xBand.domain(d3.range(x.domain()[0], x.domain()[1]));
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            Line_chart.selectAll("rect")
                .attr('x', function (d) { return x(d.data.posicion) - xBand.bandwidth() * 0.9 / 2 })
                .attr("width", xBand.bandwidth() * 0.9)
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        function stackMin(serie) {
            return d3.min(serie, function (d) { return d[0]; });
        }

        function stackMax(serie) {
            return d3.max(serie, function (d) { return d[1]; });
        }
    }

    mapeoLetras(d) {
        switch (d) {
            case "porcentajea":
                return "A";
            case "porcentajeg":
                return "G";
            case "porcentajec":
                return "C";
            case "porcentajet":
                return "T";
            case "porcentajer":
                return "R";
            case "porcentajen":
                return "N";
            case "porcentajed":
                return "D";
            case "porcentajeb":
                return "B";
            case "porcentajee":
                return "E";
            case "porcentajeq":
                return "Q";
            case "porcentajez":
                return "Z";
            case "porcentajeh":
                return "H";
            case "porcentajei":
                return "I";
            case "porcentajel":
                return "L";
            case "porcentajek":
                return "K";
            case "porcentajem":
                return "M";
            case "porcentajef":
                return "F";
            case "porcentajep":
                return "P";
            case "porcentajes":
                return "S";
            case "porcentajew":
                return "W";
            case "porcentajey":
                return "Y";
            case "porcentajev":
                return "V";
            default:
                return "Gap";
        }
    }

    render() {
        return (
            <div className="App centrar segundaGraficaMargen">
                <h1>Profile Weight Matrix <Tooltip placement="right" trigger="click" tooltip={this.state.informacion2}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                <svg id="svg2" className="segundaGraficaBlock" width="1200" height="500"></svg>
                <svg id="legend2" className="segundaGraficaBlock" width="1200"></svg>
            </div>
        );
    }
}

export default AppSecondGraph;
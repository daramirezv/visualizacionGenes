import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './AppThirdGraph.css';

class AppThirdGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { primerFiltro: "", segundoFiltro: "", informacion3: "The graph compares the values of two sequences." };
        this.primerFiltroTerceraGrafica = this.primerFiltroTerceraGrafica.bind(this);
        this.segundoFiltroTerceraGrafica = this.segundoFiltroTerceraGrafica.bind(this);
        this.selecciones = this.selecciones.bind(this);
        this.primerselectref = React.createRef();
        this.segundoselectref = React.createRef();
    }

    componentDidMount() {
        const nombreTodosGenes = this.props.nombresGenes;
        let nombresGenes = [];
        nombresGenes.push(nombreTodosGenes[0]);
        nombresGenes.push(nombreTodosGenes[1]);
        const primerSelect = this.primerselectref.current;
        primerSelect.selectedIndex = 0;
        const segundoSelect = this.segundoselectref.current;
        segundoSelect.selectedIndex = 1;
        let datosTerceraGrafica = this.props.datosTerceraGrafica;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;
        datosTerceraGrafica = datosTerceraGrafica.slice(primerValor - 1, segundoValor);
        const esProteina = this.props.esProteina;

        let svg = d3.select("#svg3");

        let margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleBand().range([height, 0]),
            y2 = d3.scaleBand().range([height2, 0]),
            color = d3.scaleOrdinal().range(d3.schemeCategory10);

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

        let line = d3.line()
            .curve(d3.curveLinear)
            .x(function (d) { return x(d["posicion"]); })
            .y(function (d) { return y(d["nucleotido"]); });

        let line2 = d3.line()
            .curve(d3.curveLinear)
            .x(function (d) { return x2(d["posicion"]); })
            .y(function (d) { return y2(d["nucleotido"]); });

        svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        let Line_chart;

        if (!esProteina) {
            Line_chart = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + (2.81 * margin.top) + ")")
                .attr("clip-path", "url(#clip)");
        } else {
            Line_chart = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + (1.4 * margin.top) + ")")
                .attr("clip-path", "url(#clip)");
        }

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        let concentrations = nombresGenes.map(function (category2) {
            return {
                category: category2,
                datapoints: datosTerceraGrafica.map(function (d) {
                    return { posicion: d.posicion, nucleotido: d[category2.replace(/[\r\n]+/gm, "")] };
                })
            };
        });

        x.domain(d3.extent(datosTerceraGrafica, function (d) { return d.posicion; }));
        if (!esProteina) {
            y.domain(["-", "G", "T", "C", "A"]);
        }
        else {
            y.domain(["-", "G", "T", "C", "A", "R", "N", "D", "B", "E", "Q", "Z", "H", "I", "L", "K", "M", "F", "P", "S", "W", "Y", "V"]);
        }

        x2.domain(x.domain());
        y2.domain(y.domain());
        color.domain(nombresGenes);

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
                .text("Nucleotide"));

        let Line_chartGroup = Line_chart.selectAll("g")
            .data(concentrations)
            .enter()
            .append("g");

        Line_chartGroup.append("path")
            .attr("class", "line")
            .attr("d", function (d) { return line(d.datapoints); })
            .style("stroke", function (d) { return color(d.category); })

        let ContextGroup = context.selectAll("g")
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
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            Line_chart.selectAll(".line").attr("d", function (d) { return line(d.datapoints) });
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            Line_chart.selectAll(".line").attr("d", function (d) { return line(d.datapoints) });
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        let svgLegend = d3.select("#legend3");

        svgLegend.attr("height", nombresGenes.length * 30 + margin.top);

        svgLegend.selectAll("mydots")
            .data(nombresGenes)
            .enter()
            .append("circle")
            .attr("cx", margin.left)
            .attr("cy", function (d, i) { return margin.top + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function (d) { return color(d) })

        svgLegend.selectAll("mylabels")
            .data(nombresGenes)
            .enter()
            .append("text")
            .attr("x", margin.left + 20)
            .attr("y", function (d, i) { return margin.top + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "15px")
    }

    componentDidUpdate() {

        let nombresGenes = [];
        const valorPrimerSelect = this.primerselectref.current.value;
        const valorSegundoSelect = this.segundoselectref.current.value;
        const esProteina = this.props.esProteina;

        nombresGenes.push(valorPrimerSelect);

        if (valorSegundoSelect !== valorPrimerSelect) {
            nombresGenes.push(valorSegundoSelect);
        }

        let datosTerceraGrafica = this.props.datosTerceraGrafica;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;
        datosTerceraGrafica = datosTerceraGrafica.slice(primerValor - 1, segundoValor);

        d3.selectAll("#svg3 > *").remove();
        d3.selectAll("#legend3 > *").remove();

        let svg = d3.select("#svg3"),
            margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleBand().range([height, 0]),
            y2 = d3.scaleBand().range([height2, 0]),
            color = d3.scaleOrdinal().range(d3.schemeCategory10);

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

        let line = d3.line()
            .curve(d3.curveLinear)
            .x(function (d) { return x(d["posicion"]); })
            .y(function (d) { return y(d["nucleotido"]); });

        let line2 = d3.line()
            .curve(d3.curveLinear)
            .x(function (d) { return x2(d["posicion"]); })
            .y(function (d) { return y2(d["nucleotido"]); });

        svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        let Line_chart;
        if (!esProteina) {
            Line_chart = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + (2.81 * margin.top) + ")")
                .attr("clip-path", "url(#clip)");
        } else {
            Line_chart = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + (1.4 * margin.top) + ")")
                .attr("clip-path", "url(#clip)");
        }

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        let concentrations = nombresGenes.map(function (category2) {
            return {
                category: category2,
                datapoints: datosTerceraGrafica.map(function (d) {
                    return { posicion: d.posicion, nucleotido: d[category2.replace(/[\r\n]+/gm, "")] };
                })
            };
        });

        x.domain(d3.extent(datosTerceraGrafica, function (d) { return d.posicion; }));
        if (!esProteina) {
            y.domain(["-", "G", "T", "C", "A"]);
        }
        else {
            y.domain(["-", "G", "T", "C", "A", "R", "N", "D", "B", "E", "Q", "Z", "H", "I", "L", "K", "M", "F", "P", "S", "W", "Y", "V"]);
        }
        x2.domain(x.domain());
        y2.domain(y.domain());
        color.domain(nombresGenes);

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
                .text("Nucleotide"));

        let Line_chartGroup = Line_chart.selectAll("g")
            .data(concentrations)
            .enter()
            .append("g");

        Line_chartGroup.append("path")
            .attr("class", "line")
            .attr("d", function (d) { return line(d.datapoints); })
            .style("stroke", function (d) { return color(d.category); })

        let ContextGroup = context.selectAll("g")
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
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            Line_chart.selectAll(".line").attr("d", function (d) { return line(d.datapoints) });
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            Line_chart.selectAll(".line").attr("d", function (d) { return line(d.datapoints) });
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        let svgLegend = d3.select("#legend3");

        svgLegend.attr("height", nombresGenes.length * 30 + margin.top);

        svgLegend.selectAll("mydots")
            .data(nombresGenes)
            .enter()
            .append("circle")
            .attr("cx", margin.left)
            .attr("cy", function (d, i) { return margin.top + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function (d) { return color(d) })

        svgLegend.selectAll("mylabels")
            .data(nombresGenes)
            .enter()
            .append("text")
            .attr("x", margin.left + 20)
            .attr("y", function (d, i) { return margin.top + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "15px")
    }

    primerFiltroTerceraGrafica(event) {
        this.setState({
            primerFiltro: event.target.value
        });
    }

    segundoFiltroTerceraGrafica(event) {
        this.setState({
            segundoFiltro: event.target.value
        });
    }

    selecciones() {
        let nombres = this.props.nombresGenes;
        return (
            nombres.map(function (item, i) {
                return <option value={item} key={i}>{item}</option>
            }))
    }

    render() {
        return (
            <div className="App centrar terceraGraficaMargen">
                <h1>Sequence Comparison <Tooltip placement="right" trigger="click" tooltip={this.state.informacion3}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                <svg id="svg3" className="terceraGraficaBlock" width="1200" height="500"></svg>
                <svg id="legend3" className="terceraGraficaBlock" width="1200"></svg>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <form>
                                <select width="500" ref={this.primerselectref} className="form-control" onChange={this.primerFiltroTerceraGrafica}>
                                    {this.selecciones()}
                                </select>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <form>
                                <select width="500" ref={this.segundoselectref} className="form-control" onChange={this.segundoFiltroTerceraGrafica}>
                                    {this.selecciones()}
                                </select>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppThirdGraph;
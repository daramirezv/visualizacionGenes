import React, { Component } from "react";
import * as d3 from "d3";
import './AppThirdGraph.css';

class AppThirdGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { primerFiltro: "", segundoFiltro: "" };
        this.primerFiltroSegundaGrafica = this.primerFiltroSegundaGrafica.bind(this);
        this.segundoFiltroSegundaGrafica = this.segundoFiltroSegundaGrafica.bind(this);
        this.selecciones = this.selecciones.bind(this);
        this.primerselectref = React.createRef();
        this.segundoselectref = React.createRef();
    }
    componentDidMount() {

        var nombreTodosGenes = this.props.nombresGenes;

        let nombresGenes = []
        nombresGenes.push(nombreTodosGenes[0]);
        nombresGenes.push(nombreTodosGenes[1]);
        var primerSelect = this.primerselectref.current;
        primerSelect.selectedIndex = 0;
        var segundoSelect = this.segundoselectref.current;
        segundoSelect.selectedIndex = 1;

        var datosSegundaGrafica = this.props.datosSegundaGrafica;
        var segundoValor = this.props.segundoValor;
        var primerValor = this.props.primerValor;
        datosSegundaGrafica = datosSegundaGrafica.slice(primerValor - 1, segundoValor);

        var svg = d3.select("svg");

        var margin = { top: 20, right: 20, bottom: 110, left: 40 },
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
            .attr("transform", "translate(" + margin.left + "," + (2.81 * margin.top) + ")")
            .attr("clip-path", "url(#clip)");

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        var concentrations = nombresGenes.map(function (category2) {
            return {
                category: category2,
                datapoints: datosSegundaGrafica.map(function (d) {
                    return { posicion: d.posicion, nucleotido: d[category2.replace(/[\r\n]+/gm, "")] };
                })
            };
        });

        x.domain(d3.extent(datosSegundaGrafica, function (d) { return d.posicion; }));
        y.domain(["-", "G", "T", "C", "A"]);
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

        var svgLegend = d3.select("#legend");

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

        nombresGenes.push(valorPrimerSelect);
        
        if(valorSegundoSelect !== valorPrimerSelect){
            nombresGenes.push(valorSegundoSelect);
        }

        var datosSegundaGrafica = this.props.datosSegundaGrafica;
        var segundoValor = this.props.segundoValor;
        var primerValor = this.props.primerValor;
        datosSegundaGrafica = datosSegundaGrafica.slice(primerValor - 1, segundoValor);

        d3.selectAll("svg > *").remove();

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
            .attr("transform", "translate(" + margin.left + "," + (2.81 * margin.top) + ")")
            .attr("clip-path", "url(#clip)");

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        var concentrations = nombresGenes.map(function (category2) {
            return {
                category: category2,
                datapoints: datosSegundaGrafica.map(function (d) {
                    return { posicion: d.posicion, nucleotido: d[category2.replace(/[\r\n]+/gm, "")] };
                })
            };
        });

        x.domain(d3.extent(datosSegundaGrafica, function (d) { return d.posicion; }));
        y.domain(["-", "G", "T", "C", "A"]);
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

        var svgLegend = d3.select("#legend");

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

    primerFiltroSegundaGrafica(event) {
        this.setState({
            primerFiltro: event.target.value
        });
    }

    segundoFiltroSegundaGrafica(event) {
        this.setState({
            segundoFiltro: event.target.value
        });
    }

    selecciones() {
        var nombres = this.props.nombresGenes;
        return (
            nombres.map(function (item, i) {
                return <option value={item} key={i}>{item}</option>
            }))
    }

    render() {
        return (
            <div className="App centrar">
                <svg className="segundaGrafica" width="1200" height="500"></svg>
                <svg className="segundaGrafica" width="1200" id="legend"></svg>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <form>
                                <select width="500" ref={this.primerselectref} className="form-control" onChange={this.primerFiltroSegundaGrafica}>
                                    {this.selecciones()}
                                </select>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <form>
                                <select width="500" ref={this.segundoselectref} className="form-control" onChange={this.segundoFiltroSegundaGrafica}>
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
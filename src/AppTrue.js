import React, { Component } from "react";
import * as d3 from "d3";
import './AppTrue.css';

class AppTrue extends Component {

    constructor(props) {
        super(props);
        this.state = { filtro: "All Genes" };
    }

    componentDidMount() {

        var nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajemenos"];
        var data = this.props.datosGraficaPruebas;

        var series = d3.stack()
            .keys(nombreNucleotidos)
            .offset(d3.stackOffsetDiverging)(data);

        var svg = d3.select("svg");

        var margin = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        var x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]),
            color = d3.scaleOrdinal().range(["#d62728", "#2ca02c", "#1f77b4", "#bcbd22", "#8c564b"]),
            xBand = d3.scaleBand().range([0, width])

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

        var clip = svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        var Line_chart = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
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

        var svgLegend = d3.select("#legend");

        svgLegend.attr("height", 150 + margin.top);

        svgLegend.selectAll("mylabels")
            .data(nombreNucleotidos)
            .enter()
            .append("text")
            .attr("x", function (d, i) { return margin.left + 415 + i * 75 })
            .attr("y", margin.top) // 100 is where the first dot appears. 25 is the distance between dots
            .text(function (d) { return mapeoLetras(d) })
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

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || x2.range();
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
            var t = d3.event.transform;
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

        function mapeoLetras(d) {
            switch (d) {
                case "porcentajea":
                    return "A";
                case "porcentajeg":
                    return "G";
                case "porcentajec":
                    return "C";
                case "porcentajet":
                    return "T";
                default:
                    return "Gap";
            }
        }
    }

    render() {
        return (
            <div className="App centrar">
                <svg className="segundaGrafica" width="1200" height="500"></svg>
                <svg className="segundaGrafica" width="1200" id="legend"></svg>
            </div>
        );
    }
}

export default AppTrue;
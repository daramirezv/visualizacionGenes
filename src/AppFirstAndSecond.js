import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './AppFirstAndSecond.css';

class AppFusion extends Component {

    constructor(props) {
        super(props);
        this.state = { filtro: "All Genes", informacion2: "The graph shows the percentage of each different value per position for all selected sequences.", informacion1: "The graph shows the entropy between all selected sequences for each position." };
        this.mapeoLetras = this.mapeoLetras.bind(this);
    }

    componentDidMount() {

        //variables primera grafica
        let resultadofinal = this.props.datosPrimerGrafica;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;

        resultadofinal = resultadofinal.filter(function (element) {
            return element.posicion >= (primerValor - 1) && element.posicion <= (segundoValor);
        });

        //variables segunda grafica
        const esProteina = this.props.esProteina;
        let funcionMapeoLetras = this.mapeoLetras;
        let nombreNucleotidos = [];
        let dataSecond = this.props.datosGraficaDos;
        dataSecond = dataSecond.slice(primerValor - 1, segundoValor);

        if (esProteina) {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajer", "porcentajen", "porcentajed", "porcentajeb",
                "porcentajee", "porcentajeq", "porcentajez", "porcentajeh", "porcentajei", "porcentajel", "porcentajek", "porcentajem", "porcentajef",
                "porcentajep", "porcentajes", "porcentajew", "porcentajey", "porcentajev", "porcentajemenos"];
        } else {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajemenos"];
        }

        //primera grafica
        let svgFirst = d3.select("#svg1")
            // .style("height", "500");

        let marginFirst = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2First = { top: 430, right: 20, bottom: 30, left: 40 },
            widthFirst = +svgFirst.attr("width") - marginFirst.left - marginFirst.right,
            heightFirst = +svgFirst.attr("height") - marginFirst.top - marginFirst.bottom,
            height2First = +svgFirst.attr("height") - margin2First.top - margin2First.bottom;

        let xFirst = d3.scaleLinear().range([0, widthFirst]),
            x2First = d3.scaleLinear().range([0, widthFirst]),
            yFirst = d3.scaleLinear().range([heightFirst, 0]),
            y2First = d3.scaleLinear().range([height2First, 0]);

        let xAxisFirst = d3.axisBottom(xFirst),
            xAxis2First = d3.axisBottom(x2First),
            yAxisFirst = d3.axisLeft(yFirst);

        let areaFirst = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return xFirst(d.posicion); })
            .y0(heightFirst)
            .y1(function (d) { return yFirst(d.porcentaje); });

        let area2First = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x2First(d.posicion); })
            .y0(height2First)
            .y1(function (d) { return y2First(d.porcentaje); });

        svgFirst.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", widthFirst)
            .attr("height", heightFirst);

        let focusFirst = svgFirst.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + marginFirst.left + "," + marginFirst.top + ")");

        let contextFirst = svgFirst.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2First.left + "," + margin2First.top + ")");

        xFirst.domain(d3.extent(resultadofinal, function (d) { return d.posicion; }));
        yFirst.domain([0, d3.max(resultadofinal, function (d) { return d.porcentaje; })]);
        x2First.domain(xFirst.domain());
        y2First.domain(yFirst.domain());

        focusFirst.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", areaFirst);

        focusFirst.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + heightFirst + ")")
            .call(xAxisFirst);

        focusFirst.append("g")
            .attr("class", "axis axis--y")
            .call(yAxisFirst)
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", widthFirst)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5)
                .attr("y", -marginFirst.top)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Entropy"));

        contextFirst.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", area2First);

        contextFirst.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2First + ")")
            .call(xAxis2First);

        //SEGUNDA GRAFICA
        let seriesSecond = d3.stack()
            .keys(nombreNucleotidos)
            .offset(d3.stackOffsetDiverging)(dataSecond);

        let svgSecond = d3.select("#svg2");

        let marginSecond = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2Second = { top: 430, right: 20, bottom: 30, left: 40 },
            widthSecond = +svgSecond.attr("width") - marginSecond.left - marginSecond.right,
            heightSecond = +svgSecond.attr("height") - marginSecond.top - marginSecond.bottom,
            height2Second = +svgSecond.attr("height") - margin2Second.top - margin2Second.bottom;

        let xSecond = d3.scaleLinear().range([0, widthSecond]),
            x2Second = d3.scaleLinear().range([0, widthSecond]),
            ySecond = d3.scaleLinear().range([heightSecond, 0]),
            y2Second = d3.scaleLinear().range([height2Second, 0]),
            xBandSecond = d3.scaleBand().range([0, widthSecond])

        let colorSecond;

        if (esProteina) {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#B5CF61", "#FFAA52", "#FF82DB", "#A89E81",
                "#696C71", "#9AFF1C", "#B88BB3", "#45B8AC", "#52703F", "#D7B7AA", "#7D303D", "#E25A06", "#3B4B87",
                "#7B5EC6", "#CFB023", "#99D6EA", "#C800A1", "#212322", "#AA6B24"]);
        } else {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#AA6B24"]);
        }

        let xAxisSecond = d3.axisBottom(xSecond),
            yAxisSecond = d3.axisLeft(ySecond);

        svgSecond.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", widthSecond)
            .attr("height", heightSecond)
            .attr("x", 0)
            .attr("y", 0);

        let Line_chartSecond = svgSecond.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + marginSecond.left + "," + marginSecond.top + ")")
            .attr("clip-path", "url(#clip)");

        let focusSecond = svgSecond.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + marginSecond.left + "," + marginSecond.top + ")");

        xSecond.domain(d3.extent(dataSecond, function (d) { return d.posicion; }));
        ySecond.domain([d3.min(seriesSecond, stackMin), d3.max(seriesSecond, stackMax)])
        x2Second.domain(xSecond.domain());
        y2Second.domain(ySecond.domain());
        xBandSecond.domain(d3.range(xSecond.domain()[0], xSecond.domain()[1]));

        focusSecond.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + heightSecond + ")")
            .call(xAxisSecond);

        focusSecond.append("g")
            .attr("class", "axis axis--y")
            .call(yAxisSecond)
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", widthSecond)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5)
                .attr("y", -8)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Percentage"));

        Line_chartSecond.selectAll("g")
            .data(seriesSecond)
            .join("g")
            .attr("fill", (d, i) => colorSecond(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr('x', function (d) { return xSecond(d.data.posicion) - xBandSecond.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return ySecond(d[1]); })
            .attr("width", xBandSecond.bandwidth() * 0.9)
            .attr("height", function (d) { return ySecond(d[0]) - ySecond(d[1]); })

        let svgLegendSecond = d3.select("#legend2");

        svgLegendSecond.attr("height", 150 + marginSecond.top);

        if (esProteina) {
            svgLegendSecond.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 15 + i * 50 })
                .attr("y", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + i * 50 })
                .attr("cy", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }
        else {
            svgLegendSecond.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 415 + i * 75 })
                .attr("y", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + 400 + i * 75 })
                .attr("cy", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }

        //ZOOM Y BRUSH AMBAS GRAFICAS
        let brush = d3.brushX()
            .extent([[0, 0], [widthSecond, height2Second]])
            .on("brush end", brushed);

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [widthSecond, heightSecond]])
            .extent([[0, 0], [widthSecond, heightSecond]])
            .on("zoom", zoomed)

        contextFirst.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, xFirst.range());

        svgFirst.append("rect")
            .attr("class", "zoom")
            .attr("width", widthFirst)
            .attr("height", heightFirst)
            .attr("transform", "translate(" + marginFirst.left + "," + marginFirst.top + ")")
            .call(zoom);

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            //BRUSH PRIMER GRAFICA
            let s = d3.event.selection || x2First.range();
            xFirst.domain(s.map(x2First.invert, x2First));
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            svgFirst.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(widthFirst / (s[1] - s[0]))
                .translate(-s[0], 0));
            //BRUSH SEGUNDA GRAFICA
            xSecond.domain(s.map(x2Second.invert, x2Second));
            Line_chartSecond.selectAll("rect")
                .attr('x', function (d) { return xSecond(d.data.posicion) - xBandSecond.bandwidth() * 0.9 / 2 })
            focusSecond.select(".axis--x").call(xAxisSecond);
            svgSecond.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(widthSecond / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            //ZOOM PRIMER GRAFICA
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            let t = d3.event.transform;
            xFirst.domain(t.rescaleX(x2First).domain());
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            contextFirst.select(".brush").call(brush.move, xFirst.range().map(t.invertX, t));
            //ZOOM SEGUNDA GRAFICA
            xBandSecond.domain(d3.range(xSecond.domain()[0], xSecond.domain()[1]));
            xSecond.domain(t.rescaleX(x2Second).domain());
            Line_chartSecond.selectAll("rect")
                .attr('x', function (d) { return xSecond(d.data.posicion) - xBandSecond.bandwidth() * 0.9 / 2 })
                .attr("width", xBandSecond.bandwidth() * 0.9)
            focusSecond.select(".axis--x").call(xAxisSecond);
        }

        function stackMin(serie) {
            return d3.min(serie, function (d) { return d[0]; });
        }

        function stackMax(serie) {
            return d3.max(serie, function (d) { return d[1]; });
        }
    }

    componentDidUpdate() {

        d3.selectAll("#svg1 > *").remove();
        d3.selectAll("#svg2 > *").remove();
        d3.selectAll("#legend2 > *").remove();

        //variables primera grafica
        let resultadofinal = this.props.datosPrimerGrafica;
        const segundoValor = this.props.segundoValor;
        const primerValor = this.props.primerValor;

        resultadofinal = resultadofinal.filter(function (element) {
            return element.posicion >= (primerValor - 1) && element.posicion <= (segundoValor);
        });

        //variables segunda grafica
        const esProteina = this.props.esProteina;
        let funcionMapeoLetras = this.mapeoLetras;
        let nombreNucleotidos = [];
        let dataSecond = this.props.datosGraficaDos;
        dataSecond = dataSecond.slice(primerValor - 1, segundoValor);

        if (esProteina) {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajer", "porcentajen", "porcentajed", "porcentajeb",
                "porcentajee", "porcentajeq", "porcentajez", "porcentajeh", "porcentajei", "porcentajel", "porcentajek", "porcentajem", "porcentajef",
                "porcentajep", "porcentajes", "porcentajew", "porcentajey", "porcentajev", "porcentajemenos"];
        } else {
            nombreNucleotidos = ["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajemenos"];
        }

        //Primera grafica
        let svgFirst = d3.select("#svg1"),
            marginFirst = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2First = { top: 430, right: 20, bottom: 30, left: 40 },
            widthFirst = +svgFirst.attr("width") - marginFirst.left - marginFirst.right,
            heightFirst = +svgFirst.attr("height") - marginFirst.top - marginFirst.bottom,
            height2First = +svgFirst.attr("height") - margin2First.top - margin2First.bottom;

        console.log(svgFirst.attr("height"))

        let xFirst = d3.scaleLinear().range([0, widthFirst]),
            x2First = d3.scaleLinear().range([0, widthFirst]),
            yFirst = d3.scaleLinear().range([heightFirst, 0]),
            y2First = d3.scaleLinear().range([height2First, 0]);

        let xAxisFirst = d3.axisBottom(xFirst),
            xAxis2First = d3.axisBottom(x2First),
            yAxisFirst = d3.axisLeft(yFirst);

        let areaFirst = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return xFirst(d.posicion); })
            .y0(heightFirst)
            .y1(function (d) { return yFirst(d.porcentaje); });

        let area2First = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x2First(d.posicion); })
            .y0(height2First)
            .y1(function (d) { return y2First(d.porcentaje); });

        svgFirst.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", widthFirst)
            .attr("height", heightFirst);

        let focusFirst = svgFirst.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + marginFirst.left + "," + marginFirst.top + ")");

        let contextFirst = svgFirst.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2First.left + "," + margin2First.top + ")");

        xFirst.domain(d3.extent(resultadofinal, function (d) { return d.posicion; }));
        yFirst.domain([0, d3.max(resultadofinal, function (d) { return d.porcentaje; })]);
        x2First.domain(xFirst.domain());
        y2First.domain(yFirst.domain());

        focusFirst.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", areaFirst);

        focusFirst.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + heightFirst + ")")
            .call(xAxisFirst);

        focusFirst.append("g")
            .attr("class", "axis axis--y")
            .call(yAxisFirst)
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", widthFirst)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5)
                .attr("y", -marginFirst.top)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Entropy"));

        contextFirst.append("path")
            .datum(resultadofinal)
            .attr("class", "area")
            .attr("d", area2First);

        contextFirst.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2First + ")")
            .call(xAxis2First);

        //SEGUNDA GRAFICA
        let seriesSecond = d3.stack()
            .keys(nombreNucleotidos)
            .offset(d3.stackOffsetDiverging)(dataSecond);

        let svgSecond = d3.select("#svg2");

        let marginSecond = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2Second = { top: 430, right: 20, bottom: 30, left: 40 },
            widthSecond = +svgSecond.attr("width") - marginSecond.left - marginSecond.right,
            heightSecond = +svgSecond.attr("height") - marginSecond.top - marginSecond.bottom,
            height2Second = +svgSecond.attr("height") - margin2Second.top - margin2Second.bottom;

        let xSecond = d3.scaleLinear().range([0, widthSecond]),
            x2Second = d3.scaleLinear().range([0, widthSecond]),
            ySecond = d3.scaleLinear().range([heightSecond, 0]),
            y2Second = d3.scaleLinear().range([height2Second, 0]),
            xBandSecond = d3.scaleBand().range([0, widthSecond])

        let colorSecond;

        if (esProteina) {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#B5CF61", "#FFAA52", "#FF82DB", "#A89E81",
                "#696C71", "#9AFF1C", "#B88BB3", "#45B8AC", "#52703F", "#D7B7AA", "#7D303D", "#E25A06", "#3B4B87",
                "#7B5EC6", "#CFB023", "#99D6EA", "#C800A1", "#212322", "#AA6B24"]);
        } else {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#F6EB61", "#AA6B24"]);
        }

        let xAxisSecond = d3.axisBottom(xSecond),
            yAxisSecond = d3.axisLeft(ySecond);

        svgSecond.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", widthSecond)
            .attr("height", heightSecond)
            .attr("x", 0)
            .attr("y", 0);

        let Line_chartSecond = svgSecond.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + marginSecond.left + "," + marginSecond.top + ")")
            .attr("clip-path", "url(#clip)");

        let focusSecond = svgSecond.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + marginSecond.left + "," + marginSecond.top + ")");

        xSecond.domain(d3.extent(dataSecond, function (d) { return d.posicion; }));
        ySecond.domain([d3.min(seriesSecond, stackMin), d3.max(seriesSecond, stackMax)])
        x2Second.domain(xSecond.domain());
        y2Second.domain(ySecond.domain());
        xBandSecond.domain(d3.range(xSecond.domain()[0], xSecond.domain()[1]));

        focusSecond.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + heightSecond + ")")
            .call(xAxisSecond);

        focusSecond.append("g")
            .attr("class", "axis axis--y")
            .call(yAxisSecond)
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", widthSecond)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5)
                .attr("y", -8)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Percentage"));

        Line_chartSecond.selectAll("g")
            .data(seriesSecond)
            .join("g")
            .attr("fill", (d, i) => colorSecond(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr('x', function (d) { return xSecond(d.data.posicion) - xBandSecond.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return ySecond(d[1]); })
            .attr("width", xBandSecond.bandwidth() * 0.9)
            .attr("height", function (d) { return ySecond(d[0]) - ySecond(d[1]); })

        let svgLegendSecond = d3.select("#legend2");

        svgLegendSecond.attr("height", 150 + marginSecond.top);

        if (esProteina) {
            svgLegendSecond.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 15 + i * 50 })
                .attr("y", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + i * 50 })
                .attr("cy", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }
        else {
            svgLegendSecond.selectAll("mylabels")
                .data(nombreNucleotidos)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 415 + i * 75 })
                .attr("y", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nombreNucleotidos)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + 400 + i * 75 })
                .attr("cy", marginSecond.top) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }

        //ZOOM Y BRUSH AMBAS GRAFICAS
        let brush = d3.brushX()
            .extent([[0, 0], [widthSecond, height2Second]])
            .on("brush end", brushed);

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [widthSecond, heightSecond]])
            .extent([[0, 0], [widthSecond, heightSecond]])
            .on("zoom", zoomed)

        contextFirst.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, xFirst.range());

        svgFirst.append("rect")
            .attr("class", "zoom")
            .attr("width", widthFirst)
            .attr("height", heightFirst)
            .attr("transform", "translate(" + marginFirst.left + "," + marginFirst.top + ")")
            .call(zoom);

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            //BRUSH PRIMER GRAFICA
            let s = d3.event.selection || x2First.range();
            xFirst.domain(s.map(x2First.invert, x2First));
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            svgFirst.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(widthFirst / (s[1] - s[0]))
                .translate(-s[0], 0));
            //BRUSH SEGUNDA GRAFICA
            xSecond.domain(s.map(x2Second.invert, x2Second));
            Line_chartSecond.selectAll("rect")
                .attr('x', function (d) { return xSecond(d.data.posicion) - xBandSecond.bandwidth() * 0.9 / 2 })
            focusSecond.select(".axis--x").call(xAxisSecond);
            svgSecond.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(widthSecond / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            //ZOOM PRIMER GRAFICA
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            let t = d3.event.transform;
            xFirst.domain(t.rescaleX(x2First).domain());
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            contextFirst.select(".brush").call(brush.move, xFirst.range().map(t.invertX, t));
            //ZOOM SEGUNDA GRAFICA
            xBandSecond.domain(d3.range(xSecond.domain()[0], xSecond.domain()[1]));
            xSecond.domain(t.rescaleX(x2Second).domain());
            Line_chartSecond.selectAll("rect")
                .attr('x', function (d) { return xSecond(d.data.posicion) - xBandSecond.bandwidth() * 0.9 / 2 })
                .attr("width", xBandSecond.bandwidth() * 0.9)
            focusSecond.select(".axis--x").call(xAxisSecond);
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
            <div>
                <div className="App centrar primeraGraficaMargen">
                    <h1>Entropy <Tooltip placement="right" trigger="click" tooltip={this.state.informacion1}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                    <svg id="svg1" width="1200" height="500"></svg>
                </div>
                <div className="App centrar segundaGraficaMargen">
                    <h1>Profile Weight Matrix <Tooltip placement="right" trigger="click" tooltip={this.state.informacion2}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                    <svg id="svg2" className="segundaGraficaBlock" width="1200" height="500"></svg>
                    <svg id="legend2" className="segundaGraficaBlock" width="1200"></svg>
                </div>
            </div>
        );
    }
}

export default AppFusion;
import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './EntropyAndProfile.css';

/**
 * This is the class where the entropy and profile weight matrix will be rendered.
 * App.js renders this component
 */
class EntropyAndProfile extends Component {

    constructor(props) {
        super(props);
        /**
         * The state are the variables used by the class.
         * information2 - Informative message of what the profile weight matrix represent.
         * information1 - Informative message of what the shannon graph represent.
         */
        this.state = { information2: "The graph shows the percentage of each different value per position for all selected sequences.", information1: "The graph shows the entropy between all selected sequences for each position." };
        //The binding of "this" to all methods used by the class.
        this.letterMapping = this.letterMapping.bind(this);
    }

    /**
     * Method called when the component finishes loading for the first time.
     */
    componentDidMount() {

        //Variables used by the entropy graph.
        let resultFirstGraph = this.props.dataFirstGraph;
        const valueSecondFilterEntropy = this.props.valueSecondFilterEntropy;
        const valueFirstFilterEntropy = this.props.valueFirstFilterEntropy;
        const valueSecondFilterMatrix = this.props.valueSecondFilterMatrix;
        const valueFirstFilterMatrix = this.props.valueFirstFilterMatrix;

        resultFirstGraph = resultFirstGraph.filter(function (element) {
            return element.position >= (valueFirstFilterEntropy - 1) && element.position <= (valueSecondFilterEntropy);
        });

        //Variables used by the profile weight matrix.
        const isProtein = this.props.isProtein;
        let funcionMapeoLetras = this.letterMapping;
        let nameNucleotide = [];
        let dataSecond = this.props.dataSecondGraph;
        dataSecond = dataSecond.slice(valueFirstFilterMatrix - 1, valueSecondFilterMatrix);

        if (isProtein) {
            nameNucleotide = ["percentagea", "percentagec", "percentageg", "percentaget", "percentager", "percentagen", "percentaged", "percentageb",
                "percentagee", "percentageq", "percentagez", "percentageh", "percentagei", "percentagel", "percentagek", "percentagem", "percentagef",
                "percentagep", "percentages", "percentagew", "percentagey", "percentagev", "percentagedash"];
        } else {
            nameNucleotide = ["percentagea", "percentagec", "percentageg", "percentaget", "percentagedash"];
        }

        //Entropy graph construction
        let svgFirst = d3.select("#svg1");

        let marginFirst = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2First = { top: 330, right: 20, bottom: 30, left: 40 },
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
            .x(function (d) { return xFirst(d.position); })
            .y0(heightFirst)
            .y1(function (d) { return yFirst(d.percentage); });

        let area2First = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x2First(d.position); })
            .y0(height2First)
            .y1(function (d) { return y2First(d.percentage); });

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

        xFirst.domain(d3.extent(resultFirstGraph, function (d) { return d.position; }));
        yFirst.domain([0, d3.max(resultFirstGraph, function (d) { return d.percentage; })]);
        x2First.domain(xFirst.domain());
        y2First.domain(yFirst.domain());

        focusFirst.append("path")
            .datum(resultFirstGraph)
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
                .attr("y", -8)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Entropy"));

        contextFirst.append("path")
            .datum(resultFirstGraph)
            .attr("class", "area")
            .attr("d", area2First);

        contextFirst.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2First + ")")
            .call(xAxis2First);

        //Profile weight matrix graph construction
        let seriesSecond = d3.stack()
            .keys(nameNucleotide)
            .offset(d3.stackOffsetDiverging)(dataSecond);

        let svgSecond = d3.select("#svg2");

        let marginSecond = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2Second = { top: 330, right: 20, bottom: 30, left: 40 },
            widthSecond = +svgSecond.attr("width") - marginSecond.left - marginSecond.right,
            heightSecond = +svgSecond.attr("height") - marginSecond.top - marginSecond.bottom,
            height2Second = +svgSecond.attr("height") - margin2Second.top - margin2Second.bottom;

        let xSecond = d3.scaleLinear().range([0, widthSecond]),
            x2Second = d3.scaleLinear().range([0, widthSecond]),
            ySecond = d3.scaleLinear().range([heightSecond, 0]),
            y2Second = d3.scaleLinear().range([height2Second, 0]),
            xBandSecond = d3.scaleBand().range([0, widthSecond])

        let colorSecond;

        if (isProtein) {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#FCE205", "#B5CF61", "#FFAA52", "#FF82DB", "#A89E81",
                "#696C71", "#9AFF1C", "#B88BB3", "#45B8AC", "#52703F", "#D7B7AA", "#7D303D", "#E25A06", "#3B4B87",
                "#7B5EC6", "#CFB023", "#99D6EA", "#C800A1", "#212322", "#AA6B24"]);
        } else {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#FCE205", "#AA6B24"]);
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

        xSecond.domain(d3.extent(dataSecond, function (d) { return d.position; }));
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
            .attr('x', function (d) { return xSecond(d.data.position) - xBandSecond.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return ySecond(d[1]); })
            .attr("width", xBandSecond.bandwidth() * 0.9)
            .attr("height", function (d) { return ySecond(d[0]) - ySecond(d[1]); })

        //Legend construction

        let svgLegendSecond = d3.select("#legend2");

        svgLegendSecond.attr("height", 150 + marginSecond.top);

        if (isProtein) {
            svgLegendSecond.selectAll("mylabels")
                .data(nameNucleotide)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 15 + i * 50 })
                .attr("y", marginSecond.top)
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nameNucleotide)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + i * 50 })
                .attr("cy", marginSecond.top)
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }
        else {
            svgLegendSecond.selectAll("mylabels")
                .data(nameNucleotide)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 415 + i * 75 })
                .attr("y", marginSecond.top)
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nameNucleotide)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + 400 + i * 75 })
                .attr("cy", marginSecond.top)
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }

        //Zoom and brush for both graphs
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
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
            //First graph
            let s = d3.event.selection || x2First.range();
            xFirst.domain(s.map(x2First.invert, x2First));
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            svgFirst.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(widthFirst / (s[1] - s[0]))
                .translate(-s[0], 0));
            //Second graph
            if (valueSecondFilterEntropy === valueSecondFilterMatrix && valueFirstFilterEntropy === valueFirstFilterMatrix) {
                xSecond.domain(s.map(x2Second.invert, x2Second));
                Line_chartSecond.selectAll("rect")
                    .attr('x', function (d) { return xSecond(d.data.position) - xBandSecond.bandwidth() * 0.9 / 2 })
                focusSecond.select(".axis--x").call(xAxisSecond);
                svgSecond.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(widthSecond / (s[1] - s[0]))
                    .translate(-s[0], 0));
            }
        }

        function zoomed() {
            //First graph
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
            let t = d3.event.transform;
            xFirst.domain(t.rescaleX(x2First).domain());
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            contextFirst.select(".brush").call(brush.move, xFirst.range().map(t.invertX, t));
            //Second Graph
            if (valueSecondFilterEntropy === valueSecondFilterMatrix && valueFirstFilterEntropy === valueFirstFilterMatrix) {
                xBandSecond.domain(d3.range(xSecond.domain()[0], xSecond.domain()[1]));
                xSecond.domain(t.rescaleX(x2Second).domain());
                Line_chartSecond.selectAll("rect")
                    .attr('x', function (d) { return xSecond(d.data.position) - xBandSecond.bandwidth() * 0.9 / 2 })
                    .attr("width", xBandSecond.bandwidth() * 0.9)
                focusSecond.select(".axis--x").call(xAxisSecond);
            }
        }

        function stackMin(serie) {
            return d3.min(serie, function (d) { return d[0]; });
        }

        function stackMax(serie) {
            return d3.max(serie, function (d) { return d[1]; });
        }
    }

    /**
     * This function is called each time a filter in App.js is changed, when it happens, this whole component re-renders.
     */
    componentDidUpdate() {

        d3.selectAll("#svg1 > *").remove();
        d3.selectAll("#svg2 > *").remove();
        d3.selectAll("#legend2 > *").remove();

        //Variables used by the entropy graph.
        let resultFirstGraph = this.props.dataFirstGraph;
        const valueSecondFilterEntropy = this.props.valueSecondFilterEntropy;
        const valueFirstFilterEntropy = this.props.valueFirstFilterEntropy;
        const valueSecondFilterMatrix = this.props.valueSecondFilterMatrix;
        const valueFirstFilterMatrix = this.props.valueFirstFilterMatrix;

        resultFirstGraph = resultFirstGraph.filter(function (element) {
            return element.position >= (valueFirstFilterEntropy - 1) && element.position <= (valueSecondFilterEntropy);
        });

        //Variables used by the profile weight matrix.
        const isProtein = this.props.isProtein;
        let funcionMapeoLetras = this.letterMapping;
        let nameNucleotide = [];
        let dataSecond = this.props.dataSecondGraph;
        dataSecond = dataSecond.slice(valueFirstFilterMatrix - 1, valueSecondFilterMatrix);

        if (isProtein) {
            nameNucleotide = ["percentagea", "percentagec", "percentageg", "percentaget", "percentager", "percentagen", "percentaged", "percentageb",
                "percentagee", "percentageq", "percentagez", "percentageh", "percentagei", "percentagel", "percentagek", "percentagem", "percentagef",
                "percentagep", "percentages", "percentagew", "percentagey", "percentagev", "percentagedash"];
        } else {
            nameNucleotide = ["percentagea", "percentagec", "percentageg", "percentaget", "percentagedash"];
        }

        //Entropy graph construction
        let svgFirst = d3.select("#svg1"),
            marginFirst = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2First = { top: 330, right: 20, bottom: 30, left: 40 },
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
            .x(function (d) { return xFirst(d.position); })
            .y0(heightFirst)
            .y1(function (d) { return yFirst(d.percentage); });

        let area2First = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x2First(d.position); })
            .y0(height2First)
            .y1(function (d) { return y2First(d.percentage); });

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

        xFirst.domain(d3.extent(resultFirstGraph, function (d) { return d.position; }));
        yFirst.domain([0, d3.max(resultFirstGraph, function (d) { return d.percentage; })]);
        x2First.domain(xFirst.domain());
        y2First.domain(yFirst.domain());

        focusFirst.append("path")
            .datum(resultFirstGraph)
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
                .attr("y", -8)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Entropy"));

        contextFirst.append("path")
            .datum(resultFirstGraph)
            .attr("class", "area")
            .attr("d", area2First);

        contextFirst.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2First + ")")
            .call(xAxis2First);

        //Profile weight matrix construction.
        let seriesSecond = d3.stack()
            .keys(nameNucleotide)
            .offset(d3.stackOffsetDiverging)(dataSecond);

        let svgSecond = d3.select("#svg2");

        let marginSecond = { top: 20, right: 20, bottom: 110, left: 40 },
            margin2Second = { top: 330, right: 20, bottom: 30, left: 40 },
            widthSecond = +svgSecond.attr("width") - marginSecond.left - marginSecond.right,
            heightSecond = +svgSecond.attr("height") - marginSecond.top - marginSecond.bottom,
            height2Second = +svgSecond.attr("height") - margin2Second.top - margin2Second.bottom;

        let xSecond = d3.scaleLinear().range([0, widthSecond]),
            x2Second = d3.scaleLinear().range([0, widthSecond]),
            ySecond = d3.scaleLinear().range([heightSecond, 0]),
            y2Second = d3.scaleLinear().range([height2Second, 0]),
            xBandSecond = d3.scaleBand().range([0, widthSecond])

        let colorSecond;

        if (isProtein) {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#FCE205", "#B5CF61", "#FFAA52", "#FF82DB", "#A89E81",
                "#696C71", "#9AFF1C", "#B88BB3", "#45B8AC", "#52703F", "#D7B7AA", "#7D303D", "#E25A06", "#3B4B87",
                "#7B5EC6", "#CFB023", "#99D6EA", "#C800A1", "#212322", "#AA6B24"]);
        } else {
            colorSecond = d3.scaleOrdinal().range(["#D90025", "#3BD23D", "#0082B4", "#FCE205", "#AA6B24"]);
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

        xSecond.domain(d3.extent(dataSecond, function (d) { return d.position; }));
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
            .attr('x', function (d) { return xSecond(d.data.position) - xBandSecond.bandwidth() * 0.9 / 2 })
            .attr("y", function (d) { return ySecond(d[1]); })
            .attr("width", xBandSecond.bandwidth() * 0.9)
            .attr("height", function (d) { return ySecond(d[0]) - ySecond(d[1]); })

        //Legends construction
        let svgLegendSecond = d3.select("#legend2");

        svgLegendSecond.attr("height", 150 + marginSecond.top);

        if (isProtein) {
            svgLegendSecond.selectAll("mylabels")
                .data(nameNucleotide)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 15 + i * 50 })
                .attr("y", marginSecond.top)
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nameNucleotide)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + i * 50 })
                .attr("cy", marginSecond.top)
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }
        else {
            svgLegendSecond.selectAll("mylabels")
                .data(nameNucleotide)
                .enter()
                .append("text")
                .attr("x", function (d, i) { return marginSecond.left + 415 + i * 75 })
                .attr("y", marginSecond.top)
                .text(function (d) { return funcionMapeoLetras(d) })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "15px")

            svgLegendSecond.selectAll("mydots")
                .data(nameNucleotide)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { return marginSecond.left + 400 + i * 75 })
                .attr("cy", marginSecond.top)
                .attr("r", 7)
                .style("fill", (d, i) => colorSecond(i))
        }

        //Zoom and brush for both graphs.
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
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
            //First graph
            let s = d3.event.selection || x2First.range();
            xFirst.domain(s.map(x2First.invert, x2First));
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            svgFirst.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(widthFirst / (s[1] - s[0]))
                .translate(-s[0], 0));
            //Second graph
            if (valueSecondFilterEntropy === valueSecondFilterMatrix && valueFirstFilterEntropy === valueFirstFilterMatrix) {
                xSecond.domain(s.map(x2Second.invert, x2Second));
                Line_chartSecond.selectAll("rect")
                    .attr('x', function (d) { return xSecond(d.data.position) - xBandSecond.bandwidth() * 0.9 / 2 })
                focusSecond.select(".axis--x").call(xAxisSecond);
                svgSecond.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(widthSecond / (s[1] - s[0]))
                    .translate(-s[0], 0));
            }
        }

        function zoomed() {
            //First graph
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
            let t = d3.event.transform;
            xFirst.domain(t.rescaleX(x2First).domain());
            focusFirst.select(".area").attr("d", areaFirst);
            focusFirst.select(".axis--x").call(xAxisFirst);
            contextFirst.select(".brush").call(brush.move, xFirst.range().map(t.invertX, t));
            //Second graph
            if (valueSecondFilterEntropy === valueSecondFilterMatrix && valueFirstFilterEntropy === valueFirstFilterMatrix) {
                xBandSecond.domain(d3.range(xSecond.domain()[0], xSecond.domain()[1]));
                xSecond.domain(t.rescaleX(x2Second).domain());
                Line_chartSecond.selectAll("rect")
                    .attr('x', function (d) { return xSecond(d.data.position) - xBandSecond.bandwidth() * 0.9 / 2 })
                    .attr("width", xBandSecond.bandwidth() * 0.9)
                focusSecond.select(".axis--x").call(xAxisSecond);
            }
        }

        function stackMin(serie) {
            return d3.min(serie, function (d) { return d[0]; });
        }

        function stackMax(serie) {
            return d3.max(serie, function (d) { return d[1]; });
        }
    }

    /**
     * Function used by the legend to write the corresponding letters on the screen.
     * @param d the string to be converted to a letter. 
     */
    letterMapping(d) {
        switch (d) {
            case "percentagea":
                return "A";
            case "percentageg":
                return "G";
            case "percentagec":
                return "C";
            case "percentaget":
                return "T";
            case "percentager":
                return "R";
            case "percentagen":
                return "N";
            case "percentaged":
                return "D";
            case "percentageb":
                return "B";
            case "percentagee":
                return "E";
            case "percentageq":
                return "Q";
            case "percentagez":
                return "Z";
            case "percentageh":
                return "H";
            case "percentagei":
                return "I";
            case "percentagel":
                return "L";
            case "percentagek":
                return "K";
            case "percentagem":
                return "M";
            case "percentagef":
                return "F";
            case "percentagep":
                return "P";
            case "percentages":
                return "S";
            case "percentagew":
                return "W";
            case "percentagey":
                return "Y";
            case "percentagev":
                return "V";
            default:
                return "Gap";
        }
    }

    /**
     * The render function will draw the first two graphs inside the component.
     */
    render() {
        return (
            <div>
                <div className="App center">
                    <h1>Entropy Graph <Tooltip placement="right" trigger="click" tooltip={this.state.information1}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip>- Profile Weight Matrix <Tooltip placement="right" trigger="click" tooltip={this.state.information2}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                    <svg id="svg1" width="1200" height="400"></svg>
                </div>
                <div className="App center secondGraphMargin">
                    <svg id="svg2" className="secondGraphBlock" width="1200" height="400"></svg>
                    <svg id="legend2" className="secondGraphBlock" width="1200"></svg>
                </div>
            </div>
        );
    }
}

export default EntropyAndProfile;
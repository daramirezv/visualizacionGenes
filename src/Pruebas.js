import React, { Component } from "react";
import * as d3 from "d3";
import './Pruebas.css';
import cancer from './cars.csv';

class Pruebas extends Component {

    constructor(props) {
        super(props);
        this.state = { mesActual: "", objetosSitios: [] };
        // this.onMouseOver = this.onMouseOver.bind(this);
    }

    componentDidMount() {

        // d3.csv(cancer).then(d => chart(d))

        // var nombresGenes = this.props.nombresGenes;
        // var datosGraph = this.props.datosGraficaPruebas;

        // function chart(data) {

            let data = []
            let ordinals = []

            for (let i = 0; i < 10000; i++) {
                data.push({
                    value: Math.random() * 10,
                    city: 'test' + i
                })

                ordinals.push('test' + i)
            }

            let margin = {
                top: 50,
                right: 100,
                bottom: 50,
                left: 100
            },
                width = 1000 - margin.left - margin.right,
                height = 700 - margin.top - margin.bottom,
                radius = (Math.min(width, height) / 2) - 10,
                node


            const svg = d3.select('svg')
                .append('svg')
                .attr('width', 960)
                .attr('height', 700)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .call(
                    d3.zoom()
                        .translateExtent([[0, 0], [width, height]])
                        .extent([[0, 0], [width, height]])
                        .on('zoom', zoom)
                )

            // the scale
            let x = d3.scaleLinear().range([0, width])
            let y = d3.scaleLinear().range([height, 0])
            let color = d3.scaleOrdinal(d3.schemeCategory10)
            let xScale = x.domain([-1, ordinals.length])
            let yScale = y.domain([0, d3.max(data, function (d) { return d.value })])
            // for the width of rect
            let xBand = d3.scaleBand().domain(d3.range(-1, ordinals.length)).range([0, width])

            console.log(x.domain()[1])
            console.log(xBand.domain())
            // zoomable rect
            svg.append('rect')
                .attr('class', 'zoom-panel')
                .attr('width', width)
                .attr('height', height)

            // x axis
            let xAxis = svg.append('g')
                .attr('class', 'xAxis')
                .attr('transform', `translate(0, ${height})`)
                .call(
                    d3.axisBottom(xScale).tickFormat((d, e) => {
                        return ordinals[d]
                    })
                )

            // y axis
            let yAxis = svg.append('g')
                .attr('class', 'y axis')
                .call(d3.axisLeft(yScale))

            let bars = svg.append('g')
                .attr('clip-path', 'url(#my-clip-path)')
                .selectAll('.bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function (d, i) {
                    return xScale(i) - xBand.bandwidth() * 0.9 / 2
                })
                .attr('y', function (d, i) {
                    return yScale(d.value)
                })
                .attr('width', xBand.bandwidth() * 0.9)
                .attr('height', function (d) {
                    return height - yScale(d.value)
                })

            let defs = svg.append('defs')

            // use clipPath
            defs.append('clipPath')
                .attr('id', 'my-clip-path')
                .append('rect')
                .attr('width', width)
                .attr('height', height)

            let hideTicksWithoutLabel = function () {
                d3.selectAll('.xAxis .tick text').each(function (d) {
                    if (this.innerHTML === '') {
                        this.parentNode.style.display = 'none'
                    }
                })
            }

            function zoom() {
                if (d3.event.transform.k < 1) {
                    d3.event.transform.k = 1
                    return
                }

                xAxis.call(
                    d3.axisBottom(d3.event.transform.rescaleX(xScale)).tickFormat((d, e, target) => {
                        // has bug when the scale is too big
                        if (Math.floor(d) === d3.format(".1f")(d)) return ordinals[Math.floor(d)]
                        return ordinals[d]
                    })
                )

                hideTicksWithoutLabel()

                // the bars transform
                bars.attr("transform", "translate(" + d3.event.transform.x + ",0)scale(" + d3.event.transform.k + ",1)")
            }
            // var data = [
            //     {month: "Q1-2016", apples: 3840, bananas: 1920, cherries: 1960, dates: 400},
            //     {month: "Q2-2016", apples: 1600, bananas: 1440, cherries: 960, dates: 400},
            //     {month: "Q3-2016", apples:  640, bananas:  960, cherries: 640, dates: 600},
            //     {month: "Q4-2016", apples:  320, bananas:  480, cherries: 640, dates: 400}
            //   ];

            // var data = datosGraph;

            // var series = d3.stack()
            //     // .keys(nombresGenes)
            //     .keys(["porcentajea", "porcentajec", "porcentajeg", "porcentajet", "porcentajemenos"])
            //     .offset(d3.stackOffsetDiverging)
            //     (data);

            // var svg = d3.select("svg"),
            //     margin = { top: 20, right: 30, bottom: 30, left: 60 },
            //     width = +svg.attr("width"),
            //     height = +svg.attr("height");

            // var x = d3.scaleBand()
            //     .domain(data.map(function (d) { return d.posicion; }))
            //     .rangeRound([margin.left, width - margin.right])
            //     .padding(0.1);

            // var y = d3.scaleLinear()
            //     .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
            //     .rangeRound([height - margin.bottom, margin.top]);

            // var z = d3.scaleOrdinal(d3.schemeCategory10);

            // svg.append("g")
            //     .selectAll("g")
            //     .data(series)
            //     .enter().append("g")
            //     .attr("fill", function (d) { return z(d.key); })
            //     .selectAll("rect")
            //     .data(function (d) { return d; })
            //     .enter().append("rect")
            //     .attr("width", x.bandwidth)
            //     .attr("x", function (d) { return x(d.data.posicion); })
            //     .attr("y", function (d) { return y(d[1]); })
            //     .attr("height", function (d) { return y(d[0]) - y(d[1]); })

            // svg.append("g")
            //     .attr("transform", "translate(0," + y(0) + ")")
            //     .call(d3.axisBottom(x));

            // svg.append("g")
            //     .attr("transform", "translate(" + margin.left + ",0)")
            //     .call(d3.axisLeft(y));

            // function stackMin(serie) {
            //     return d3.min(serie, function (d) { return d[0]; });
            // }

            // function stackMax(serie) {
            //     return d3.max(serie, function (d) { return d[1]; });
            // }

        // }
    }


    render() {
        return (
            <div id="my_dataviz">
                <svg width="960" height="500"></svg>
            </div>
        );
    }
}


export default Pruebas;
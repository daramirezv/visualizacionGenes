import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './AppFourthGraph.css';

class AppFourthGraph extends Component {

    constructor(props) {
        super(props);
        this.state = { information4: "The table shows the values of all selected sequences." };
        this.positions = this.positions.bind(this);
        this.characters = this.characters.bind(this);
        this.names = this.names.bind(this);
    }

    componentDidUpdate() {
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 750) {
            d3.selectAll(".tabla-vertical")
                .style("height", "750px")
        }
        else {
            d3.selectAll(".tabla-vertical")
                .style("height", null);
        }
    }

    componentDidMount() {
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 750) {
            d3.selectAll(".tabla-vertical")
                .style("height", "750px");
        }
        else {
            d3.selectAll(".tabla-vertical")
                .style("height", null);
        }
    }

    positions() {
        const valueFirstFilter = this.props.valueFirstFilter;
        const valueSecondFilter = this.props.valueSecondFilter;
        const dataFourthGraph = this.props.dataFourthGraph.slice(valueFirstFilter - 1, valueSecondFilter);
        return (
            dataFourthGraph.map(function (item, i) {
                return <th scope="col" className="stickyhead" key={i}>{i + valueFirstFilter}</th>
            }))
    }

    names(functionCharacters) {
        const names = this.props.namesGenes;
        return (
            names.map(function (item, i) {
                return (
                    <tr key={i}>
                        <td scope="row" className="stickyleft" key={i}>{item}</td>
                        {functionCharacters(item)}
                    </tr>)
            }))
    }

    characters(geneName) {
        const valueFirstFilter = this.props.valueFirstFilter;
        const valueSecondFilter = this.props.valueSecondFilter;
        const dataFourthGraph = this.props.dataFourthGraph.slice(valueFirstFilter - 1, valueSecondFilter);
        let classColor;
        let character;
        return (
            dataFourthGraph.map(function (item, i) {
                character = dataFourthGraph[i][geneName.replace(/[\r\n]+/gm, "")];
                if (character === "-") {
                    classColor = "gap"
                }
                else {
                    classColor = character;
                }
                return <td className={classColor} key={i}><b>{character}</b></td>
            }))
    }

    render() {
        return (
            <div className="cuerpo fourthGraphMargin">
                <h1 className="margintitle4">Sequence Matrix <Tooltip placement="right" trigger="click" tooltip={this.state.information4}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className="table-responsive tabla-vertical">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="stickyhead" scope="col"></th>
                                            {this.positions()}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.names(this.characters)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppFourthGraph;
import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './AppFourthGraph.css';

/**
 * This is the class where sequence matrix table will the rendered.
 * App.js renders this component
 */
class AppFourthGraph extends Component {

    constructor(props) {
        super(props);
        /**
         * The state are the variables used by the class.
         * information4 - Informative message of what this table represent.
         */
        this.state = { information4: "The table shows the values of all selected sequences." };
        //The binding of "this" to all methods used by the class.
        this.positions = this.positions.bind(this);
        this.characters = this.characters.bind(this);
        this.names = this.names.bind(this);
    }

    /**
     * Method called each time a filter in the App component changes. This forces to resize the table.
     */
    componentDidUpdate() {
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 500) {
            d3.selectAll(".tabla-vertical")
                .style("height", "500px")
        }
        else {
            d3.selectAll(".tabla-vertical")
                .style("height", null);
        }
    }

    /**
     * Method called after the render is called for the first time. This forces to resize the table.
     */
    componentDidMount() {
        if (d3.selectAll(".tabla-vertical").node().offsetHeight > 500) {
            d3.selectAll(".tabla-vertical")
                .style("height", "500px");
        }
        else {
            d3.selectAll(".tabla-vertical")
                .style("height", null);
        }
    }

    /**
      * Create the first row of the table, where the positions will be.
      */
    positions() {
        const valueFirstFilter = this.props.valueFirstFilter;
        const valueSecondFilter = this.props.valueSecondFilter;
        const dataFourthGraph = this.props.dataFourthGraph.slice(valueFirstFilter - 1, valueSecondFilter);
        return (
            dataFourthGraph.map(function (item, i) {
                return <th scope="col" className="stickyhead" key={i}>{i + valueFirstFilter}</th>
            }))
    }

    /**
    * Create the first column of the table, where the names will be.
    * Also calls the "characters" function to draw the sections where the letters will be.
    */
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

    /**
     * Function which draws the sections where the letters will be.
     * @param geneName The name of the sequence to know with what row to work with.
     */
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

    /**
     * The render function will draw the sequence matrix inside the component.
     */
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
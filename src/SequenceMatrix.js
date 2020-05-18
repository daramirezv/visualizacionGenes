import React, { Component } from "react";
import Tooltip from './Tooltip';
import * as d3 from "d3";
import './SequenceMatrix.css';

/**
 * This is the class where sequence matrix table will the rendered.
 * App.js renders this component
 */
class SequenceMatrix extends Component {

    constructor(props) {
        super(props);
        /**
         * The state are the variables used by the class.
         * information4 - Informative message of what this table represent.
         * objectWithNames - All the sequences divided into groups by nucleotides or amino acids.
         * positionSelected - The selected position for the modal.
         */
        this.state = { information4: "The table shows the values of all selected sequences.", objectWithNames: [], positionSelected: "" };
        //The binding of "this" to all methods used by the class.
        this.positions = this.positions.bind(this);
        this.characters = this.characters.bind(this);
        this.names = this.names.bind(this);
        this.listOfNames = this.listOfNames.bind(this);
        this.buildModal = this.buildModal.bind(this);
        this.innerBuildModal = this.innerBuildModal.bind(this);
    }

    /**
     * Method called each time a filter in the App component changes. This forces to resize the table.
     */
    componentDidUpdate() {
        d3.selectAll(".tabla-vertical")
            .style("height", null);
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
     * Method called after the render is called for the first time. This forces to resize the table.
     */
    componentDidMount() {
        d3.selectAll(".tabla-vertical")
            .style("height", null);
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
     * Method which stores in the state all the sequences divided into groups by nucleotides or amino acids.
     */
    listOfNames(position) {
        let names = JSON.parse(JSON.stringify(this.props.namesGenes));
        names.forEach(function (part, index) {
            this[index] = this[index].substring(0, this[index].length - 1);
        }, names);
        let objectWithNames = {};
        const originalList = this.props.dataFourthGraph[position];
        let values = Object.values(originalList);
        values.shift();
        values = new Set(values);
        values = [...values];
        let temp;
        values.forEach(elementVal => {
            temp = [];
            names.forEach(elementName => {
                if (originalList[elementName] === elementVal) {
                    temp.push(elementName);
                }
            });
            if (temp.length !== 0) {
                objectWithNames[elementVal] = temp;
            }
        });

        objectWithNames['Gap'] = objectWithNames['-'];
        delete objectWithNames['-'];
        this.setState({
            positionSelected: position + 1,
            objectWithNames: objectWithNames
        })
    }

    /**
      * Create the first row of the table, where the positions will be.
      */
    positions() {
        const func = this.listOfNames;
        const valueFirstFilter = this.props.valueFirstFilter;
        const valueSecondFilter = this.props.valueSecondFilter;
        const dataFourthGraph = this.props.dataFourthGraph.slice(valueFirstFilter - 1, valueSecondFilter);
        return (
            dataFourthGraph.map(function (item, i) {
                return <th data-toggle="modal" onClick={() => func(i)} data-target="#listOfNames" scope="col" className="hoverHandBlue stickyhead" key={i}>{i + valueFirstFilter}</th>
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
     * Function which returns what the modal will have inside.
     * @param func The inner function who is suppose to build each name.
     */
    buildModal(func) {
        const data = this.state.objectWithNames;
        return (
            Object.keys(data).map(function (item, i) {
                if (data[item] != null) {
                    return (
                        <div key={i}>
                            <h1>{item}</h1>
                            {func(data[item])}
                        </div>)
                }
            }))
    }

    /**
     * Function which returns each individual name inside the modal.
     * @param array The array that maps each individual name inside the modal.
     */
    innerBuildModal(array) {
        return (
            array.map(function (item, i) {
                return (
                    <div key={i}>
                        <p>{item}</p>
                        <hr />
                    </div>)
            })
        )
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
                <div className="modal fade" id="listOfNames" tabIndex="-1" role="dialog" aria-labelledby="listOfNames" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="listOfNames">Position Selected - {this.state.positionSelected + this.props.valueFirstFilter - 1}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.buildModal(this.innerBuildModal)}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SequenceMatrix;
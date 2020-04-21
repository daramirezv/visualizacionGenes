import React, { Component } from "react";
import Tooltip from './Tooltip';
import './Translation.css';

/**
 * This is the class where the translation table will be rendered.
 * App.js renders this component
 */
class Translation extends Component {

    constructor(props) {
        super(props);
        /**
         * The state are the variables used by the class.
         * solution1 - Where the first possible translation will be stored.
         * solution2 - Where the second possible translation will be stored.
         * solution3 - Where the third possible translation will be stored.
         * originalString - Where consensus will the stored.
         * information5 - Informative message of what this table represent.
         */
        this.state = { solution1: [], solution2: [], solution3: [], originalString: [], information5: "The table shows the possible translations to amino acids of the loaded genes." };
        //The binding of "this" to all methods used by the class.
        this.positions = this.positions.bind(this);
        this.values = this.values.bind(this);
        this.characterMapping = this.characterMapping.bind(this);
        this.original = this.original.bind(this);
        this.lastPosition = this.lastPosition.bind(this);
        this.download = this.download.bind(this);
    }

    /**
     * Function used after the render function is called for the first time.
     */
    componentDidMount() {
        //The dictionary that will be used to map the nucleotides to amino acids.
        let dictionary = {};
        dictionary["UUU"] = "F";
        dictionary["UUC"] = "F";
        dictionary["UUA"] = "L";
        dictionary["UUG"] = "L";
        dictionary["CUU"] = "L";
        dictionary["CUC"] = "L";
        dictionary["CUA"] = "L";
        dictionary["CUG"] = "L";
        dictionary["AUU"] = "I";
        dictionary["AUC"] = "I";
        dictionary["AUA"] = "I";
        dictionary["AUG"] = "M";
        dictionary["GUU"] = "V";
        dictionary["GUC"] = "V";
        dictionary["GUA"] = "V";
        dictionary["GUG"] = "V";

        dictionary["UCU"] = "S";
        dictionary["UCC"] = "S";
        dictionary["UCA"] = "S";
        dictionary["UCG"] = "S";
        dictionary["CCU"] = "P";
        dictionary["CCC"] = "P";
        dictionary["CCA"] = "P";
        dictionary["CCG"] = "P";
        dictionary["ACU"] = "T";
        dictionary["ACC"] = "T";
        dictionary["ACA"] = "T";
        dictionary["ACG"] = "T";
        dictionary["GCU"] = "A";
        dictionary["GCC"] = "A";
        dictionary["GCA"] = "A";
        dictionary["GCG"] = "A";

        dictionary["UAU"] = "T";
        dictionary["UAC"] = "T";
        dictionary["UAA"] = "stop";
        dictionary["UAG"] = "stop";
        dictionary["CAU"] = "H";
        dictionary["CAC"] = "H";
        dictionary["CAA"] = "Q";
        dictionary["CAG"] = "Q";
        dictionary["AAU"] = "N";
        dictionary["AAC"] = "N";
        dictionary["AAA"] = "K";
        dictionary["AAG"] = "K";
        dictionary["GAU"] = "D";
        dictionary["GAC"] = "D";
        dictionary["GAA"] = "E";
        dictionary["GAG"] = "E";

        dictionary["UGU"] = "C";
        dictionary["UGC"] = "C";
        dictionary["UGA"] = "stop";
        dictionary["UGG"] = "W";
        dictionary["CGU"] = "R";
        dictionary["CGC"] = "R";
        dictionary["CGA"] = "R";
        dictionary["CGG"] = "R";
        dictionary["AGU"] = "S";
        dictionary["AGC"] = "S";
        dictionary["AGA"] = "R";
        dictionary["AGG"] = "R";
        dictionary["GGU"] = "G";
        dictionary["GGC"] = "G";
        dictionary["GGA"] = "G";
        dictionary["GGG"] = "G";

        const data = this.props.dataFifthGraph;
        let codon;
        let translation;
        let originalString = [];
        let solution1 = [];
        let solution2 = [];
        let solution3 = [];
        let value1;
        let value2;
        let value3;

        //Put the nucleodites in the variable "originalString".
        for (let index = 0; index < data.length; index++) {
            originalString.push(this.characterMapping(data[index].letter));
        }

        //Get the first possible translation.
        for (let index = 0; index + 2 < data.length; index += 3) {
            value1 = this.characterMapping(data[index].letter);
            value2 = this.characterMapping(data[index + 1].letter);
            value3 = this.characterMapping(data[index + 2].letter);
            codon = value1 + value2 + value3;
            translation = dictionary[codon];
            solution1.push(translation);
        }

        //Get the second possible translation.
        for (let index = 1; index + 2 < data.length; index += 3) {
            value1 = this.characterMapping(data[index].letter);
            value2 = this.characterMapping(data[index + 1].letter);
            value3 = this.characterMapping(data[index + 2].letter);
            codon = value1 + value2 + value3;
            translation = dictionary[codon];
            solution2.push(translation);
        }

        //Get the third possible translation.
        for (let index = 2; index + 2 < data.length; index += 3) {
            value1 = this.characterMapping(data[index].letter);
            value2 = this.characterMapping(data[index + 1].letter);
            value3 = this.characterMapping(data[index + 2].letter);
            codon = value1 + value2 + value3;
            translation = dictionary[codon];
            solution3.push(translation);
        }

        //Set the class variables with the translations and the consensus.
        this.setState({
            originalString: originalString,
            solution1: solution1,
            solution2: solution2,
            solution3: solution3
        })
    }

    /**
     * Create the first row of the table, where the positions will be.
     */
    positions() {
        const originalString = this.state.originalString;
        return (
            originalString.map(function (item, i) {
                return <th scope="col" className="tableheadleft" key={i}>{i + 1}</th>
            }))
    }

    /**
    * Create the sections inside the table where the letters will be.
    */
    values(numeroArreglo) {
        let array;
        switch (numeroArreglo) {
            case 1:
                array = this.state.solution1;
                break;
            case 2:
                array = this.state.solution2;
                break;
            default:
                array = this.state.solution3;
                break;
        }
        return (
            array.map(function (item, i) {
                return (<td className={array[i] + "table"} key={i} colSpan="3"><b>{array[i]}</b></td>)
            }))
    }

    /**
    * Depending of how many values there are in the translations, spaces are added to move right the last two possible solutions
    */
    lastPosition(numberSolution) {
        let remaining;
        let totalSolution;
        let total = this.state.originalString.length;
        switch (numberSolution) {
            case 1:
                totalSolution = 3 * this.state.solution1.length;
                remaining = total - totalSolution;
                break;
            case 2:
                totalSolution = 3 * this.state.solution2.length;
                remaining = total - totalSolution - 1;
                break;
            default:
                totalSolution = 3 * this.state.solution3.length;
                remaining = total - totalSolution - 2;
                break;
        }
        if (remaining !== 0) {
            return <td colSpan={remaining}></td>
        }
    }

    /**
     * Renders the last row of the table, where the original string lies.
     */
    original() {
        let originalString = this.state.originalString;
        let classColor;
        return (
            originalString.map(function (item, i) {
                if (item === "-") {
                    classColor = "gap";
                }
                if (item === "U") {
                    item = "T";
                    classColor = "T";
                }
                else {
                    classColor = item;
                }
                return (<td className={classColor} key={i}><b>{item}</b></td>)
            }))
    }

    /**
     * Use to change what was received by props to the corresponding letter.
     * @param d the value which will be mapped.
     */
    characterMapping(d) {
        switch (d) {
            case "percentagea":
                return "A"
            case "percentaget":
                return "U"
            case "percentageg":
                return "G"
            default:
                return "C"
        }
    }

    /**
     * The function which downloads the text file off the table information.
     */
    download() {
        const stop = 'stop';
        const regularExp = new RegExp(stop, 'g');

        let element = document.createElement('a');
        let solution1 = String(this.state.solution1);
        solution1 = solution1.replace(regularExp, "*");
        solution1 = solution1.replace(/,/g, '');
        let solution2 = String(this.state.solution2);
        solution2 = solution2.replace(regularExp, "*");
        solution2 = solution2.replace(/,/g, '');
        let solution3 = String(this.state.solution3);
        solution3 = solution3.replace(regularExp, "*");
        solution3 = solution3.replace(/,/g, '');

        let text = ">First Solution\n";

        for (let index = 0; index < solution1.length; index++) {
            if (index % 60 === 0 && index !== 0) {
                text += "\n";
            }
            text += solution1[index];
        }

        text += "\n>Second Solution\n";

        for (let index = 0; index < solution2.length; index++) {
            if (index % 60 === 0 && index !== 0) {
                text += "\n";
            }
            text += solution2[index];
        }

        text += "\n>Third Solution\n";

        for (let index = 0; index < solution3.length; index++) {
            if (index % 60 === 0 && index !== 0) {
                text += "\n";
            }
            text += solution3[index];
        }

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', "Translation.txt");
        element.click();
    }

    /**
     * The render function will draw the whole table inside the component.
     */
    render() {
        return (
            <div className="cuerpo fifthGraphMargin">
                <h1 className="margintitle5">Translation to Amino Acids <Tooltip placement="right" trigger="click" tooltip={this.state.information5}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="tableheadleft" scope="col"></th>
                                            {this.positions()}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>1</b></td>
                                            {this.values(1)}
                                            {this.lastPosition(1)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>2</b></td>
                                            <td></td>
                                            {this.values(2)}
                                            {this.lastPosition(2)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>3</b></td>
                                            <td colSpan="2"></td>
                                            {this.values(3)}
                                            {this.lastPosition(3)}
                                        </tr>
                                        <tr>
                                            <td scope="row" className="tableheadleft"><b>Nucleotides</b></td>
                                            {this.original()}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <button className="btn btn-dark" type="submit" onClick={this.download}>Download Table</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Translation;

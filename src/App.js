import React, { Component } from "react";
import * as d3 from "d3";
import './App.css';
import SequenceComparison from './SequenceComparison';
import SequenceMatrix from './SequenceMatrix';
import Translation from './Translation';
import EntropyAndProfile from './EntropyAndProfile';
import Tooltip from './Tooltip';
import exampleCorona from './corona.fasta';
import exampleGenes from './genefasta.fasta';
import exampleProteins from './proteinfasta.fasta';

/**
 * This is the main class which will be rendered in index.js.
 * App.js renders each of the graphs and tables used in the website.
 */
class App extends Component {

    constructor(props) {
        super(props);
        /**
         * The state are the variables used by the class.
         * corruptFile - Tells if the file loaded by the user had a wrong format.
         * loading - If true, means that the graphs are rendering and the user have to wait while it finishes.
         * exampleProteinsFile - Where the example protein file will be stored.
         * exampleGenesFile - Where the example gene file will be stored.
         * exampleCoronaFile - Where the example corona file will be stored.
         * isProtein - If the selected file is a protein alignment.
         * answer - Where the raw sequences wil be stored after splitting them by name.
         * dataFirstGraph - Data used by the first graph.
         * dataThirdGraph - Data used by the third and fourth graph.
         * namesGenes - Where the names of the sequences will be stored.
         * dataSecondGraph - Data used by the second graph.
         * valueFirstFilter - From what position sequences will be graphed.
         * valueSecondFilter - Until what position sequences will be graphed.
         * selectedBoxes - What sequences will be graphed.
         * information0 - Informative message of what the fiters do.
         */
        this.state = { corruptFile: false, loading: false, exampleCoronaFile: [], exampleProteinsFile: [], exampleGenesFile: [], isProtein: false, answer: [], dataFirstGraph: [], dataThirdGraph: [], namesGenes: [], dataSecondGraph: [], valueFirstFilter: 0, valueSecondFilter: 0, selectedBoxes: [], information0: "The filters changes what sequences the graphs will use." };
        //The binding of "this" to all methods used by the class.
        this.selections = this.selections.bind(this);
        this.filterAppJS = this.filterAppJS.bind(this);
        this.checkboxes = this.checkboxes.bind(this);
        this.filter = this.filter.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.deselectAll = this.deselectAll.bind(this);
        this.initialButtons = this.initialButtons.bind(this);
        this.shannon = this.shannon.bind(this);
        this.objectSecondGraph = this.objectSecondGraph.bind(this);
        this.objectSecondGraphProteins = this.objectSecondGraphProteins.bind(this);
        this.handleFile = this.handleFile.bind(this);
        //The reference to the gene translation table.
        this.tableref = React.createRef();
    }

    /**
     * Function which calculates the shannon entropy.
     * @param array Array of the values of all sequences at a certain position.
     * @returns Integer repretenting the shannon entropy at a centain position.
     */
    shannon = (array) => {
        if (array.length === 0)
            return 0;

        let modeMap = {};
        let el;

        for (let i = 0; i < array.length; i++) {
            el = array[i];
            if (modeMap[el] == null) {
                modeMap[el] = 1;
            }
            else {
                modeMap[el]++;
            }
        }

        let result = 0;
        let ArraySize = array.length;

        Object.keys(modeMap).forEach(element => {
            result += -1 * (modeMap[element] / ArraySize) * (Math.log2(modeMap[element] / ArraySize))
        });

        return result;
    }

    /**
     * Function which calculates the percentage of each value at a certain position for gene alignments.
     * @param array Array of the values of all sequences at a certain position.
     * @param position The position which percentages are being calculated.
     * @returns An instance of the class myObjectSecondGraphGenes which have the percentages per letter.
     */
    objectSecondGraph = (array, position) => {
        if (array.length === 0)
            return new myObjectSecondGraphGenes(position, 0, 0, 0, 0, 0);

        let modeMap = {};
        let el;
        for (let i = 0; i < array.length; i++) {
            el = array[i];
            if (modeMap[el] == null) {
                modeMap[el] = 1;
            }
            else {
                modeMap[el]++;
            }
        }

        let arraySize = array.length;
        let numberA = modeMap["A"] ? modeMap["A"] / arraySize : 0;
        let numberC = modeMap["C"] ? modeMap["C"] / arraySize : 0;
        let numberG = modeMap["G"] ? modeMap["G"] / arraySize : 0;
        let numberT = modeMap["T"] ? modeMap["T"] / arraySize : 0;
        let numberDash = modeMap["-"] ? modeMap["-"] / arraySize : 0;

        let answer = new myObjectSecondGraphGenes(position, numberA, numberC, numberG, numberT, numberDash);

        return answer;
    }

    /**
     * Function called after the render function when the component is first build.
     * It saves the values of the example files in the class variables.
     */
    componentDidMount() {
        let example1;
        let example2;
        let example3;
        d3.text(exampleProteins).then(data => {
            example1 = new File([data], "proteinfasta.txt", { type: "text/plain", });
            d3.text(exampleGenes).then(data => {
                example2 = new File([data], "genefasta.txt", { type: "text/plain", });
                d3.text(exampleCorona).then(data => {
                    example3 = new File([data], "coronafasta.txt", { type: "text/plain", });
                    this.setState({
                        exampleProteinsFile: example1,
                        exampleGenesFile: example2,
                        exampleCoronaFile: example3
                    })
                })
            })
        })
    }

    /**
     * Function which calculates the percentage of each value at a certain position for protein alignments.
     * @param array Array of the values of all sequences at a certain position.
     * @param position The position which percentages are being calculated.
     * @returns An instance of the class myObjectSecondGraphProteins which have the percentages per letter.
     */
    objectSecondGraphProteins = (array, position) => {
        if (array.length === 0)
            return new myObjectSecondGraphProteins(position, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        let modeMap = {};
        let el;
        for (let i = 0; i < array.length; i++) {
            el = array[i];
            if (modeMap[el] == null) {
                modeMap[el] = 1;
            }
            else {
                modeMap[el]++;
            }
        }

        let arraySize = array.length;
        let numberA = modeMap["A"] ? modeMap["A"] / arraySize : 0;
        let numberC = modeMap["C"] ? modeMap["C"] / arraySize : 0;
        let numberG = modeMap["G"] ? modeMap["G"] / arraySize : 0;
        let numberT = modeMap["T"] ? modeMap["T"] / arraySize : 0;
        let numberR = modeMap["R"] ? modeMap["R"] / arraySize : 0;
        let numberN = modeMap["N"] ? modeMap["N"] / arraySize : 0;
        let numberD = modeMap["D"] ? modeMap["D"] / arraySize : 0;
        let numberB = modeMap["B"] ? modeMap["B"] / arraySize : 0;
        let numberE = modeMap["E"] ? modeMap["E"] / arraySize : 0;
        let numberQ = modeMap["Q"] ? modeMap["Q"] / arraySize : 0;
        let numberZ = modeMap["Z"] ? modeMap["Z"] / arraySize : 0;
        let numberH = modeMap["H"] ? modeMap["H"] / arraySize : 0;
        let numberI = modeMap["I"] ? modeMap["I"] / arraySize : 0;
        let numberL = modeMap["L"] ? modeMap["L"] / arraySize : 0;
        let numberK = modeMap["K"] ? modeMap["K"] / arraySize : 0;
        let numberM = modeMap["M"] ? modeMap["M"] / arraySize : 0;
        let numberF = modeMap["F"] ? modeMap["F"] / arraySize : 0;
        let numberP = modeMap["P"] ? modeMap["P"] / arraySize : 0;
        let numberS = modeMap["S"] ? modeMap["S"] / arraySize : 0;
        let numberW = modeMap["W"] ? modeMap["W"] / arraySize : 0;
        let numberY = modeMap["Y"] ? modeMap["Y"] / arraySize : 0;
        let numberV = modeMap["V"] ? modeMap["V"] / arraySize : 0;
        let numberDash = modeMap["-"] ? modeMap["-"] / arraySize : 0;

        let answer = new myObjectSecondGraphProteins(position, numberA, numberC, numberG, numberT, numberR, numberN, numberD, numberB, numberE, numberQ,
            numberZ, numberH, numberI, numberL, numberK, numberM, numberF, numberP, numberS, numberW, numberY, numberV, numberDash);

        return answer;
    }

    /**
     * Function which calculates all the class variables with the selected file.
     * @param e File chosen.
     */
    handleFile(e) {
        //Set the variable loading from the start, so the user knows when the file is being processed
        this.setState({
            loading: true
        })
        //Check of what file was chosen or if it was one of the examples.
        var file;
        if (e === "proteinExample") {
            file = this.state.exampleProteinsFile;
        }
        else if (e === "geneExample") {
            file = this.state.exampleGenesFile;
        }
        else if (e === "coronaExample") {
            file = this.state.exampleCoronaFile;
        }
        else {
            file = e;
        }

        let reader = new FileReader();
        reader.onload = function () {
            const data = reader.result;
            let resultFirstGraph = [];
            let resultThirdGraph = [];
            let resultSecondGraph = [];
            const initialArrays = data.split(">");
            let answer = [];
            let names = [];
            let myString;
            let isProtein = false;

            //Read the file and split it by names. Save the result in the answer variable without the names of the sequences.
            for (let index = 0; index < initialArrays.length; index++) {
                if (index === 0) {
                    continue;
                }
                myString = initialArrays[index];
                names.push(myString.substring(0, myString.indexOf('\n')))
                myString = myString.substring(myString.indexOf('\n') + 1);
                answer.push(myString);
            }

            //If the split can not be done, change the corrupFile class variable to true.
            if (answer.length === 0) {
                this.setState({
                    corruptFile: true
                })
                return;
            }

            //If the size of the Strings are of different size, change the corrupFile class variable to true.
            let addition = 0;
            answer.map(x => addition += x.length);
            if (addition !== (answer[0].length * answer.length) - 2) {
                this.setState({
                    corruptFile: true
                })
                return;
            }

            //Check is the loaded file is a gene or protein alignment.
            const lettersOnlyProteins = ["R", "N", "D", "B", "E", "Q", "Z", "H", "I", "L", "K", "M", "F", "P", "S", "W", "Y", "V"];
            if (lettersOnlyProteins.some(el => answer[0].includes(el))) {
                isProtein = true;
            }

            let posAverage = 0;
            let valAverage = 0;
            let fixJump = 0;
            let components;

            //Generate the data that the first graph will be using.
            //It uses the shannon function to generate the necessary data.
            for (let index = 0; index < answer[answer.length - 1].length; index++) {

                components = [];

                for (let innerIndex = 0; innerIndex < answer.length; innerIndex++) {
                    components.push(answer[innerIndex].charAt(index));
                }

                if (!isProtein) {
                    if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                        fixJump++;
                        continue;
                    }
                }
                else {
                    if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                        && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                        && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                        fixJump++;
                        continue;
                    }
                }

                valAverage += this.shannon(components);

                if (posAverage >= 5 || index + 1 == answer[answer.length - 1].length) {
                    let objectTemp = new myObject(index - fixJump, valAverage / (posAverage + 1));
                    resultFirstGraph.push(objectTemp);
                    valAverage = 0;
                    posAverage = 0;
                }
                else {
                    posAverage++;
                }
            }

            //Generate the data that the third and fourth graph will be using.
            fixJump = 0;
            components = [];

            for (let index = 0; index < answer[answer.length - 1].length; index++) {
                components = [];

                for (let innerIndex = 0; innerIndex < answer.length; innerIndex++) {
                    components.push(answer[innerIndex].charAt(index));
                }

                if (!isProtein) {
                    if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                        fixJump++;
                        continue;
                    }
                }
                else {
                    if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                        && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                        && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                        fixJump++;
                        continue;
                    }
                }

                let objectTemp = "{\"position\":" + (index + 1 - fixJump) + "";

                for (let pos = 0; pos < components.length; pos++) {
                    objectTemp += ",\"" + names[pos] + "\":\"" + answer[pos][index] + "\"";
                }

                objectTemp += "}";
                objectTemp = objectTemp.replace(/[\r\n]+/gm, "");
                let res = JSON.parse(objectTemp)
                resultThirdGraph.push(res);
            }

            //Generate the data that the second graph will be using.
            let objectPosition = null;
            fixJump = 0;
            components = [];

            for (let index = 0; index < answer[answer.length - 1].length; index++) {
                components = []

                for (let innerIndex = 0; innerIndex < answer.length; innerIndex++) {
                    components.push(answer[innerIndex].charAt(index));
                }

                if (!isProtein) {
                    if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                        fixJump++;
                        continue;
                    }

                    objectPosition = this.objectSecondGraph(components, (index + 1 - fixJump));
                    resultSecondGraph.push(objectPosition);
                }
                else {

                    if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                        && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                        && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                        fixJump++;
                        continue;
                    }

                    objectPosition = this.objectSecondGraphProteins(components, (index + 1 - fixJump));
                    resultSecondGraph.push(objectPosition);
                }
            }

            //Generate the data that the fifth graph will be using.
            let resultFifthGraph = [];
            let keys = ["percentagea", "percentagec", "percentageg", "percentaget"];
            let biggestName;
            let biggestValue;

            resultSecondGraph.map(function (item, i) {
                biggestName = null;
                biggestValue = 0;
                keys.forEach(element => {
                    if (item[element] > biggestValue) {
                        biggestName = element;
                        biggestValue = item[element];
                    }
                });
                resultFifthGraph.push(new myObjectFifthGraph(i + 1, biggestName))
            })

            //Set the data to the class variables.
            this.setState({
                dataFirstGraph: resultFirstGraph,
                dataThirdGraph: resultThirdGraph,
                dataSecondGraph: resultSecondGraph,
                dataFifthGraph: resultFifthGraph,
                valueFirstFilter: 1,
                selectedBoxes: names,
                valueSecondFilter: resultThirdGraph.length,
                namesGenes: names,
                answer: answer,
                isProtein: isProtein,
                loading: false
            })

            //Change the size of the fourth table if it's too big thanks to the amount of sequences being processed.
            if (this.tableref.current.offsetHeight > 300) {
                d3.selectAll(".table-check")
                    .style("height", "300px")
                    .style("overflow", "auto");
            } else {
                d3.selectAll(".table-check")
                    .style("height", null)
                    .style("overflow", "auto");
            }
        }.bind(this);

        reader.readAsText(file);
    }

    /**
     * Set the start and end position filtered to change all the graphs and tables data.
     * @param event Is the value chosen by the user.
     */
    filterAppJS(event) {
        const firstValue = parseInt(event.target.value.split(" - ")[0]);
        const secondValue = parseInt(event.target.value.split(" - ")[1]);
        this.setState({
            valueSecondFilter: secondValue, valueFirstFilter: firstValue
        });
    }

    /**
     * This function return the arrays to be used by the translation table.
     */
    selections() {
        const totalSize = this.state.dataThirdGraph.length;
        const remainingNumbers = totalSize % 100;
        let arrayMapping = []

        arrayMapping.push(1 + " - " + totalSize);

        for (let index = 0; index < totalSize - remainingNumbers; index += 100) {
            arrayMapping.push((index + 1) + " - " + (index + 100));
        }

        if ((totalSize - remainingNumbers) != 0) {
            arrayMapping.push((totalSize - remainingNumbers + 1) + " - " + totalSize);
        }

        return (
            arrayMapping.map(function (item, i) {
                return <option value={item} key={i}>{item}</option>
            }))
    }

    /**
     * This function creates the checkboxes using the sequence names.
     */
    checkboxes() {
        const names = this.state.namesGenes;
        return (
            names.map(function (item, i) {
                return (<div className="form-check spaceCheckbox" key={i}>
                    <input className="form-check-input" type="checkbox" id={i} value={item} defaultChecked />
                    <label className="form-check-label" htmlFor={i}>{item}</label>
                </div>)
            }))
    }

    /**
     * This function updates the values in the class variables when the user filters the names of the sequences he wants to see.
     */
    filter() {
        let namesArray = [];
        const isProtein = this.state.isProtein;

        let boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            if (item.checked === true) {
                namesArray.push(item.value);
            }
        })

        let objectTemp = null;
        let posAverage = 0;
        let resultFirstGraph = [];
        let valAverage = 0;
        let fixJump = 0;
        const answer = this.state.answer;
        const namesGenes = this.state.namesGenes;
        let components = [];

        //Generate the data that the first graph will be using.
        //It uses the shannon function to generate the necessary data.
        for (let index = 0; index < answer[answer.length - 1].length; index++) {

            components = []

            for (let innerIndex = 0; innerIndex < answer.length; innerIndex++) {
                if (namesArray.includes(namesGenes[innerIndex])) {
                    components.push(answer[innerIndex].charAt(index));
                }
            }

            if (!isProtein) {
                if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    fixJump++;
                    continue;
                }
            }
            else {
                if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                    && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                    && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                    fixJump++;
                    continue;
                }
            }

            valAverage += this.shannon(components);

            if (posAverage >= 5 || index + 1 == answer[answer.length - 1].length) {
                objectTemp = new myObject(index - fixJump, valAverage / (posAverage + 1));
                resultFirstGraph.push(objectTemp);
                valAverage = 0;
                posAverage = 0;
            }
            else {
                posAverage++;
            }
        }

        //Generate the data that the second graph will be using.
        let objectPosition = null;
        fixJump = 0;
        let resultSecondGraph = [];
        components = [];
        for (let index = 0; index < answer[answer.length - 1].length; index++) {
            components = [];

            for (let innerIndex = 0; innerIndex < answer.length; innerIndex++) {
                if (namesArray.includes(namesGenes[innerIndex])) {
                    components.push(answer[innerIndex].charAt(index));
                }
            }

            if (!isProtein) {
                if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G")) {
                    fixJump++;
                    continue;
                }

                objectPosition = this.objectSecondGraph(components, (index + 1 - fixJump));
                resultSecondGraph.push(objectPosition);
            }
            else {
                if (components.some(v => v !== "-" && v !== "A" && v !== "T" && v !== "C" && v !== "G" && v !== "R" && v !== "N" && v !== "D"
                    && v !== "B" && v !== "E" && v !== "Q" && v !== "Z" && v !== "H" && v !== "I" && v !== "L" && v !== "K" && v !== "M" && v !== "F"
                    && v !== "P" && v !== "S" && v !== "W" && v !== "Y" && v !== "V")) {
                    fixJump++;
                    continue;
                }

                objectPosition = this.objectSecondGraphProteins(components, (index + 1 - fixJump));
                resultSecondGraph.push(objectPosition);
            }
        }

        //Update the class variables with the results.
        this.setState({
            selectedBoxes: namesArray,
            dataSecondGraph: resultSecondGraph,
            dataFirstGraph: resultFirstGraph
        });


    }

    /**
     * This function is called when the user selects the "select all sequences" option.
     */
    selectAll() {
        const boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            item.checked = true;
        })
        this.filter();
    }

    /**
     * This function is called when the user selects the "deselect all sequences" option.
     */
    deselectAll() {
        const boxes = d3.selectAll(".form-check-input").nodes()
        boxes.map(function (item, i) {
            item.checked = false;
        })
        this.filter();
    }

    /**
     * This function return a piece of HTML depending on what needs to be loaded in the website.
     * The first option is if the information is loading.
     * The second option is if the file was corrupted or couldnt be loaded.
     * The third option is first screen the user sees, where he needs to select one of the example files of upload a file.
     */
    initialButtons() {
        if (this.state.loading && !this.state.corruptFile) {
            return <h1 className="innerLoad">Loading</h1>;
        }
        else if (this.state.corruptFile) {
            return (<div className="body innerLoad">
                <h1>File Error</h1>
                <button className="btn btn-dark btn-lg" onClick={() => window.location.reload()}>Load new file</button></div>);
        }
        else {
            return (<div className="body innerLoad">
                <div className="container">
                    <div className="row">
                        <div className="col-md">
                            <div className="card border-primary mb-3 cardWidth">
                                <div className="card-header">Upload a File</div>
                                <div className="card-body text-dark">
                                    <form>
                                        <div className="form-group">
                                            <input type="file" className="hoverHand form-control-file" onChange={e => this.handleFile(e.target.files[0])} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <div className="hoverHand card border-dark mb-3 cardWidth" onClick={proteinExample => this.handleFile("proteinExample")}>
                                <div className="card-header">Example protein sequence</div>
                                <div className="card-body text-dark">
                                    <p className="card-text">Use an example file which contains 3 protein sequences.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <div className="hoverHand card border-dark mb-3 cardWidth" onClick={geneExample => this.handleFile("geneExample")}>
                                <div className="card-header">Example gene sequence</div>
                                <div className="card-body text-dark">
                                    <p className="card-text">Use an example file which contains 45 gene sequences.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <div className="hoverHand card border-dark mb-3 cardWidth" onClick={exampleCorona => this.handleFile("coronaExample")}>
                                <div className="card-header">Covid-19 sequences</div>
                                <div className="card-body text-dark">
                                    <p className="card-text">Use an example file which contains covid-19 sequences.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
        }
    }

    /**
     * The render function will draw everything on the website.
     */
    render() {
        return (
            <div className="App">
                {this.state.dataThirdGraph.length > 0 ?
                    <div>
                        <button className="btn btn-dark btn-lg" onClick={() => window.location.reload()}>Load new file</button>
                        {!this.state.isProtein ? <Translation dataFifthGraph={this.state.dataFifthGraph} /> : <p></p>}
                        <h1 className="marginTitle0">Table Filters <Tooltip placement="right" trigger="click" tooltip={this.state.information0}> <span type="button" className="badge badge-pill badge-primary">i</span> </Tooltip></h1>
                        <div className="container">
                            <div className="row">
                                <div className="col-md">
                                    <button className="btn btn-dark" type="submit" onClick={this.filter}>Filter</button>
                                    <button className="btn btn-dark" type="submit" onClick={this.selectAll}>Select All Sequences</button>
                                    <button className="btn btn-dark" type="submit" onClick={this.deselectAll}>Deselect All Sequences</button>
                                </div>
                            </div>
                            <div className="row table-check" ref={this.tableref}>
                                <div className="col-md">
                                    {this.checkboxes()}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md">
                                    <form>
                                        <select width="500" id="numberBar" className="form-control" onChange={this.filterAppJS}>
                                            {this.selections()}
                                        </select>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <EntropyAndProfile isProtein={this.state.isProtein} dataSecondGraph={this.state.dataSecondGraph} dataFirstGraph={this.state.dataFirstGraph} valueFirstFilter={this.state.valueFirstFilter} valueSecondFilter={this.state.valueSecondFilter} />
                        <SequenceComparison isProtein={this.state.isProtein} dataThirdGraph={this.state.dataThirdGraph} namesGenes={this.state.namesGenes} valueFirstFilter={this.state.valueFirstFilter} valueSecondFilter={this.state.valueSecondFilter} />
                        <SequenceMatrix namesGenes={this.state.selectedBoxes} dataFourthGraph={this.state.dataThirdGraph} valueFirstFilter={this.state.valueFirstFilter} valueSecondFilter={this.state.valueSecondFilter} />
                    </div> : <div>{this.initialButtons()}</div>}
            </div>
        );
    }
}

/**
 * Objects of this class will be used by the shannon graph.
 */
class myObject {
    constructor(position, percentage) {
        this.position = position;
        this.percentage = percentage;
    }
}

/**
 * Objects of this class will be used by the second graph if the website is rendering a gene aligment.
 */
class myObjectSecondGraphGenes {
    constructor(position, percentagea, percentagec, percentageg, percentaget, percentagedash) {
        this.position = position;
        this.percentagea = percentagea;
        this.percentagec = percentagec;
        this.percentageg = percentageg;
        this.percentaget = percentaget;
        this.percentagedash = percentagedash;
    }
}

/**
 * Objects of this class will be used by the translation table.
 */
class myObjectFifthGraph {
    constructor(position, letter) {
        this.position = position;
        this.letter = letter;
    }
}

/**
 * Objects of this class will be used by the second graph if the website is rendering a protein aligment.
 */
class myObjectSecondGraphProteins {
    constructor(position, percentagea, percentagec, percentageg, percentaget, percentager, percentagen, percentaged, percentageb, percentagee,
        percentageq, percentagez, percentageh, percentagei, percentagel, percentagek, percentagem, percentagef, percentagep,
        percentages, percentagew, percentagey, percentagev, percentagedash) {
        this.position = position;
        this.percentagea = percentagea;
        this.percentagec = percentagec;
        this.percentageg = percentageg;
        this.percentaget = percentaget;
        this.percentager = percentager;
        this.percentagen = percentagen;
        this.percentaged = percentaged;
        this.percentageb = percentageb;
        this.percentagee = percentagee;
        this.percentageq = percentageq;
        this.percentagez = percentagez;
        this.percentageh = percentageh;
        this.percentagei = percentagei;
        this.percentagel = percentagel;
        this.percentagek = percentagek;
        this.percentagem = percentagem;
        this.percentagef = percentagef;
        this.percentagep = percentagep;
        this.percentages = percentages;
        this.percentagew = percentagew;
        this.percentagey = percentagey;
        this.percentagev = percentagev;
        this.percentagedash = percentagedash;
    }
}

export default App;
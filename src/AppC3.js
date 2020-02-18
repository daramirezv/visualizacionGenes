import React, { Component } from "react";
import './AppC3.css';
import * as c3 from "c3";
import 'c3/c3.css';


class AppC3 extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        // c3.generate({
        //     data: {
        //         columns: [
        //             ['sample', "A", "A", "A", "C", "C", "T"]
        //         ]
        //     },
        //     subchart: {
        //         show: true
        //     },
        //     zoom: {
        //         enabled: true
        //     }
        // });
        c3.generate({
            data: {
                columns: [
                    ['sample', 30, 200, 100, 400, 150, 2500]
                ]
            },
            axis : {
                y : {
                    tick: {
                        format: d3.format("$,")
        //                format: function (d) { return "$" + d; }
                    }
                }
            }
        });
    }

    render() {
        return <div id="chart">
        </div>;
    }
}

export default AppC3;
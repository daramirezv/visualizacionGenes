import React, { Component } from "react";

class Prueba extends Component {
    constructor(props) {
        super(props);
        this.peticion = this.peticion.bind(this);
    }

    peticion() {
        fetch("https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_TYPE=Text&RID=AB9M6SRA016", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors',
            headers: {
              'Content-Type': 'x-www-form-urlencoded'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            }
          }).then((response) => {
            console.log(response)
          })
    }


    render() {
        return (
            <div>
                <h1>PruebaLol</h1>
                {this.peticion()}
            </div>
        );
    }
}

export default Prueba;
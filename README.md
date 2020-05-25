## Introduction

Multiple sequence alignment is a way to organize gene or protein sequences for an easy comparison. Despite the fact that this procedure has been done for years, there are not many applications that facilitate the alignment's analysis. The objective of this project is to build a website that offers different visualizations, allowing the user to filter and manage the presented information.

## Motivation

Multiple sequence alignment is a classical bioinformatics problem in genomics. For this reason, it is an opportunity to learn how genetics has evolved and transformed in recent decades. It is a good first approach to this topic that has always caught my attention. Within the entire field of bioinformatics, I chose visualization of multiple sequence alignments because I feel that despite being a highly developed field, there are few modern visualization solutions, making it hard for people to approach and learn about genetics and bioinformatics. What makes these previously mention visualizations not so great is the fact that they were done years ago with old technologies. Computer engineering allows me to shape multiple sequence alignments using new web technologies to make it more understandable and accessible, making this graduation project the perfect opportunity to combine two very different fields into one solution. I hope this graduation project will encourage many into learning about bioinformatics and all it has to offer.

## Methodology

The application was built using React.js as the main web library for rendering all the present components on the website. React was chosen over other JavaScript frameworks due to its great support of the community and because it is the most used library for building websites. All the components were done in different files for having a more modular code, meaning it is easier to maintain over time. React helps to have modular code by allowing you to make components separate from each other.

Each chart was built using D3 because it is one of the most modern web technologies for data visualization. Not only is it modern, but it specializes in manipulating big amounts of data, like those used in genetics. Even though D3 is well optimized, the website code was done focusing on memory usage and time of response. NPM is the package manager used to install D3 in the website.

Having a clean page is important to understand more easily the information offered by the graphs. For this reason, various components were built using Bootstrap, which is also a very popular framework for web visualizations. The framework was installed in the index.html file, without using any package manager.

Tooltips were added to the right side of every title, helping the user understand what the corresponding table or graph does. Another JavaScript library called react-popper-tooltip was installed using NPM, which shows a tooltip when any information icon is clicked.

The covid sample file was acquired when aligning covid-like sequences with Blast. Blast is a software that searches for similar sequences to the one being analyzed. The sequences in this file are from viruses with similar sections, meaning that they could have a common ancestor. This virus was analyzed to generate more insight into the origin of the virus. The other two sample files were downloaded by searching for gene and protein alignments of different sizes and number of sequences.

## Desployment

### `npm install`

Installs all the necessary dependencies the project needs to have to run properly.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
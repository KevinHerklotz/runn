# runn

The first thing I did was writing this documentation - so don't wonder the tool doesn't work yet.

## Getting started

### What is runn?

runn is a tool that can run your NPM scripts faster.

**runn** stands for _**run n**pm_.

### Background

If you have a package.json with scripts calling other scripts ([which often happens when you use NPM as build tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)), Node will start a new process for each of that scripts.
The problem is that each process initiation takes time - to much time.
 
An example:

Your package.json

    {
        ...
        "scripts": {
            "build": "npm run testCss && npm run testJs && npm run generateCss && npm run generateJs",
            "testCss": "do something",
            "testJs": "do something",
            "generateCss": "do something",
            "generateJs": "do something"
        },
        ...
    }

The command `npm run build` would initiate 5 processes in this case.

`runn build` will bring the same result, but invokes only 1 process. 

[NPM](https://www.npmjs.com/).

### Requirements

* [Node >= 4.*](https://nodejs.org)
* NPM >= 2.* (comes with Node)

### Installation

## Usage

Instead of `npm run` type `runn`. That's it.
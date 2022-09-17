'use strict';
const request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');
const readline = require('readline');
const fs = require('fs');
// const filename = 'export.txt';

const country = require('./aux_data/countries');
const __f = require('./functions');
const { exit } = require('process');
const rl = readline.createInterface(process.stdin, process.stdout);
const importDataVideoList = require('./export.js');

// test inputs:
const video = 'https://www.youtube.com/watch?v=r3l11juINsk' // Muse dash
// const video = 'https://www.youtube.com/watch?v=wVa78g6yZ0g&t=57s'// mantecota
// const video = 'https://www.youtube.com/watch?v=24EGt7JiUKM&list=RDMMrDpv-lYFu_g&index=16' // polyphia
// const video = 'https://www.youtube.com/watch?v=X7-jVaZk1Q8&list=RDMMrDpv-lYFu_g&index=14' // dazbee
// const video = 'https://www.youtube.com/watch?v=wA3SoaKVQwM' // Pochi Korone



// Solicitar datos por CMD
/* let answer = [];
rl.question('a?', (input) => {
    // console.log(`tu respuesta: ${input}`)
    answer.push(input)
    console.log(answer)
    process.exit();
}) */
// console.log('b', answer)


// Solicitar datos por CMD - Loop
/* rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        console.log(answer)
        process.exit()
    }
    rl.setPrompt('Ingrese el video de youtube:\n');
    rl.prompt();
    answer.push(input);
}) */


// TEST: Imprimir titulos de exportación
/* console.log(`/------------- TITLES:`)
for (const { snippet: { title } } of importDataVideoList) {
    console.log(`• ${title}`)
} */

// Limpiar archivo export (para menu)
/* if (importDataVideoList.length > 0) {
    fs.writeFile('./export.js', '', () => { })
} */

process.exit();
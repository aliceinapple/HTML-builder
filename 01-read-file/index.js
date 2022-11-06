const fs = require('fs');
const path = require('path');

let filePath = path.join(__dirname, 'text.txt');
let readPath = fs.createReadStream(filePath, 'utf-8');

let data = '';
readPath.on('data', (chunk) => {
    data += chunk;
});

readPath.on('end', () => {
    console.log(data);
})

readPath.on('error', (error) => {
    console.log('ERROR:', error.message);
})
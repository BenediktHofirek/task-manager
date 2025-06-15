const fs = require('fs');

const filename = './src/api/sdk.gen.ts'; 

// Read file content
let content = fs.readFileSync(filename, 'utf-8');

// Regex to match return blocks ending with );
const regex = /(^\s*return\s*\(.*?\))\s*;/gms;

content = content.replace(regex, (_, requestFn) => {
  // data cannot be undefined because in config, throwOnError is set to true
  return requestFn + '.then((response) => response.data as Exclude<typeof response.data, undefined>);';
});

// Write back the modified content
fs.writeFileSync(filename, content, 'utf-8');

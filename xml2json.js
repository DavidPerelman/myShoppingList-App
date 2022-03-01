const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

const parser = new xml2js.Parser();

fs.readFile('./Price7290027600007-181-202202260400.xml', (err, data) => {
  parser.parseString(data, (err, result) => {
    const res = util.inspect(result, false, null, true);
    fs.writeFile('newfile.json', res, (err) => {
      if (err) throw err;
      console.log('File is created successfully.');
    });
  });
});

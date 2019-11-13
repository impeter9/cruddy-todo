const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id;
  counter.getNextUniqueId((err, counterString) => {
    if (err) {
      console.log(counterString);
    } else {
      id = counterString;
      var loc = exports.dataDir + '/' + id + '.txt';
      fs.writeFile(loc, text, (err) => {
        if (err) {
          throw ('error creating todo file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var promises = [];
  var readdirAsync = Promise.promisify(fs.readdir);
  var readOneAsync = Promise.promisify(exports.readOne);

  readdirAsync(exports.dataDir)
    .catch(function (error) {
      console.log('error readdirAsync', error);
      return;
    })
    .then(function (fileNames) {
      for (var i = 0; i < fileNames.length; i++) {
        promises.push(readOneAsync(fileNames[i].slice(0, 5)));
      }
      Promise.all(promises).then(function (values) {
        callback(null, values);
      });
    });
};

// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, (err, fileNames) => {
//     if (err) {
//       callback(null, []);
//     } else {
//       callback(null,
//         _.map(fileNames, (fileName) => {
//           fileName = path.basename(fileName, '.txt');
//           return { id: fileName, text: fileName };
//         }));
//     }
//   });
// };

exports.readOne = (id, callback) => {
  var loc = exports.dataDir + '/' + id + '.txt';
  fs.readFile(loc, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  var loc = exports.dataDir + '/' + id + '.txt';
  fs.readFile(loc, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
      return;
    } else {
      fs.writeFile(loc, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
          return;
        } else {
          callback(null, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var loc = exports.dataDir + '/' + id + '.txt';

  fs.unlink(loc, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

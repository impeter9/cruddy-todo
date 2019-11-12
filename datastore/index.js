const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  fs.readdir(exports.dataDir, (err, fileNames) => {
    if (err) {
      callback(null, []);
    } else {
      callback(null, _.map(fileNames, (fileName) => { fileName = path.basename(fileName, '.txt'); return { id: fileName, text: fileName }; }));
    }
  });
};

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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
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
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

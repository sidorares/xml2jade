#!/usr/bin/env node

var sax = require('sax');
var diamond = require('diamond');

var indent = '';
var tab = '  ';
var parser = sax.createStream(true);
var out = process.stdout;

var state = 'init';

parser.onerror = function (e) {
  throw e; // stop here
};

function serialiseAttributes(attr) {
  var res = [];
  for (var name in attr) {
    res.push(name + '="' + attr[name] + '"');
  }
  if (res.length === 0)
    return '';
  return '(' + res.join(', ') + ')';
}

parser.on('opentag', function (node) {
  if (state == 'text' || state == 'attributes' || state == 'opentag')
      out.write('\n');
  out.write(indent);
  out.write(node.name);
  out.write(serialiseAttributes(node.attributes));
  indent += tab;
  state = 'attributes';
});

parser.on('closetag', function (node) {
  // subtract tab
  indent = indent.substr(0, indent.length - tab.length);
  state = 'opentag';
});

parser.on('text', function(text) {
  text = text.trim();
  if (state == 'attributes')
    out.write(' ');
  out.write(text);
  state = 'text';
});

diamond().pipe(parser);

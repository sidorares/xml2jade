var sax = require('sax');
var diamond = require('diamond');

var indent = '';
var tab = '  ';
var parser = sax.createStream(true);
var out = process.stdout;

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
  out.write(indent);
  out.write(node.name);
  out.write(serialiseAttributes(node.attributes));
  indent += tab;
});

parser.on('closetag', function (node) {
  // subtract tab
  indent = indent.substr(0, indent.length - tab.length);
});

parser.on('text', function(text) {
  text = text.trim();
  if (text === '')
  {
    out.write('\n');
  }
  out.write(' ' + text + '\n');
});

diamond().pipe(parser);

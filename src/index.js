// Polyfills modern JavaScript features (ES6+) for older browsers.
// Includes things like Promise, Map, Set, Array.from, Object.assign, etc.
// This ensures that code using modern JS features runs in IE11 and other older environments.
import 'core-js/stable/index.js';  

// Polyfills support for async functions and generators in older browsers.
// Babel transpiles async/await into generator functions that rely on regeneratorRuntime.
// Without this, code using async/await would throw ReferenceError in browsers like IE11.
import 'regenerator-runtime/runtime.js';

ace.define('ace/plugin/yaml-validation', ['require', 'exports', 'module', 'ace/lib/dom', 'ace/lib/lang'], function (
  require
) {
  var dom = require('ace/lib/dom');
  var lang = require('ace/lib/lang');

  const highlight =  function(editor, patterns, nlp) {
  // each keypress

      
 
    
    if(patterns.length === 0){
      return
    }
    // get text
    let str = editor.getValue();
    // parse it
    let d = nlp(str);
    //d.normalize()
    var Range = ace.require("ace/range").Range
           const prevMarkers = editor.session.getMarkers();
if (prevMarkers) {
  const prevMarkersArr = Object.keys(prevMarkers);
  for (let item of prevMarkersArr) {
    editor.session.removeMarker(prevMarkers[item].id);
  }
}
    // run each pattern
    Object.keys(patterns).forEach(k => {
      let m = d.match(k);
      if (m.found) {

        // get the char-offset for each match
        let json = m.json({ offset: true });
        // highlight each segment
        json.forEach(o => {
          let start = editor.session.doc.indexToPosition(o.offset.start);
          let end = editor.session.doc.indexToPosition(o.offset.start + o.offset.length);
          editor.session.addMarker(
            new Range(start.row, start.column, end.row, end.column),
            `ner ner ${patterns[k]}`, "text"
          );
        });
      }
    });
 
}
  
  return highlight
 
});

async function hello(){

}
await hello();

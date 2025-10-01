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

var Kefir = require('kefir');

function Button(move,id){
  var idStr = '#'+id;

  function toFalse(){
    return false;
  }

  function toTrue(){
    return true;
  }

  function toTime(forwardInTime){
    return Supermove
        .animate(100)
        .map(function(time){
          return forwardInTime? time: 1.0 - time;
        });
  }

  var selected = true;
  var selectedSpec = Kefir.constant(false)
    .merge(move.event('click',idStr))
    .map(function(){
      selected = !selected;
      return selected? { element:'.selected', content:' (ON)'}:{content:' (OFF)'};
    });

  var hoverStream = Kefir.constant(false)
    .merge(move.event('mouseover',idStr).map(toTrue))
    .merge(move.event('mouseout',idStr).map(toFalse));

  var hoverSpec = hoverStream
    .map(function(hover){
      return hover? { element:'.hover'}:null;
    });

  var scaleSpec = hoverStream
    .debounce(100)
    .flatMapLatest(toTime)
    .map(Supermove.tween(
        { scaleX: 0  , scaleY: 0   },
        { scaleX: 0.5, scaleY: 0.5 }
    ));

  Kefir.combine([
    Kefir.constant({id:id,behavior:'button'}),
    scaleSpec,
    hoverSpec,
    selectedSpec
  ],Supermove.combine)
    .onValue(move.render);
}

Supermove.button = Button;
module.exports = Button;
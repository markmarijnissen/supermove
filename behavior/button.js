(function(){
  var Kefir,Supermove;
  /**
   * For now, support both browser and CommonJS
   */
  if(typeof module !== 'undefined') {
    Kefir = require('kefir');
    Supermove = require('../supermove');
    module.exports = Button;
  } else {
    Kefir = window.Kefir;
    Supermove = window.Supermove;
    Supermove.button = Button;
  }

  function toFalse(){
    return false;
  }

  function toTrue(){
    return true;
  }

  function hoverAnimationStream(forwardInTime){
    return Supermove
        .animate(100)
        .map(function(time){
          return forwardInTime? time: 1.0 - time;
        });
  }

  function Button(move,id){
    var idStr = '#'+id;
    var selected = true;

    // Base spec
    var baseSpec = Kefir.constant({
      id:id,
      behavior:'button'
    });

    // Click spec: clicks --> toggle .selected class
    var selectedSpec = Kefir.constant(false)
      .merge(move.event('click',idStr))
      .map(function(){
        selected = !selected;
        return selected? { element:'.selected', content:' (ON)'}:{content:' (OFF)'};
      });

    // hover -->
    var hoverStream = Kefir.constant(false)
      .merge(move.event('mouseover',idStr).map(toTrue))
      .merge(move.event('mouseout',idStr).map(toFalse));

    // Hover Class spec: 
    // hover --> toggle .hover class
    var hoverSpec = hoverStream
      .map(function(hover){
        return hover? { element:'.hover'}:null;
      });

    // Hover Animation spec:
    // hover --> trigger animation
    var scaleSpec = hoverStream
      .flatMapLatest(hoverAnimationStream)
      .map(Supermove.tween(
          { scaleX: 0  , scaleY: 0   },
          { scaleX: 0.5, scaleY: 0.5 }
      ));

    // Merge all specs into one behavior
    Kefir.combine([
      baseSpec,
      scaleSpec,
      hoverSpec,
      selectedSpec,
    ],Supermove.merge)
    // log (debug)
    //.log('button '+id)
    // immediatly render button
    .onValue(move.render);
  }
})();
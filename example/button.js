function Button(move,id){
  var start = [1,1,1];
  var end = [1.5,1.5,1];
  var idStr = '#'+id;

  function toFalse(){
    return false;
  }

  function toTrue(){
    return true;
  }

  function toAnimatedTime(hover){
    return Supermove
        .animate(100)
        .map(function(time){
          return hover? time: 1.0 - time;
        });
  }

  var clicked = false;
  var clicks = move.event('click',idStr)
    .map(function(){
      clicked = !clicked;
      return {
        id: id,
        element: clicked? '*.selected':'-.selected'
      };
    });

  var hovering = Kefir.constant(false)
    .merge(move.event('mouseover',idStr).map(toTrue))
    .merge(move.event('mouseout',idStr).map(toFalse));

  var hoverClass = hovering
    .map(function(hover){
       return {
          id: id,
          element: hover? '*.hover':'-.hover'
       };
    });
    
  return hovering
    .debounce(100)
    .flatMapLatest(toAnimatedTime)
    .map(Supermove.tween(
        { id: id, scale: start },
        { id: id, scale: end }
    ))
    .merge(hoverClass)
    .merge(clicks);

}

function Button(move,id){
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

  var selected = false;
  var selectedStream = move.event('click',idStr)
    .map(function(){
      selected = !selected;
      return selected? {id:id,addClass:'selected'}:{id:id,removeClass:'selected'};
    });

  var hovering = Kefir.constant(false)
    .merge(move.event('mouseover',idStr).map(toTrue))
    .merge(move.event('mouseout',idStr).map(toFalse));

  var hoverClass = hovering
    .map(function(hover){
      return hover? {id:id,addClass:'hover'}:{id:id,removeClass:'hover'};
    });
    
  return hovering
    .debounce(100)
    .flatMapLatest(toAnimatedTime)
    .map(Supermove.tween(
        { id: id, scaleX: 1  , scaleY: 1   },
        { id: id, scaleX: 1.5, scaleY: 1.5 }
    ))
    .merge(hoverClass)
    .merge(selectedStream);
}

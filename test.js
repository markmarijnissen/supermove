var move = Supermove.mount(document.body,10);

var animator = Kefir.emitter();

var animation = animator.flatMapLatest(function(duration){
		return Supermove.animate(duration);
	});

var w = window.innerWidth;

var mouse = Kefir.fromEvent(document.body,'mousemove')
	.map(function(event){
		return event.pageX / w;
	})
	//.merge(Kefir.later(0,0))
	.onValue(m.redraw);

Kefir.combine([mouse,animation],function(mouse,animate){
		return (mouse + animate) % 1.0;
	})
	.map(function(i){
		return i; //Math.sqrt(i) * (3.0 - 2.0 * i);
	})
	.map(function(i){
		return [1,2,3].map(function(id){
			return {
				id:id,
				show: true,
				//rotateY:(Math.round(i * 2 * Math.PI * 1000) / 1000) % (2 * Math.PI),
				x:(Math.round(i * 200000) / 1000) % 500,
				y: id * 50,
				scale: [1+i,1+i*0.5,1],
				z: (Math.round(i * 200) / 1000) % 500,
				content: 'Hello There!'
			};
		});
	})
	.onValue(move.update);

move.stream('click','#1')
	.flatMapLatest(function(){
		return Supermove.animate(500);
	})
	.map(function(i){
		return [{
			id: 1,
			rotateY: (Math.round(i * 2 * Math.PI * 1000) / 1000) % (2 * Math.PI)
		}];
	})
	.onValue(move.update);

animator.emit(1000);
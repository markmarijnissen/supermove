var move = new Supermove(document.body,{cache: 10});

var animator = Kefir.emitter();
var animation = animator.flatMapLatest(function(duration){
		return Supermove.animate(duration);
	});
var mouseX = move.event('mousemove')
	.merge(Kefir.constant({pageX: 0}))
	.combine(Supermove.resize)
	.map(function(data){
		return data[0].pageX / data[1][0];
	})
	.onValue(m.redraw);

var buttons = Kefir.combine([mouseX,animation],function(mouseX,animation){
		return (mouseX + animation) % 1.0;
	})
	.map(function(i){
		return i; //Math.sqrt(i) * (3.0 - 2.0 * i);
	})
	.combine(Supermove.resize)
	.map(function(data){
		var time = data[0];
		var size = data[1];
		return ['Incremental Rotation','Fixed Rotation','Relative Rotation to #1','Trigger Animation']
			.map(function(text,id){
			return {
				id:id + 1,
				element: '.text',
				show: true,
				width: 200,
				height: 20,
				x: time * size[0] - 100,
				y: size[1] * 0.5 + ((id - 1.5) * 50),
				content: text
			};
		});
	})
	.flatten()
	.onValue(move.render);

Supermove.button(move,1).onValue(move.render);
Supermove.button(move,2).onValue(move.render);
Supermove.button(move,3).onValue(move.render);
Supermove.button(move,4).onValue(move.render);

// rotation incremental
var click1 = move.event('click','#1')
	.map(function(){
		console.log(move.spec(1).rotateY,move.spec(1).rotateY + Math.PI * 0.25)
		return Supermove.tween(
			{id:1,rotateY: move.spec(1).rotateY, behavior:'onclick'},
			{     rotateY: move.spec(1).rotateY + Math.PI * 0.25 }
		);
	})
	.flatMapLatest(function(tween){
		console.log(tween(1));
		return Supermove.animate(500).map(tween);
	})
	.onValue(move.render);

// rotation fixed from 0 ... PI
var click2 = move.event('click','#2')
	.flatMapLatest(function(){
		return Supermove.animate(1000);
	})
    .map(Supermove.tween(
		{id:2,rotateY: 0, behavior:'onclick'},
		{id:2,rotateY: 0.2 * Math.PI}
	))
	.onValue(move.render);

// rotation relative to #1
var click3 = move.event('click','#3')
	.map(function(){
		return Supermove.tween(
			{id:3,rotateY: move.spec(3).rotateY, behavior:'onclick'},
			{id:3,rotateY: move.spec(1).rotateY}
		);
	})
	.flatMapLatest(function(tween){
		return Supermove.animate(500).map(tween);
	})
	.onValue(move.render);

var click4 = move.event('click','#4')
	.onValue(function(){
		animator.emit(1000);
	});


animator.emit(1000);
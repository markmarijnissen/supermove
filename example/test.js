var move = new Supermove(document.body,10);

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
				width: '200px',
				height: '20px',
				x: time * size[0] - 100,
				y: size[1] * 0.5 + ((id - 1.5) * 50),
				content: text
			};
		});
	})
	.flatten();

move.subscribe(1,buttons);
move.subscribe(2,buttons);
move.subscribe(3,buttons);
move.subscribe(4,buttons);

move.subscribe(1,Button(move,1));
move.subscribe(2,Button(move,2));
move.subscribe(3,Button(move,3));
move.subscribe(4,Button(move,4));

// rotation incremental
var click1 = move.event('click','#1')
	.map(function(){
		return Supermove.tween(
			{id:1,rotateY: move.element(1).rotateY},
			{id:1,rotateY: move.element(1).rotateY + Math.PI * 0.25 }
		);
	})
	.flatMapLatest(function(tween){
		return Supermove.animate(500).map(tween);
	});
move.subscribe(1,click1);


// rotation fixed from 0 ... PI
var click2 = move.event('click','#2')
	.flatMapLatest(function(){
		return Supermove.animate(1000);
	})
    .map(Supermove.tween(
		{id:2,rotateY: 0},
		{id:2,rotateY: 0.2 * Math.PI}
	));
move.subscribe(2,click2);

// rotation relative to #1
var click3 = move.event('click','#3')
	.map(function(){
		return Supermove.tween(
			{id:3,rotateY: move.element(3).rotateY},
			{id:3,rotateY: move.element(1).rotateY}
		);
	})
	.flatMapLatest(function(tween){
		return Supermove.animate(500).map(tween);
	});

move.subscribe(3,click3);

var click4 = move.event('click','#4')
	.onValue(function(){
		animator.emit(1000);
	});


animator.emit(1000);
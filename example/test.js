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


Kefir.combine([mouseX,animation],function(mouseX,animation){
		return (mouseX + animation) % 1.0;
	})
	.map(function(i){
		return i; //Math.sqrt(i) * (3.0 - 2.0 * i);
	})
	.combine(Supermove.resize)
	.map(function(data){
		var time = data[0];
		var size = data[1];
		return ['Bit-by-bit','Always Flip','Match bit-by-bit','Everybody']
			.map(function(text,id){
			return {
				id:id + 1,
				element: '.text',
				show: true,
				width: '200px',
				height: '20px',
				//rotateZ:(Math.round(time * 2 * Math.PI * 1000) / 1000) % (2 * Math.PI),
				x:size[0] * 0.5,
				y: size[1] * 0.5 + ((id - 1.5) * 50),
				scale: [0.5 + 2*time,0.5 + 2*time,1],
				//z: (Math.round(i * 200) / 1000) % 500,
				content: text
			};
		});
	})
	.flatten()
	.onValue(move.render);

// rotation incremental
move.event('click','#1')
	.flatMapLatest(function(){
		return Supermove.animate(500);
	})
	.map(function(){
		return {
			id: 1,
			rotateY: Math.PI * 0.01
		};
	})
	.onValue(move.inc);

// rotation fixed from 0 ... PI
move.event('click','#2')
	.flatMapLatest(function(){
		return Supermove.animate(500);
	})
    .map(Supermove.tween(
		{id:2,rotateY: 0},
		{id:2,rotateY: Math.PI}
	))
	.onValue(move.render);

// rotation relative to #1
move.event('click','#3')
	.map(function(){
		var start = move.element(3).rotateY;
		var end = move.element(1).rotateY;
		return Supermove.tween(
			{id:3,rotateY: start},
			{id:3,rotateY: end}
		);
	})
	.flatMapLatest(function(tween){
		return Supermove.animate(500).map(tween);
	})
	.onValue(move.render);

move.event('click','#4')
	.onValue(function(){
		animator.emit(1000);
	});


animator.emit(1000);
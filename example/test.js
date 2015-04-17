var move = new Supermove(document.body,{cache: 10});

var animator = Kefir.emitter();
var animation = animator.flatMapLatest(function(duration){
		return Supermove.animate(duration);
	});

var mouseX = Supermove.event('mousemove')
	.merge(Kefir.constant({pageX: 0}))
	.combine(Supermove.resize)
	.map(function(data){
		return data[0].pageX / data[1][0];
	})
	.onValue(m.redraw);

Kefir.combine([mouseX,animation],function(mouseX,animation){
		return (mouseX + animation) % 1.0;
	})
	.combine(Supermove.resize)
	.map(function(data){
		var time = data[0];
		var size = data[1];
		return {
			id: 'page',
			behavior: 'animation',
			x: size[0] * (time - 1),
			width: 1,
			height: 1
		};
	})
	.onValue(Supermove.update);
	
Supermove.resize
	// whyy...?
	.merge(Kefir.later(0,[window.innerWidth,window.innerHeight]))
	.map(function(size){
		return ['Incremental Rotation','Fixed Rotation','Relative Rotation to #1','Trigger Animation']
			.map(function(text,id){
			return {
				id:'btn' +(id + 1),
				parent:'page',
				element: '.text',
				show: true,
				width: 200,
				height: 20,
				x: size[0] - 100,
				y: size[1] * 0.5 + ((id - 1.5) * 50),
				content: text
			};
		});
	})
	.flatten()
	.onValue(Supermove.update);

Supermove.update({
	id:'page',
	show: true
});

Supermove.button('btn1');
Supermove.button('btn2');
Supermove.button('btn3');
Supermove.button('btn4');

// rotation incremental
var click1 = Supermove.event('click','#btn1')
	.map(function(){
		return Supermove.tween(
			{id:'btn1',rotateY: Supermove.spec('btn1').rotateY, behavior:'onclick'},
			{     rotateY: Supermove.spec('btn1').rotateY + Math.PI * 0.25 }
		);
	})
	.flatMapLatest(function(tween){
		return Supermove.animate(500).map(tween);
	})
	.onValue(Supermove.update);

// rotation fixed from 0 ... PI
var click2 = Supermove.event('click','#btn2')
	.flatMapLatest(function(){
		return Supermove.animate(1000);
	})
    .map(Supermove.tween(
		{id:'btn2',rotateY: 0, behavior:'onclick'},
		{id:'btn2',rotateY: 0.2 * Math.PI}
	))
	.onValue(Supermove.update);

// rotation relative to #1
var click3 = Supermove.event('click','#btn3')
	.map(function(){
		return Supermove.tween(
			{id:'btn3',rotateY: Supermove.spec('btn3').rotateY, behavior:'onclick'},
			{id:'btn3',rotateY: Supermove.spec('btn1').rotateY}
		);
	})
	.flatMapLatest(function(tween){
		return Supermove.animate(500).map(tween);
	})
	.onValue(Supermove.update);

var click4 = Supermove.event('click','#btn4')
	.onValue(function(){
		animator.emit(1000);
	});


animator.emit(1000);
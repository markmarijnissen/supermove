webpackJsonp([0],[function(e,n,t){function o(e,n){function t(){return!1}function o(){return!0}function u(e){return Supermove.animate(100).map(function(n){return e?n:1-n})}var c="#"+n,a=!0,m=r.constant(!1).merge(e.event("click",c)).map(function(){return a=!a,a?{element:".selected",content:" (ON)"}:{content:" (OFF)"}}),i=r.constant(!1).merge(e.event("mouseover",c).map(o)).merge(e.event("mouseout",c).map(t)),p=i.map(function(e){return e?{element:".hover"}:null}),s=i.debounce(100).flatMapLatest(u).map(Supermove.tween({scaleX:0,scaleY:0},{scaleX:.5,scaleY:.5}));r.combine([r.constant({id:n,behavior:"button"}),s,p,m],Supermove.combine).onValue(e.render)}var r=t(10);Supermove.button=o,e.exports=o}]);
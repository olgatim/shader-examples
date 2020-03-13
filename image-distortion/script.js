window.onload = function() {
  var running = 0;

document.querySelector('body').addEventListener('click', function(){
  if(!running){
    running = 1;
    
var tl = new TimelineMax();
tl
	.to(displacementFilter.scale, 0.5, {y:100,x: 0.1})
	.to(displacementFilter.scale, 0.5, {y:0.1,x:0.1})
  .call(function(){
    running = 0;
    img2 = [img1, img1 = img2][0];
  });
	tl
		.to(img2, 0.5, {alpha: 1},0.5)
    .to(img1,0.4,{alpha: 0},0.6)
	tl
		.fromTo(img2.scale, 0.5, 
			{y:img2.scale.y*1.2},
			{y:img2.scale.y},0.5)
  }
});

// PIXI INIT STAGE
var renderer = new PIXI.Application(500, 500, {backgroundColor : 0x000000});
renderer.view.width = 500;
renderer.view.height = 500;
document.getElementById("pixi").appendChild(renderer.view);
var container = new PIXI.Container();
renderer.stage.addChild(container);
// render image
var img1 = PIXI.Sprite.fromImage('./cat1.jpg');
	img1.width = 500;
	img1.height = 500;
	img1.position.x = 0;
	img1.position.y = 0;
	container.addChild(img1);

// render second image
var img2 = PIXI.Sprite.fromImage('./cat2.jpg');
	img2.width = 500;
	img2.height = 500;
	img2.position.x = 0;
	img2.position.y = 0;
	img2.alpha = 0;
	container.addChild(img2);

// add Filters
var disSprite = PIXI.Sprite.fromImage('./map6.jpg');
disSprite.width = 500;
disSprite.height = 500;
var displacementFilter = new PIXI.filters.DisplacementFilter(disSprite);
displacementFilter.scale.set(0.1);
container.addChild(disSprite);
container.filters = [displacementFilter];

function draw(){
	renderer.render(renderer.stage);
	window.requestAnimationFrame(draw);
}
draw();
}

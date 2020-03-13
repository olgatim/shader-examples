const canvas = document.getElementById('canvas');

const ctx = canvas.getContext("2d");

const img = new Image();
img.src = './cat3.jpeg';

const mask = new Image();
mask.src = './nature-sprite.png';

let i = 0;
function draw() {
  i++;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(mask, -i*canvas.width, 0, canvas.width * 23, canvas.height)

  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(img, 0, 0, 600, 600);
  ctx.globalCompositeOperation = 'source-over';

  // window.requestAnimationFrame(draw);
  setTimeout(draw, 200);
}

draw();
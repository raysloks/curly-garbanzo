let sprites = [];

let ship_image = new Image();
ship_image.src = "./Ship_base.png";

function resize() {
    let width = ctx.canvas.clientWidth;
    let height = ctx.canvas.clientHeight;

    if (ctx.canvas.width !== width ||
        ctx.canvas.height !== height) {

        ctx.canvas.width = width;
        ctx.canvas.height = height;
    }
}

function render() {
    resize();

    let width = ctx.canvas.width;
    let height = ctx.canvas.height;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.translate(width / 2, height / 2);
    ctx.scale(height / 500, height / 500);

    ctx.translate(-player.x, -player.y);

    ctx.drawImage(ship_image, -305, -195);
    ctx.strokeRect(70, -120, 100, 100);
    ctx.strokeRect(70, -20, 100, 180);
    ctx.strokeRect(-80, -120, 150, 280);
    ctx.strokeRect(170, -35, 150, 110);
    ctx.strokeRect(-230, -35, 150, 110);
    ctx.strokeRect(-230, 75, 150, 85);
    ctx.strokeRect(-230, -120, 150, 85);

    for (let sprite of sprites) {
        ctx.drawImage(sprite.image, sprite.x - sprite.w / 2, sprite.y - sprite.h / 2, sprite.w, sprite.h);
    }
}

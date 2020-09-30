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

function Sprite(image, x, y, w, h, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.image = new Image();
    this.image.src = image;
    this.w = w || 1;
    this.h = h || 1;
    this.rotation = 0;
}

let camera_scale = 1;
let camera_rotation = 0;

function render() {
    resize();

    let width = ctx.canvas.width;
    let height = ctx.canvas.height;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.translate(width / 2, height / 2);
    ctx.scale(height / 16, height / 16);

    ctx.scale(1 / camera_scale, 1 / camera_scale);
    ctx.rotate(camera_rotation);

    ctx.translate(-player.x, -player.y);

    sprites.sort((a, b) => a.y - b.y + (a.z || 0) - (b.z || 0));
    for (let sprite of sprites) {
        if (sprite.image) {
            ctx.save();
            ctx.translate(sprite.x, sprite.y);
            ctx.rotate(sprite.rotation);
            ctx.drawImage(sprite.image, -sprite.w / 2, -sprite.h / 2, sprite.w, sprite.h);
            ctx.restore();
        }
        if (sprite.text) {
            ctx.save();
            ctx.translate(sprite.x, sprite.y);
            ctx.rotate(sprite.rotation);
            ctx.font = sprite.font || "sans";
            ctx.textAlign = sprite.align || "left";
            ctx.fillStyle = sprite.color || "black";
            ctx.fillText(sprite.text, 0, 0);
            ctx.restore();
        }
    }

    if (game_over && camera_scale > 1) {
        ctx.font = "96px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "cyan";
        ctx.fillText("Game Over", 0, -100);
        ctx.fillText("Thanks for playing!", 0, 100);
    }
}

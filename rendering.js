
function resize() {
    let width = ctx.canvas.clientWidth;
    let height = ctx.canvas.clientHeight;

    if (ctx.canvas.width !== width ||
        ctx.canvas.height !== height) {

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        ctx.translate(width / 2, height / 2);
        ctx.scale(height / 1000, height / 1000);
    }
}

function render() {
    resize();
    ship_image = new Image();
    ship_image.src = "ship_base.png";

    ctx.drawImage(ship_image, -305, -195);
    ctx.strokeRect(70, -120, 100, 100);
    ctx.strokeRect(70, -20, 100, 180);
    ctx.strokeRect(-80, -120, 150, 280);
    ctx.strokeRect(170, -35, 150, 110);
    ctx.strokeRect(-230, -35, 150, 110);
    ctx.strokeRect(-230, 75, 150, 85);
    ctx.strokeRect(-230, -120, 150, 85);

}

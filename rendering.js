
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

    ctx.strokeRect(0, -120, 100, 100);
    ctx.strokeRect(0, -20, 100, 180);
    ctx.strokeRect(-150, -120, 150, 280);
    ctx.strokeRect(100, -35, 150, 110);
    ctx.strokeRect(-300, -35, 150, 110);
    ctx.strokeRect(-300, 75, 150, 85);
    ctx.strokeRect(-300, -120, 150, 85);
}


function resize() {
    let width = ctx.canvas.clientWidth;
    let height = ctx.canvas.clientHeight;

    if (ctx.canvas.width !== width ||
        ctx.canvas.height !== height) {

        ctx.canvas.width = width;
        ctx.canvas.height = height;

        ctx.translate(width / 2, height / 2);
        ctx.scale(1000 / height, 1000 / height);
    }
}

function render() {
    resize();
    ctx.strokeRect(0, 0, 150, 110);
}

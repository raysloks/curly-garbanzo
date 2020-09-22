let ctx;
let last;

function init() {
    let canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");

    requestAnimationFrame(onframe);
    last = performance.now();
}

function onframe(time) {
    let delta = time - last;
    delta = Math.min(33, delta);

    render();

    setTimeout(tick, 0);
    requestAnimationFrame(onframe);
}

function tick() {

}

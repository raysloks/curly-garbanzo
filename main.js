let ctx;
let last;
let processor;

function init() {
    let canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");

    requestAnimationFrame(onframe);
    last = performance.now();

    processor = new VirtualMachine();
}

function onframe(time) {
    let delta = time - last;
    last = time;
    delta = Math.min(33, delta);

    render();

    setTimeout(() => tick(delta), 0);
    requestAnimationFrame(onframe);
}

let accumulator = 0;
let cycle_length = 16;

function tick(delta) {
    accumulator += delta;
    while (accumulator >= cycle_length) {
        processor.cycle();
        accumulator -= cycle_length;
    }
}

function oncompile() {
    processor.program = compile(document.getElementById("code").value);
    processor.ip = 0;
}

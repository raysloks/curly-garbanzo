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
        refresh_variables();
        accumulator -= cycle_length;
    }
}

function oncompile() {
    processor.program = compile(document.getElementById("code").value);
    processor.ip = 0;
}

function refresh_variables() {
    let table = document.getElementById("variables_table");
    while (table.rows.length < Object.keys(processor.variables).length) {
        let row = table.insertRow(-1);
        row.insertCell(0);
        row.insertCell(1);
    }
    let index = 0;
    for (let variable in processor.variables) {
        let row = table.rows[index];
        row.cells[0].innerHTML = variable;
        row.cells[1].innerHTML = processor.variables[variable];
        ++index;
    }
}

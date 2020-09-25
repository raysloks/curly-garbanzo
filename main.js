let ctx;
let last;
let processor;
let player;
let pressedKeys = {};
let vms = [];
let code_container;

function init() {
    let canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");

    code_container = document.getElementById("code_container");

    requestAnimationFrame(onframe);
    last = performance.now();

    sprites.push(new Processor(-32, -64));
    sprites.push(new Processor(-128, 32, "out0 = in0 + in1;", [new ConstantInput(10), new ConstantInput(12)]));

    player = new Player();

    sprites.push(player);

    window.onkeyup = function (e) { pressedKeys[e.key] = false; }
    window.onkeydown = function (e) { pressedKeys[e.key] = true; }
}

function Processor(x, y, code, inputs) {
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "processor.png";
    this.w = 32;
    this.h = 32;
    this.vm = new VirtualMachine(inputs);
    vms.push(this.vm);
    this.code = code || "";

    this.vm.program = compile(this.code);
    this.vm.ip = 0;
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
        for (let vm of vms) {
            vm.refresh_inputs();
        }
        for (let vm of vms) {
            vm.cycle();
        }
        refresh_variables();
        accumulator -= cycle_length;
    }

    if (document.activeElement !== document.getElementById("code")) {
        let speed = 0.1;
        if (pressedKeys["w"])
            player.y -= speed * delta;
        if (pressedKeys["a"])
            player.x -= speed * delta;
        if (pressedKeys["s"])
            player.y += speed * delta;
        if (pressedKeys["d"])
            player.x += speed * delta;
    }

    let closest_processor = null;
    for (let sprite of sprites) {
        if (sprite.vm) {
            let dx = sprite.x - player.x;
            let dy = sprite.y - player.y;
            if (dx * dx + dy * dy < 1024) {
                closest_processor = sprite;
            }
        }
    }
    set_open_compiler(closest_processor);
}

function oncodechanged() {
    processor.code = document.getElementById("code").value;
}

function oncompile() {
    processor.vm.program = compile(processor.code);
    processor.vm.ip = 0;
}

function refresh_variables() {
    if (processor !== null) {
        let table = document.getElementById("variables_table");
        while (table.rows.length < Object.keys(processor.vm.variables).length) {
            let row = table.insertRow(-1);
            row.insertCell(0);
            row.insertCell(1);
        }
        let index = 0;
        for (let variable in processor.vm.variables) {
            let row = table.rows[index];
            if (row.cells[0].innerHTML != variable)
                row.cells[0].innerHTML = variable;
            if (row.cells[1].innerHTML != processor.vm.variables[variable])
                row.cells[1].innerHTML = processor.vm.variables[variable];
            ++index;
        }
        for (; index < table.rows.length; ++index) {
            let row = table.rows[index];
            if (row.cells[0].innerHTML != "")
                row.cells[0].innerHTML = "";
            if (row.cells[1].innerHTML != "")
                row.cells[1].innerHTML = "";
        }
    }
}

function set_open_compiler(proc) {
    if (processor !== proc) {
        processor = proc;
        if (proc) {
            refresh_variables();
            code_container.style.display = "block";
            document.getElementById("code").value = processor.code;
        } else {
            code_container.style.display = "none";
        }
    }
}

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

    createSprites();

    {
        let processor = new Processor(-1, -3.5, "out0 = in0 - 2;", [new ClearanceInput({ x: 0.5, y: -3.5 }, 0.75)]);
        sprites.push(processor);
        let door = new Door(0, -4, new OutputInput(processor, 0));
        sprites.push(door);
        hints.push(new Hint("You need to open that door. Hack the microchip and change its output.", "out0 = 1;", [{ x: -1, y: -3.5 }], function () {
            if (door.open > 0)
                this.getPriority = function () { return 0; };
            return 1000;
        }));
    }

    {
        let processor = new Processor(-5.5, -7.5, "out0 = in0 + in1 - 6;", [new ClearanceInput({ x: -6.5, y: -5 }, 1.5), new ClearanceInput({ x: -6.5, y: -7 }, 1.5)]);
        sprites.push(processor);
        let door = new DoorVertical(-7, -6, new OutputInput(processor, 0));
        sprites.push(door);
        hints.push(new Hint("Good job!", "", [], function () {
            return 10;
        }));
    }

    player = new Player();

    sprites.push(player);

    window.onkeyup = function (e) { pressedKeys[e.key] = false; }
    window.onkeydown = function (e) { pressedKeys[e.key] = true; }
}

function Processor(x, y, code, inputs) {
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "./processor.png";
    this.w = 1;
    this.h = 1;
    this.rotation = 0;
    this.vm = new VirtualMachine(inputs);
    vms.push(this.vm);
    this.code = code || "";

    this.vm.program = compile(this.code);
    this.vm.ip = 0;

    this.accumulator = 0;
    this.image_alt = new Image();
    this.image_alt.src = "./processor_frame.png";

    this.tick = function (delta) {
        this.accumulator += delta;
        if (this.accumulator > 1000) {
            this.accumulator -= 1000;
            let tmp = this.image_alt;
            this.image_alt = this.image;
            this.image = tmp;
        }
    }
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

    for (let sprite of sprites) {
        if (sprite.tick) {
            sprite.tick(delta);
        }
    }

    let closest_processor = null;
    for (let sprite of sprites) {
        if (sprite.vm) {
            let dx = sprite.x - player.x;
            let dy = sprite.y - player.y;
            if (dx * dx + dy * dy < 1) {
                closest_processor = sprite;
            }
        }
    }
    set_open_compiler(closest_processor);

    updateHint();
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
            if (row.cells[0].innerHTML !== variable.toString())
                row.cells[0].innerHTML = variable;
            if (row.cells[1].innerHTML !== processor.vm.variables[variable].toString())
                row.cells[1].innerHTML = processor.vm.variables[variable];
            ++index;
        }
        for (; index < table.rows.length; ++index) {
            let row = table.rows[index];
            if (row.cells[0].innerHTML !== "")
                row.cells[0].innerHTML = "";
            if (row.cells[1].innerHTML !== "")
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

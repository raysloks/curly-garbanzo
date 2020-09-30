let ctx;
let last;
let processor;
let player;
let pressedKeys = {};
let vms = [];
let code_container;
let game_over = false;

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
        hints.push(new Hint("You need to open that door. Hack the microchip and change its output.\n\n" + 
            "Outputting a value larger than 0 will open the door.", "out0 = 1;", [{ x: -1, y: -3.5 }], function () {
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
        hints.push(new Hint("Well done! I need you to enter the reactor, and restart it.", "", [{ x: -5.5, y: -7.5 }], function () {
            if (door.open > 0)
                this.getPriority = function () { return 0; };
            return 999;
        }));
    }

    let reactor;
    {
        let temp_input = {};
        let processor = new Processor(-10, -4.5, "", [temp_input]);
        sprites.push(processor);
        reactor = new Reactor(-11.5, -6.5, new OutputInput(processor, 0));
        sprites.push(reactor);
        sprites.push(new ReactorTemperature(-10.75, -4.25, reactor));
        temp_input.get = function () {
            return reactor.temp;
        }
        hints.push(new Hint("The reactor's control panel has been fried. " +
            "You need to fix it. Keep its temperature between 500\xB0C and 9000\xB0C for 10 seconds and I'll call it a success.\n\n" +
            "The input is the current temperature of the reactor.\n" +
            "The output controls the % of neutrons allowed to keep reacting.\n\n" +
            "The higher the temperature, the lower the output must be!", "", [{ x: -10, y: -4.5 }], function () {
                if (reactor.power > 10000)
                    this.getPriority = function () { return 0; };
                return 998;
            }
        ));
        hints.push(new Hint("Yes! The reactor is stable! Now head to the engines.", "", [{ x: -1.5, y: 2.5 }], function () {
            if (this.active) {
                if (player.y > 1.5)
                    this.getPriority = function () { return 0; };
            }
            return 997;
        }));
    }

    //let fc;
    //{
    //    fc = new Processor(13.5, 1.5, "", []);
    //    sprites.push(fc);
    //}

    {
        let processor = new Processor(-11, 3.5, "out1 = 0;", [/*new OutputInput(fc, 0), new OutputInput(fc, 1)*/]);

        let engine0 = new Engine(-13, 2.5, new OutputInput(processor, 0), reactor);
        let engine1 = new Engine(-13, 4.5, new OutputInput(processor, 1), reactor);
        sprites.push(engine0);
        sprites.push(engine1);
        sprites.push(processor);
        hints.push(new Hint("I need you to activate the engines.", "", [{ x: -11, y: 3.5 }], function () {
            if (engine0.power > 0 && engine1.power > 0)
                this.getPriority = function () { return 0; };
            return 996;
        }));
    }

    {
        hints.push(new Hint("Alright! Head to the cockpit!", "", [{ x: 14, y: 3 }], function () {
            if (this.active && camera_scale > 1) {
                game_over = true;
            }
            return 995;
        }));
    }

    {
        let processor = new Processor(0, 1.5, "out0 = in0 - 1;", [new ClearanceInput({ x: -1.5, y: 1.5 }, 0.75)]);
        sprites.push(processor);
        let door = new Door(-2, 1, new OutputInput(processor, 0));
        sprites.push(door);
    }

    sprites.push(new Cockpit(14, 3));

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

    this.vm.code = this.code;
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
    processor.vm.code = processor.code;
    processor.vm.program = compile(processor.code);
    processor.vm.ip = 0;
}

let button_enabled = true;

function refresh_variables() {
    if (processor !== null) {
        let is_compiled = processor.code === processor.vm.code;
        if (button_enabled === is_compiled) {
            button_enabled = !button_enabled;
            let button = document.getElementById("button");
            button.disabled = !button_enabled;
        }
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
            let value = processor.vm.variables[variable];
            if (value !== undefined)
                value = value.toFixed(2);
            if (row.cells[1].innerHTML !== value)
                row.cells[1].innerHTML = value;
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

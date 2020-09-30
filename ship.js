function Cockpit(x, y) {
    this.x = x;
    this.y = y;
    this.w = 2;
    this.h = 2;
    this.image = new Image();
    this.image.src = "./cockpit.png";
    this.tick = function (delta) {
        let zoom = false;
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        if (dx * dx + dy * dy < 1)
            zoom = true;
        if (zoom) {
            camera_scale += delta * 0.025;
            camera_scale = Math.min(25, camera_scale);
        } else {
            camera_scale -= delta * 0.025;
            camera_scale = Math.max(1, camera_scale);
        }
    };
}

function Engine(x, y, input, reactor) {
    this.x = x;
    this.y = y;
    this.w = 3;
    this.h = 3;
    this.z = -1000;
    this.image = new Image();
    this.image.src = "./engine.png";
    this.jet = new Sprite("./jet.png", x, y);
    this.input = input;
    this.reactor = reactor;
    this.power = 0;
    sprites.push(this.jet);
    this.tick = function (delta) {
        let power = Math.min(1, Math.max(0, this.input.get())) * Math.min(10000, this.reactor.power) / 1000;
        this.power -= power;
        this.power *= Math.exp(Math.log(0.1) / 1000);
        this.power += power;
        this.jet.w = this.power;
        this.jet.x = this.x - this.power / 2 - 1;
    }
}
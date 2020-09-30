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
            camera_scale += delta * 0.05;
            camera_scale = Math.min(50, camera_scale);
        } else {
            camera_scale -= delta * 0.05;
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
}
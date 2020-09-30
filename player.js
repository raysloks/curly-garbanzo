
function Player() {
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = "./player.png";
    this.w = 1;
    this.h = 1;
    this.rotation = 0;
    this.wobble = 0;
    this.moving = 0;
    this.clearance = 2;
    this.tick = function (delta) {

        if (document.activeElement !== document.getElementById("code")) {
            let speed = 0.0025;
            let move = {
                x: 0,
                y: 0
            }
            if (pressedKeys["w"])
                move.y -= 1;
            if (pressedKeys["a"])
                move.x -= 1;
            if (pressedKeys["s"])
                move.y += 1;
            if (pressedKeys["d"])
                move.x += 1;
            let l = Math.sqrt(move.x * move.x + move.y * move.y);
            if (l > 0) {
                move.x /= l;
                move.y /= l;
                move.x *= speed * delta;
                move.y *= speed * delta;

                let p = {
                    x: this.x,
                    y: this.y
                };

                moveOnGrid(p, move);

                this.x = p.x;
                this.y = p.y;

                this.moving += 0.05 * delta;
                this.moving = Math.min(1, this.moving);
            } else {
                this.moving -= 0.05 * delta;
                this.moving = Math.max(0, this.moving);
            }
            this.wobble += 0.025 * delta;
            this.rotation = Math.sqrt(Math.abs(Math.cos(this.wobble))) * Math.sign(Math.cos(this.wobble)) * 0.125 * this.moving;
        }

    }
}
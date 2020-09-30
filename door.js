function Door(x, y, input) {
    this.x0 = x;
    this.y0 = y;
    this.x1 = x;
    this.y1 = y;
    this.x = x + 0.5;
    this.y = y + 0.5;
    this.w = 2;
    this.h = 1;
    this.image = new Image();
    this.image.src = "./door.png";
    this.rotation = 0;
    this.open = 0;
    this.input = input;
    this.tick = function (delta) {
        let open = this.input.get() > 0;
        fillRectangle(this.x0, this.y0, this.x1, this.y1, open);
        let diff = open - this.open;
        this.open += Math.sign(diff) * Math.min(delta * 0.005, Math.abs(diff));
        this.x = this.x0 + 0.5 + this.open * 2;
    };
}

function DoorVertical(x, y, input) {
    this.x0 = x;
    this.y0 = y;
    this.x1 = x;
    this.y1 = y;
    this.x = x + 0.5;
    this.y = y;
    this.w = 1;
    this.h = 2;
    this.image = new Image();
    this.image.src = "./door_vertical.png";
    this.rotation = 0;
    this.open = 0;
    this.input = input;
    this.tick = function (delta) {
        let open = this.input.get() > 0;
        fillRectangle(this.x0, this.y0, this.x1, this.y1, open);
        let diff = open - this.open;
        this.open += Math.sign(diff) * Math.min(delta * 0.005, Math.abs(diff));
        this.y = this.y0 + this.open * 2;
        this.z = -this.open;
    };
}
function Reactor(x, y, input) {
    this.x = x;
    this.y = y;
    this.z = -1000;
    this.w = 6;
    this.h = 6;
    this.image = new Image();
    this.image.src = "./reactor.png";
    this.rotation = 0;
    this.temp = 20;
    this.reaction = 0;
    this.input = input;
    this.accumulator = 0;
    this.cooldown = false;
    this.power = 0;
    this.tick = function (delta) {
        this.accumulator += delta;
        let control = this.input.get();
        while (this.accumulator > 100) {
            this.accumulator -= 100;
            if (this.cooldown)
                control = 0;
            while (Math.random() > 0.8) {
                this.reaction += 2;
                this.temp += 1;
            }
            let reaction = this.reaction;
            this.reaction = 0;
            for (let i = 0; i < reaction; ++i) {
                if (Math.random() < control) {
                    this.reaction += 2;
                    this.temp += 1;
                }
            }
            if (this.temp > 9000)
                this.cooldown = true;
            if (this.temp < 100)
                this.cooldown = false;
            if (this.temp <= 9000 && this.temp >= 500)
                this.power += 100;
            else
                this.power = 0;
            this.temp -= 20;
            this.temp *= 0.95;
            this.temp += 20;
        }
    };
}

function ReactorTemperature(x, y, reactor) {
    this.x = x;
    this.y = y;
    this.text = "";
    this.font = "0.75px Consolas";
    this.align = "right";
    this.color = "orange";
    this.reactor = reactor;
    this.tick = function (delta) {
        this.text = this.reactor.temp.toFixed(0) + "\xB0C";
    };
}
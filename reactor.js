function Reactor(x, y, input) {
    this.x = x;
    this.y = y;
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
            this.temp -= 20;
            this.temp *= 0.95;
            this.temp += 20;
        }
    };
}
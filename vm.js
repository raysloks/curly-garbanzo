function VirtualMachine() {
    this.ip = 0;
    this.sp = 0;
    this.program = [];
    this.stack = new Array(16);
    this.variables = {};

    this.cycle = function () {
        if (this.ip >= this.program.length)
            return;
        let op = this.program[this.ip];
        ++this.ip;
        if (isNaN(op)) {
            switch (op) {
                case "+":
                    --this.sp;
                    this.stack[this.sp - 1] = this.load(this.sp - 1) + this.load(this.sp);
                    break;
                case "-":
                    --this.sp;
                    this.stack[this.sp - 1] = this.load(this.sp - 1) - this.load(this.sp);
                    break;
                case "*":
                    --this.sp;
                    this.stack[this.sp - 1] = this.load(this.sp - 1) * this.load(this.sp);
                    break;
                case "/":
                    --this.sp;
                    this.stack[this.sp - 1] = this.load(this.sp - 1) / this.load(this.sp);
                    break;
                case "=":
                    this.sp -= 2;
                    this.store(this.stack[this.sp], this.load(this.sp + 1));
                    break;
                default:
                    this.stack[this.sp] = op;
                    ++this.sp;
                    break;
            }
        } else {
            this.stack[this.sp] = op;
            ++this.sp;
        }
    }

    this.load = function (location) {
        let xvalue = this.stack[location];
        if (isNaN(xvalue)) {
            return this.variables[xvalue];
        } else {
            return xvalue;
        }
    }

    this.store = function (variable, rvalue) {
        this.variables[variable] = rvalue;
    }
}

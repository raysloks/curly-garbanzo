function ConstantInput(value) {
    this.value = value;
    this.get = function () {
        return this.value;
    }
}

function ClearanceInput(position, range) {
    this.position = position;
    this.range = range * range;
    this.get = function () {
        let clearance = 0;
        let dx = player.x - this.position.x;
        let dy = player.y - this.position.y;
        if (dx * dx + dy * dy < this.range) {
            if (player.clearance > clearance)
                clearance = player.clearance;
        }
        return clearance;
    }
}

function OutputInput(processor, index) {
    this.processor = processor;
    this.index = index;
    this.get = function () {
        return this.processor.vm.variables["out" + this.index] || 0;
    }
}
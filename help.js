
function Hint(text, code, positions, priority) {
    this.text = text;
    this.code = code;
    this.positions = positions;
    this.getPriority = priority;
}

let hints = [];

let arrows = [];

function getMostRelevantHint() {
    hints.sort((a, b) => b.getPriority() - a.getPriority());
    return hints[0];
}

function updateHint() {
    let element = document.getElementById("hint_text");
    let hint = getMostRelevantHint();
    hint.active = true;
    if (element.innerHTML != hint.text)
        element.innerHTML = hint.text;
    while (arrows.length < hint.positions.length) {
        let arrow = new Sprite("./arrow.png", 0, 0, 0.5, 0.5, 100);
        arrows.push(arrow);
        sprites.push(arrow);
    }
    let i = 0;
    for (; i < hint.positions.length; ++i) {
        let dx = hint.positions[i].x - player.x;
        let dy = hint.positions[i].y - player.y;
        arrows[i].x = player.x + dx * 0.5;
        arrows[i].y = player.y + dy * 0.5;
        arrows[i].rotation = Math.atan2(dy, dx);
    }
    for (; i < arrows.length; ++i) {
        arrows[i].x = 10000;
    }
}

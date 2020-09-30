
let grid = {};

function fillRectangle(x0, y0, x1, y2, value) {
    for (let x = x0; x <= x1; ++x) {
        for (let y = y0; y <= y2; ++y) {
            grid[x + "," + y] = value;
        }
    }
}

fillRectangle(-5, -3, 5, 0, 1);

fillRectangle(-6, -7, 7, -5, 1);

fillRectangle(0, -4, 0, -4, 1);

fillRectangle(7, -5, 14, -2, 1);

fillRectangle(-14, -8, -8, -2, 1);
fillRectangle(-14, -8, -10, -5, 0);

fillRectangle(-7, -6, -7, -6, 1);

fillRectangle(-12, 2, 14, 4, 1);
fillRectangle(-12, 3, -6, 3, 0);

fillRectangle(-2, 1, -2, 1, 1);

function checkGrid(x, y) {
    let upper_x = Math.floor(x);
    let upper_y = Math.floor(y);
    let lower_x = Math.ceil(x) - 1;
    let lower_y = Math.ceil(y) - 1;
    return getCell(upper_x, upper_y) ||
        getCell(lower_x, upper_y) ||
        getCell(lower_x, lower_y) ||
        getCell(upper_x, lower_y);
}

function getCell(x, y) {
    return grid[x + "," + y];
}

function moveOnGrid(p, dp) {
    p.x += dp.x;
    if (!checkGrid(p.x, p.y))
        p.x = Math.round(p.x);
    p.y += dp.y;
    if (!checkGrid(p.x, p.y))
        p.y = Math.round(p.y);
}

function createSprites() {

    for (let key in grid) {
        if (!grid[key])
            continue;
        let x, y;
        [x, y] = key.split(",");
        x = parseFloat(x);
        y = parseFloat(y);
        sprites.push(new Sprite("./floor.png", x, y + 0.5, 1, 1, -100));
        if (!getCell(x, y - 1)) {
            if (!getCell(x - 1, y - 1))
                sprites.push(new Sprite("./wall.png", x, y - 1, 1, 2));
            if (!getCell(x + 1, y))
                sprites.push(new Sprite("./wall.png", x + 1, y - 1, 1, 2));
            if (getCell(x + 1, y - 1))
                sprites.push(new Sprite("./wall.png", x + 0.56125, y - 1, 0.125, 2));
            if (getCell(x - 1, y - 1))
                sprites.push(new Sprite("./wall.png", x + 0.43875, y - 1, 0.125, 2));
        }
        if (!getCell(x, y + 1) && !getCell(x, y + 2) && !getCell(x - 1, y + 1) && !getCell(x - 1, y + 2)) {
            sprites.push(new Sprite("./solid.png", x, y + 1.375, 1, 1.25));
            if (!getCell(x + 1, y))
                sprites.push(new Sprite("./solid.png", x + 1, y + 1.375, 1, 1.25));
        }
        if (!getCell(x - 1, y)) {
            if (!getCell(x - 1, y + 1))
                sprites.push(new Sprite("./solid.png", x - 0.43875, y + 0.375, 0.125, 1.25));
            if (!getCell(x - 1, y - 1))
                sprites.push(new Sprite("./solid.png", x - 0.43875, y - 0.625, 0.125, 1.25));
        }
        if (!getCell(x + 1, y)) {
            if (!getCell(x + 1, y + 1))
                sprites.push(new Sprite("./solid.png", x + 1.43875, y + 0.375, 0.125, 1.25));
            if (!getCell(x + 1, y - 1))
                sprites.push(new Sprite("./solid.png", x + 1.43875, y - 0.625, 0.125, 1.25));

            sprites.push(new Sprite("./floor.png", x + 1, y + 0.5, 1, 1, -100));
        }
    }

    //sprites.push(new Sprite("./wall.png", -1, -4, 1, 2));
    //sprites.push(new Sprite("./wall.png", -2, -4, 1, 2));
    //sprites.push(new Sprite("./wall.png", -3, -4, 1, 2));

    //sprites.push(new Sprite("./floor.png", 0, -2.5, 1, 1, -100));
    //sprites.push(new Sprite("./floor.png", -1, -2.5, 1, 1, -100));
    //sprites.push(new Sprite("./floor.png", -2, -2.5, 1, 1, -100));
    //sprites.push(new Sprite("./floor.png", -3, -2.5, 1, 1, -100));
    //sprites.push(new Sprite("./floor.png", 0, -3.5, 1, 1, -100));
}
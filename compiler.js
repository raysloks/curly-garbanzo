function compile(code) {
    return parse_statements(tokenize(code)).flat(Infinity);
}

const regex = /\s*([a-zA-Z_]\w*|\d*\.\d+|\d+|[=+\-*/]=|[=+\-*/()[\]{};])/g;

function tokenize(code) {
    let matches = code.matchAll(regex);
    let tokens = [];
    for (let match of matches) {
        tokens.push(match[1]);
    }
    return tokens;
}

function parse_statements(tokens) {
    let statements = [];

    {
        let start = 0;
        let depth = 0;
        for (let i = 0; i < tokens.length; ++i) {
            if (tokens[i] === "{") {
                if (depth === 0) {
                    start = i;
                }
                ++depth;
            }
            if (tokens[i] === "}") {
                --depth;
                if (depth === 0) {
                    tokens.splice(start, i - start + 1, build_tree(tokens.slice(start + 1, i)));
                    i = start;
                }
            }
        }
    }

    let start = 0;
    let end = tokens.indexOf(";");
    while (end >= 0) {
        statements.push(build_tree(tokens.slice(start, end)));
        start = end + 1;
        end = tokens.indexOf(";", start + 1);
    }

    return statements;
}

function split_tree_rtl(tokens, operators) {

    let index = tokens.findIndex((element) => operators.includes(element));
    if (index === -1)
        return null;
    return [build_tree(tokens.slice(0, index)), build_tree(tokens.slice(index + 1)), tokens[index]];
}

function split_tree_ltr(tokens, operators) {

    let index = tokens.slice().reverse().findIndex((element) => operators.includes(element));
    if (index === -1)
        return null;
    index = tokens.length - index - 1;
    return [build_tree(tokens.slice(0, index)), build_tree(tokens.slice(index + 1)), tokens[index]];
}

function build_tree(tokens) {

    let start = 0;
    let depth = 0;
    for (let i = 0; i < tokens.length; ++i) {
        if (tokens[i] === "(") {
            if (depth === 0) {
                start = i;
            }
            ++depth;
        }
        if (tokens[i] === ")") {
            --depth;
            if (depth === 0) {
                tokens.splice(start, i - start + 1, build_tree(tokens.slice(start + 1, i)));
                i = start;
            }
        }
    }

    switch (tokens[0]) {
        case "if":
            break;
        default:
            break;
    }

    let node =
        split_tree_rtl(tokens, ["=", "+=", "-=", "*=", "/="]) ??
        split_tree_ltr(tokens, ["+", "-"]) ??
        split_tree_ltr(tokens, ["*", "/", "%"]) ??
        tokens[0];

    if (typeof node !== "object" && !isNaN(parseFloat(node)))
        return parseFloat(node);

    return node;
}
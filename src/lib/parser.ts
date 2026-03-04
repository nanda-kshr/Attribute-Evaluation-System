export type TokenType = 'NUMBER' | 'PLUS' | 'MINUS' | 'MUL' | 'DIV' | 'LPAREN' | 'RPAREN' | 'EOF';

export interface Token {
    type: TokenType;
    value: string;
}

export interface TreeNode {
    id: string;
    name: string; // Grammar symbol
    value?: number; // Computed attribute
    children: TreeNode[]; // Children
}

export interface EvalStep {
    nodeId: string;
    value: number;
    description: string;
}

export function lex(input: string): Token[] {
    let pos = 0;
    const tokens: Token[] = [];
    while (pos < input.length) {
        const char = input[pos];
        if (/\s/.test(char)) {
            pos++;
            continue;
        }
        if (/\d/.test(char)) {
            let numStr = '';
            while (pos < input.length && /\d/.test(input[pos])) {
                numStr += input[pos];
                pos++;
            }
            tokens.push({ type: 'NUMBER', value: numStr });
            continue;
        }
        switch (char) {
            case '+': tokens.push({ type: 'PLUS', value: '+' }); break;
            case '-': tokens.push({ type: 'MINUS', value: '-' }); break;
            case '*': tokens.push({ type: 'MUL', value: '*' }); break;
            case '/': tokens.push({ type: 'DIV', value: '/' }); break;
            case '(': tokens.push({ type: 'LPAREN', value: '(' }); break;
            case ')': tokens.push({ type: 'RPAREN', value: ')' }); break;
            default: throw new Error(`Lexical Error: Unexpected character '${char}' at position ${pos}`);
        }
        pos++;
    }
    tokens.push({ type: 'EOF', value: 'EOF' });
    return tokens;
}

export function parseAndEvaluate(input: string): { tree: TreeNode, steps: EvalStep[] } {
    if (!input.trim()) throw new Error("Input expression is empty.");

    const tokens = lex(input);
    let idx = 0;
    let nodeIdCounter = 0;

    function nextId() { return `node_${nodeIdCounter++}`; }

    function parseE(): TreeNode {
        let node: TreeNode = { id: nextId(), name: 'E', children: [] };
        let tNode = parseT();
        node.children.push(tNode);

        while (tokens[idx].type === 'PLUS' || tokens[idx].type === 'MINUS') {
            const op = tokens[idx];
            const opNode: TreeNode = { id: nextId(), name: op.value, children: [] };
            idx++;

            // Ensure tree grows appropriately for left-associativity
            let rightT = parseT();
            const newE: TreeNode = { id: nextId(), name: 'E', children: [] };
            newE.children.push(node, opNode, rightT);
            node = newE;
        }
        return node;
    }

    function parseT(): TreeNode {
        let node: TreeNode = { id: nextId(), name: 'T', children: [] };
        let fNode = parseF();
        node.children.push(fNode);

        while (tokens[idx].type === 'MUL' || tokens[idx].type === 'DIV') {
            const op = tokens[idx];
            const opNode: TreeNode = { id: nextId(), name: op.value, children: [] };
            idx++;

            let rightF = parseF();
            const newT: TreeNode = { id: nextId(), name: 'T', children: [] };
            newT.children.push(node, opNode, rightF);
            node = newT;
        }
        return node;
    }

    function parseF(): TreeNode {
        let node: TreeNode = { id: nextId(), name: 'F', children: [] };
        if (tokens[idx].type === 'NUMBER') {
            const numNode: TreeNode = { id: nextId(), name: tokens[idx].value, value: parseFloat(tokens[idx].value), children: [] };
            idx++;
            node.children.push(numNode);
        } else if (tokens[idx].type === 'LPAREN') {
            const lParen: TreeNode = { id: nextId(), name: '(', children: [] };
            idx++;
            const eNode = parseE();
            if (tokens[idx].type !== 'RPAREN') throw new Error("Syntax Error: Expected ')'");
            const rParen: TreeNode = { id: nextId(), name: ')', children: [] };
            idx++;
            node.children.push(lParen, eNode, rParen);
        } else {
            throw new Error(`Syntax Error: Unexpected token '${tokens[idx].value}'`);
        }
        return node;
    }

    const tree = parseE();
    if (tokens[idx].type !== 'EOF') {
        throw new Error("Syntax Error: Unexpected trailing characters");
    }

    const steps: EvalStep[] = [];
    function evaluate(node: TreeNode): number {
        if (node.children.length === 0) {
            if (node.value !== undefined) {
                steps.push({ nodeId: node.id, value: node.value, description: `Lexical value = ${node.value}` });
                return node.value;
            }
            return 0; // ops
        }

        if (node.name === 'F') {
            if (node.children.length === 1) { // number
                const val = evaluate(node.children[0]);
                node.value = val;
                steps.push({ nodeId: node.id, value: val, description: `F.val = ${val}` });
                return val;
            } else if (node.children.length === 3) { // ( E )
                const val = evaluate(node.children[1]);
                node.value = val;
                steps.push({ nodeId: node.id, value: val, description: `F.val = E.val (${val})` });
                return val;
            }
        } else if (node.name === 'T') {
            if (node.children.length === 1) { // F
                const val = evaluate(node.children[0]);
                node.value = val;
                steps.push({ nodeId: node.id, value: val, description: `T.val = F.val = ${val}` });
                return val;
            } else if (node.children.length === 3) { // T * F ...
                const left = evaluate(node.children[0]);
                const right = evaluate(node.children[2]);
                const op = node.children[1].name;
                const val = op === '*' ? left * right : left / right;
                node.value = val;
                steps.push({ nodeId: node.id, value: val, description: `T.val = ${left} ${op} ${right} = ${val}` });
                return val;
            }
        } else if (node.name === 'E') {
            if (node.children.length === 1) { // T
                const val = evaluate(node.children[0]);
                node.value = val;
                steps.push({ nodeId: node.id, value: val, description: `E.val = T.val = ${val}` });
                return val;
            } else if (node.children.length === 3) { // E + T ...
                const left = evaluate(node.children[0]);
                const right = evaluate(node.children[2]);
                const op = node.children[1].name;
                const val = op === '+' ? left + right : left - right;
                node.value = val;
                steps.push({ nodeId: node.id, value: val, description: `E.val = ${left} ${op} ${right} = ${val}` });
                return val;
            }
        }
        return 0;
    }

    evaluate(tree);

    // The root node (E) gets the final answer
    if (tree.value !== undefined) {
        steps.push({ nodeId: tree.id, value: tree.value, description: `Final valid expression: ${tree.value}` });
    }

    return { tree, steps };
}

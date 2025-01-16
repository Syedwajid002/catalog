const fs = require('fs')

function decodeBase(value, base) {
    return parseInt(value, base);
}

function gaussianElimination(matrix, vector) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(matrix[j][i]) > Math.abs(matrix[maxRow][i])) {
                maxRow = j;
            }
        }

        [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
        [vector[i], vector[maxRow]] = [vector[maxRow], vector[i]];

        for (let j = i + 1; j < n; j++) {
            let factor = matrix[j][i] / matrix[i][i];
            for (let k = i; k < n; k++) {
                matrix[j][k] -= matrix[i][k] * factor;
            }
            vector[j] -= vector[i] * factor;
        }
    }

    let solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = vector[i] / matrix[i][i];
        for (let j = i - 1; j >= 0; j--) {
            vector[j] -= matrix[j][i] * solution[i];
        }
    }

    return solution;
}

function createPolynomialSystem(roots) {
    const k = roots.length;
    const matrix = [];
    const vector = [];

    for (let i = 0; i < k; i++) {
        const row = [];
        for (let j = 0; j < k; j++) {
            row.push(Math.pow(roots[i].x, k - j - 1));
        }
        matrix.push(row);
        vector.push(roots[i].y);
    }

    return { matrix, vector };
}

function findSecret(input) {
    const k = input.keys.k; 
    const roots = [];

    // Step 1: Decode the roots
    for (const key in input) {
        if (key === 'keys') continue; 
        const base = parseInt(input[key].base);
        const value = input[key].value;
        const x = parseInt(key);
        const y = decodeBase(value, base);
        roots.push({ x, y });
    }

    const { matrix, vector } = createPolynomialSystem(roots);

    const solution = gaussianElimination(matrix, vector);

    return solution[solution.length - 1];
}

const inputFile = "testcase1.json";

fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const jsonData = JSON.parse(data);
const secret = findSecret(jsonData);
console.log("Secret constant c: ", secret);

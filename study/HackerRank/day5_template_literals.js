function sides(literals, ...expressions) {
    const [A, P] = expressions.map(item => item);
    const s1 = (Number(P) + Math.sqrt(Math.pow(Number(P), 2) - (16 * Number(A))))/4;
    const s2 = (P - Math.sqrt(Math.pow(P, 2) - (16 * A)))/4;
    return [s1, s2].sort();
}


function main() {
    let s1 = +(readLine());
    let s2 = +(readLine());

    [s1, s2] = [s1, s2].sort();

    const [x, y] = sides`The area is: ${s1 * s2}.\nThe perimeter is: ${2 * (s1 + s2)}.`;

    console.log((s1 === x) ? s1 : -1);
    console.log((s2 === y) ? s2 : -1);
}

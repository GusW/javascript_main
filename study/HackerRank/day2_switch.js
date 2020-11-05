const getLetter= s => {
    let letter;
    const firstLetter = String(s.slice(0,1));
    const A =  new Set(['a', 'e', 'i', 'o', 'u']);
    const B =  new Set(['b', 'c', 'd', 'f', 'g']);
    const C =  new Set(['h', 'j', 'k', 'l', 'm']);
    switch(true){
        case(A.has(firstLetter)):
            letter = "A";
            break;
        case(B.has(firstLetter)):
            letter = "B";
            break;
        case(C.has(firstLetter)):
            letter = "C";
            break;
        default:
            letter = "D";
            break;
    }

    return letter;
}

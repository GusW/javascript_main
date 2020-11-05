const vowelsAndConsonants = s => {
    const vowels = new Set(['a','e', 'i', 'o', 'u']);
    let consonants = new Array();
    s.split("").map(letter =>{
        if(vowels.has(letter)==true){
            console.log(letter);
        } else {
            consonants.push(letter);
        }
    })
    consonants.map(letter => {
        console.log(letter);
    })
}

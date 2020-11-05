const factorial = (n, res = 1) =>{
    const numberN = Number(n);
    let numberRes = res;
    if(numberN===1){
        return numberRes;
    }
    numberRes *= numberN;
    return factorial(numberN - 1, numberRes);
}


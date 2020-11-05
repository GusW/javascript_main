function isPositive(a) {
    switch(true){
        case (a>0):
            return 'YES';
            break;
        case (a===0):
            throw Error('Zero Error');
            break;
        case (a<0):
            throw Error('Negative Error');
            break;
    }
}

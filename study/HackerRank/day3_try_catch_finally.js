function reverseString(s) {
    let res = String();
    try {
        let resArray = s.split("");
        res = resArray.reverse().join('');
    } catch (err){
        res = s;
        console.log(err.message);
    } finally {
        console.log(res);
    };
}


function main() {
    const s = eval(readLine());

    reverseString(s);
}

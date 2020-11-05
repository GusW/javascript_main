const modifyArray = nums => {
    return nums.map(item => {
        switch (true) {
            case(Number(item) % 2 === 0):
                return Number(item) * 2;
                break;
            default:
                return Number(item) * 3;
                break;
        };
    });
}


function main() {
    const n = +(readLine());
    const a = readLine().split(' ').map(Number);

    console.log(modifyArray(a).toString().split(',').join(' '));
}

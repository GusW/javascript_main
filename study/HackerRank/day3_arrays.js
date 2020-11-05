function getSecondLargest(nums) {
    let setNums = new Set(nums);
    const maxNum = Math.max(...setNums);
    setNums.delete(maxNum);
    return Math.max(...setNums);
}

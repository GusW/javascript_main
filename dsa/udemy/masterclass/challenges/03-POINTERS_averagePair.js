function averagePair(nums, target) {
  target *= 2
  let [left, right] = [0, nums.length - 1]
  while (left < right) {
    if (nums[left] + nums[right] === target) return true
    else if (nums[left] + nums[right] < target) left++
    else right--
  }
  return false
}

averagePair([1, 2, 3], 2.5)
averagePair([], 4)

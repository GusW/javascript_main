function maxSubarraySum(nums, len) {
  if (len > nums.length) return null
  if (len === nums.length) return nums.reduce((acc, curr) => acc + curr, 0)

  let [left, right] = [0, 1]
  let currSum = nums[0] + nums[1]
  let maxSum = 0
  while (right < len - 1) {
    right++
    currSum += nums[right]
  }
  while (right < nums.length - 1) {
    right++
    currSum += nums[right] - nums[left]
    maxSum = Math.max(maxSum, currSum)
    left++
  }
  return maxSum
}

maxSubarraySum([100, 200, 300, 400], 2)
maxSubarraySum([-3, 4, 0, -2, 6, -1], 2)
maxSubarraySum([-3, 4], 3)

function maxSubarraySum2(arr, num) {
  if (arr.length < num) return null

  let total = 0
  for (let i = 0; i < num; i++) {
    total += arr[i]
  }
  let currentTotal = total
  for (let i = num; i < arr.length; i++) {
    currentTotal += arr[i] - arr[i - num]
    total = Math.max(total, currentTotal)
  }
  return total
}

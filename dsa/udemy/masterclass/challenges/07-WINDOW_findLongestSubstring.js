function findLongestSubstring(str) {
  if (str.length <= 1) return str.length
  if (str.length == 2) return str[0] == str[1] ? 1 : 2

  let [left, right] = [0, 1]
  let visited = new Set(str[0])
  let maxLen = 0

  while (right < str.length) {
    const target = str[right]
    if (visited.has(target)) {
      left++
      visited = new Set(str[left])
      right = left + 1
    } else {
      visited.add(target)
      right++
    }
    maxLen = Math.max(maxLen, right - left)
  }
  return maxLen
}

console.log(findLongestSubstring('') == 0)
console.log(findLongestSubstring('thisisawesome') == 6)
console.log(findLongestSubstring('thecatinthehat') == 7)
console.log(findLongestSubstring('bbbbbbbb') == 1)

function findLongestSubstring2(str) {
  let longest = 0
  let seen = {}
  let start = 0

  for (let i = 0; i < str.length; i++) {
    let char = str[i]
    if (seen[char]) {
      start = Math.max(start, seen[char])
    }
    // index - beginning of substring + 1 (to include current in count)
    longest = Math.max(longest, i - start + 1)
    // store the index of the next char so as to not double count
    seen[char] = i + 1
  }
  return longest
}

function isSubsequence(word1, word2) {
  let [idx1, idx2] = [0, 0]

  while (idx1 < word1.length) {
    if (idx2 === word2.length) return false
    if (word1[idx1] === word2[idx2]) {
      idx1++
    }
    idx2++
  }
  return true
}

isSubsequence('hello', 'hello world')
isSubsequence('sing', 'sting')
isSubsequence('abc', 'acb')

// Recursive
function isSubsequenceRecursive(str1, str2) {
  if (str1.length === 0) return true
  if (str2.length === 0) return false
  if (str2[0] === str1[0]) return isSubsequence(str1.slice(1), str2.slice(1))
  return isSubsequence(str1, str2.slice(1))
}

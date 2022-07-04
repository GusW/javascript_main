# Analyzing Performance of Arrays and Objects

## Objects

```javascript
const obj = {
  key: 'value',
  method: function () {
    return `another ${this.key}`
  },
}
```

- Great when no ordering is required

| Operation | Big O |
| --------- | ----- |
| Insertion | O(1)  |
| Removal   | O(1)  |
| Searching | O(N)  |
| Access    | O(1)  |

| Methods          | Big O |
| ---------------- | ----- |
| `Object.keys`    | O(N)  |
| `Object.values`  | O(N)  |
| `Object.entries` | O(N)  |
| `hasOwnProperty` | O(1)  |

## Arrays

```javascript
const array = [true, {}, [], 2, 'whatever']
```

- Great when ordering is required

| Operation | Big O                     |
| --------- | ------------------------- |
| Insertion | begining: O(N), end: O(1) |
| Removal   | begining: O(N), end: O(1) |
| Searching | O(N)                      |
| Access    | O(1)                      |

- `push` and `pop` always faster than `shift` and `unshift`

| Methods                               | Big O         |
| ------------------------------------- | ------------- |
| `push`                                | O(1)          |
| `pop`                                 | O(1)          |
| `shift`                               | O(N)          |
| `unshift`                             | O(N)          |
| `concat`                              | O(N)          |
| `slice`                               | O(N)          |
| `splice`                              | O(N)          |
| `sort`                                | O(N \* log N) |
| `forEach`/`map`/`filter`/`reduce`/... | O(N)          |

const currying = (x1) => (x2) => {
  return x1 + x2;
};

const thunk = (x1) => {
  return (x2) => {
    return x1 + x2;
  };
};

const closure = (x1) => {
  const someSum = (x2) => {
    return x1 + x2;
  };
  return someSum;
};

console.log(currying(2)(3));
console.log(thunk(2)(3));
console.log(closure(2)(3));

const cu2 = currying(2);
console.info(cu2);
const th2 = thunk(2);
console.info(th2);
const cl2 = closure(2);
console.info(cl2);

const deal = {
  dealName : 'someDeal',
  book1    : 'NYC',
  book2    : 'LDN',
  notional : 10005050,
}

let {dealName:tradeName,book1,book2,notional} = deal;

const someList = [1, 2, 3, 4];

let [n1, n2, ...rest] = someList;

const letsIterate = list => {
  list.map(i => {
    let res = i*i;
    console.log(`${i} x ${i} = ${res}`);
  })
}

const letsGiveSomeDef = (list, param=6) => {
  list.map(i=>{
    let res = i*param;
    console.log(`${i} x ${param} = ${res}`)
  })
}

console.log(`Iterating the full list: ${letsIterate(somelist)}`);
console.log(`Iterating the remainder list: ${letsIterate(rest)}`);


const pilots = [
  {
    id: 10,
    name: "Poe Dameron",
    years: 14,
  },
  {
    id: 2,
    name: "Temmin 'Snap' Wexley",
    years: 30,
  },
  {
    id: 41,
    name: "Tallissan Lintra",
    years: 16,
  },
  {
    id: 99,
    name: "Ello Asty",
    years: 22,
  }
];

const totalYears = pilots.reduce((acc, pilot) => {
	return acc + pilot.years
}, 0)

const getNameInList = (list, name) => {
  return list.filter(item => str(item.name).contains(name))
};

// export default sayHi = (name, age=30) => {
//   print `Hey ${name} mate I know you're ${age} years old!`;
// }

//import {sayHi, sayBye} from './hello'

// promises
const url='https://jsonplaceholder.typicode.com/posts';

const getData = url => {
  return fetch(url);
}

getData(url).then(data =>
  data.json()).then(result=>
    console.log(result));
// promises

// basic class and OOP
class myHelloClass{
  constructor(name, age, salutation){
    this.name = name;
    this.age = age;
    this.salutation = salutation;
  };
  salute = () => {
    return `Hello ${this.name} we've been waiting for ${this.age} years to have you here! ${this.salutation}`;
  }
  sayHiTo = (anotherName=John) => {
    return `${this.name} say hi to ${anotherName}`;
  }
}

class childClass extends myHelloClass{
  constructor(name, age, salutation, wifeName){
    super(name, age, salutation);
    this.wifeName = wifeName;
  };
  sendLove = () => {
    return `${this.name} sends ${this.wifeName} a lot of love`;
  }
}
// basic class and OOP

// setter and getter for cookies
localStorage.setItem('user', JSON.stringify({
  username: 'htmldog',
  api_key: 'abc123xyz789'
}));

const user = JSON.parse(localStorage.getItem('user'));
// setter and getter for cookies

// error handling
try {
  throw new Error("I hungry. Fridge empty.");
} catch (error) {
  alert(error.message);
}
// error handling

//regex
const someRegex = /^[a-z\s]+$/;
                  // ^ = begins with
                  // $ = ends with
                  // [] = repeatable
                  // a-z = lowercase letters
                  // \s = spaces

const lowerCaseString = 'some characters';

if (lowerCaseString.match(someRegex)) {
    alert('Yes, all lowercase');
}

const anotherText = "There is everything and nothing.";

anotherText = anotherText.replace(/(every|no)thing/g, 'something');
                                  //everything or nothing
                                  //g = global
                                  //i = case insensitive
//regex

//closure
const add = a => {
  return b => {
      return a + b;
  };
};

const addFive = add(5);

alert(`${addFive(10)} and ${addFive(30)}`);
//closure

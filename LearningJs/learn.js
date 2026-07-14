import XLSX from 'xlsx';



let fruits = ["apple", "banana", "cherry", "date", "elderberry"];

let num = new Array(5);
num[0] = 10;
num[1] = 20;
num[2] = 30;
num[3] = 40;
num[4] = 50;

console.log(fruits);
console.log(num);
function testing(name) {
    console.log("Name of tester - " + name);
}

testing("John");

const person = function (name, age) {

    return name + " is " + age + " years old";

}

console.log(person("Alice", "37"));

const department = (dept) => {
    return "Department name is - " + dept;

}

console.log(department("Sales"));

let word = "Hello World";

let promiser = new Promise((resolve, reject) => {
    console.log("testing");
});


promiser.then(val => console.log("Promise resolved with value - " + val));

let a = 5;
let fact = 1;
for (let i = 1; i <= a; i++) {

    fact = fact * i;

}

console.log("Factorial of " + a + " is - " + fact);

let num1 = [10, 24, 63, 54, 5];

let max = num1[0];

for (let i = 0; i < num1.length; i++) {
    if (num1[i] > max) { // 10>5
        max = num1[i];
    }
}

console.log("Maximum number is - " + max);

let val = "playwright";
console.log("Length of string is - " + val.length);


//

let str = "playwright testing";

let map = {};

// Count frequencies
for (let ch of str) {
    map[ch] = (map[ch] || 0) + 1;
}
console.log(map);
// Find first non-repeating
for (let ch of str) {
    if (map[ch] <= 1) {
        console.log("First non-repeating character is - " + ch);
        //  break; // stop after first
    }
}


let arr = [1, 2, 21, 3, 4, 4, 5];

let unique = [...new Set(arr)];
console.log("Unique elements are - " + unique);

let duplicates = [];
for (let i = 0; i < arr.length; i++) {

    for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) {
            duplicates.pop(arr[i]);
        }
    }
}
console.log("Duplicate elements are - " + duplicates);



for (let a = 0; a < arr.length; a++) {

    let count = 0;

    for (let aa = 1; aa <= arr[a]; aa++) {

        if (arr[a] % aa === 0) {
            count++;
        }
    }

    if (count === 2) {
        console.log(arr[a] + " is Prime");
    } else {
        console.log(arr[a] + " is Not Prime");
    }
}

const persosn = { name: "Alex", age: 30 };

console.log(persosn.age);

const nums=[5,3,8];

const result=nums.find(n=>n>3);

console.log(result);

const sor=nums.sort((a,b)=>a-b);
console.log(sor[sor.length-2]);

console.log(nums.splice(1, 2, 50));

const abc = [1,3,4];
const bcd = [3,4,5];

const union = new Set([...abc,...bcd]);
 const dup =new Set(abc.filter(a=>new Set(bcd).has(a)));
console.log(dup);

const dups = abc.filter(a => bcd.includes(a));
console.log(dups)

const greet = ` Non duplicated ${dups}`;

console.log(greet)


const numbrs = "Testing Playwright";

const as_Map={};

for(let ch of numbrs){

    as_Map[ch]= (as_Map[ch] ||0) + 1;
}

console.log(as_Map);


const newbook= XLSX.utils.book_new();

const workbook = XLSX.readFile('./testdata/login.xlsx');

const dt =[{username: "Vijay@arizon.digital",Pass: "Pass@123"},
  {username: "Uat@ges.com",Pass: "Pass@123"},  
];

const dts=XLSX.utils.json_to_sheet(dt);
XLSX.utils.book_append_sheet(workbook,dts,'login');
XLSX.writeFile(workbook,'./testdata/login.xlsx');

const sheet1 =workbook.Sheets['login'];
const data =XLSX.utils.sheet_to_json(sheet1);


// for(const row of data){
    console.log(row.Password);


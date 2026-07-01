let fruits=["apple","banana","cherry","date","elderberry"];

let num = new Array(5);
num[0] = 10;
num[1] = 20;
num[2] = 30;
num[3] = 40;
num[4] = 50;

console.log(fruits);
console.log(num);
function testing(name){
    console.log("Name of tester - "+name);
}

testing("John");    

const person = function(name, age){

    return name +" is "+age+" years old";

}

console.log(person("Alice","37"));

const department=(dept)=>{
return "Department name is "+dept;

}

console.log(department("Sales"));
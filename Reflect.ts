// type Say = (prefix: string | object) => string;
// const say: Say = function (prefix: string | object): string {
//   return `${prefix} ${this.name}`;
// };

// const result = Reflect.apply(say, { name: "sun" }, ["hello"]);

// class Person {
//   private name: string;

//   constructor(personName: string) {
//     this.name = personName;
//   }
//   public getName() {
//     return `${this.name}`;
//   }
// }
// // const people = new Person("sun");

// const person = Reflect.construct(Person, ["Xiao"]);
// console.log(person);
// // console.log(people.getName());
// // console.log(result);

function Type(type) {
  return Reflect.metadata("type", type);
}
function ParamTypes(...types) {
  return Reflect.metadata("paramtypes", types);
}
function ReturnType(type) {
  return Reflect.metadata("returntype", type);
}

@ParamTypes(String, Number)
class Guang {
  constructor(text, i) {}

  @Type(String)
  get name() {
    return "text";
  }

  @Type(Function)
  @ParamTypes(Number, Number)
  @ReturnType(Number)
  add(x, y) {
    return x + y;
  }
}

let obj = new Guang("a", 1);

let paramTypes = Reflect.getMetadata("paramtypes", obj, "add");
// [Number, Number]


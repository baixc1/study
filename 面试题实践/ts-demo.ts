type Person = {
  name: string;
  age: number;
};

type MyPartial<T> = { [k in keyof T]?: T[k] };

const p1: Person = { name: "1", age: 1 };
const p2: Partial<Person> = {};

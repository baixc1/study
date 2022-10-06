// 函数类型的类型层级：协变与逆变
// 函数类型比较：参数类型和返回值类型

class Animal {
  asPet() {}
}

class Dog extends Animal {
  bark() {}
}

class Corgi extends Dog {
  cute() {}
}

/**
 * 类类型 Corgi ≼ Dog ≼ Animal
 * 函数类型 Dog -> Dog
 * 子类型 (Animal → Corgi) ≼ (Dog → Dog)
 * 核心：参数是逆变（大到小），返回值是协变（小到大）。（里氏替换原则）
 */

/**
 * 逆变与协变
 * A ≼ B
 * 逆变：Wrapper<B> ≼ Wrapper<A>
 * 协变：Wrapper<A> ≼ Wrapper<B>
 */

type AsFuncArgType<T> = (arg: T) => void;
type AsFuncReturnType<T> = (arg: unknown) => T;

// 1 成立：(T -> Corgi) ≼ (T -> Dog)
type CheckReturnType = AsFuncReturnType<Corgi> extends AsFuncReturnType<Dog>
  ? 1
  : 2;

// 1 成立：(Animal -> T) ≼ (Dog -> T)
type CheckArgType1 = AsFuncArgType<Animal> extends AsFuncArgType<Dog> ? 1 : 2;

/**
 * TSConfig 中的 StrictFunctionTypes
 *      对函数参数类型启用逆变检查
 */

import { Result } from './../../result';
import { Args } from '../../argument';
import { Result } from '../../result';
import { Serializable } from '../../serializable';

export class Person {
  constructor(public age: i32 = 0, public name: string = '') {}
}

export class Divinity extends Person implements Serializable {
  serialize(): StaticArray<u8> {
    return new Args().add(this.age).add(this.name).serialize();
  }

  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    const args = new Args(data, offset);
    const resultAge = args.nextI32();

    if (resultAge.isErr()) {
      return new Result(0, "Can't deserialize Age.");
    }

    const resultName = args.nextString();

    if (resultName.isErr()) {
      return new Result(0, "Can't deserialize Name.");
    }

    this.age = resultAge.unwrap();
    this.name = resultName.unwrap();

    return new Result(args.offset);
  }

  @inline @operator('==')
  static eq(a: Divinity, b: Divinity): bool {
    return a.name == b.name && a.age == b.age;
  }
}

export class Hero extends Divinity implements Serializable {
  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    const args = new Args(data, offset);
    const resultAge = args.nextI32();

    if (resultAge.isErr()) {
      return new Result(0, "Can't deserialize Age.");
    }

    const resultName = args.nextString();

    if (resultName.isErr()) {
      return new Result(0, "Can't deserialize Name.");
    }

    this.age = resultAge.unwrap();
    this.name = resultName.unwrap();

    return new Result(args.offset);
  }
}

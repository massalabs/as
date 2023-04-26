<<<<<<< refs/remotes/origin/main:packages/as-types/assembly/__tests__/dto-tests/Person.ts
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
    this.age = args.nextI32().expect("Can't deserialize the age");
    this.name = args.nextString().expect("Can't deserialize the name");
    return new Result(args.offset);
  }
}

export class Hero extends Divinity implements Serializable {
  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    const args = new Args(data, offset);

    const age = args.nextI32();
    if (age.isErr()) {
      return new Result(0, "Can't deserialize the age");
    }
    this.age = age.unwrap();

    const name = args.nextString();
    if (name.isErr()) {
      return new Result(0, "Can't deserialize the name");
    }
    this.name = name.unwrap();

    return new Result(args.offset);
  }
}
=======
>>>>>>> update transformer doc:packages/as-types/assembly/Person.ts

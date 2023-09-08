import * as __import0 from "massa";
/**
 *
 * @param module
 * @param imports
 */
async function instantiate(module, imports = {}) {
  const __module0 = imports.massa;
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }),
    massa: Object.assign(Object.create(__module0), {
      assembly_script_caller_has_write_access() {
        // ~lib/@massalabs/massa-as-sdk/assembly/env/env/env.callerHasWriteAccess() => bool
        return __module0.assembly_script_caller_has_write_access() ? 1 : 0;
      },
      assembly_script_get_call_stack() {
        // ~lib/@massalabs/massa-as-sdk/assembly/env/env/env.callStack() => ~lib/string/String
        return __lowerString(__module0.assembly_script_get_call_stack()) || __notnull();
      },
      assembly_script_generate_event(event) {
        // ~lib/@massalabs/massa-as-sdk/assembly/env/env/env.generateEvent(~lib/string/String) => void
        event = __liftString(event >>> 0);
        __module0.assembly_script_generate_event(event);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    constructor(binaryArgs) {
      // assembly/contracts/main/constructor(~lib/staticarray/StaticArray<u8>) => ~lib/staticarray/StaticArray<u8>
      binaryArgs = __lowerStaticArray((pointer, value) => { new Uint8Array(memory.buffer)[pointer >>> 0] = value; }, 13, 0, binaryArgs, Uint8Array) || __notnull();
      return __liftStaticArray(pointer => new Uint8Array(memory.buffer)[pointer >>> 0], 0, exports.constructor(binaryArgs) >>> 0);
    },
    event(_) {
      // assembly/contracts/main/event(~lib/staticarray/StaticArray<u8>) => ~lib/staticarray/StaticArray<u8>
      _ = __lowerStaticArray((pointer, value) => { new Uint8Array(memory.buffer)[pointer >>> 0] = value; }, 13, 0, _, Uint8Array) || __notnull();
      return __liftStaticArray(pointer => new Uint8Array(memory.buffer)[pointer >>> 0], 0, exports.event(_) >>> 0);
    },
    _ms_test1_(arg) {
      // assembly/contracts/main/_ms_test1_(~lib/as-bignum/assembly/integer/u128/u128) => ~lib/as-bignum/assembly/integer/u128/u128
      arg = __lowerInternref(arg) || __notnull();
      return __liftInternref(exports._ms_test1_(arg) >>> 0);
    },
    _ms_test2_(arg) {
      // assembly/contracts/main/_ms_test2_(~lib/as-bignum/assembly/integer/u256/u256) => ~lib/as-bignum/assembly/integer/u256/u256
      arg = __lowerInternref(arg) || __notnull();
      return __liftInternref(exports._ms_test2_(arg) >>> 0);
    },
    _ms_test3_(arg) {
      // assembly/contracts/main/_ms_test3_(~lib/as-bignum/assembly/integer/u128/u128) => ~lib/as-bignum/assembly/integer/u256/u256
      arg = __lowerInternref(arg) || __notnull();
      return __liftInternref(exports._ms_test3_(arg) >>> 0);
    },
    _ms_test6_(str1, str2) {
      // assembly/contracts/main/_ms_test6_(~lib/string/String, ~lib/string/String) => ~lib/string/String
      str1 = __retain(__lowerString(str1) || __notnull());
      str2 = __lowerString(str2) || __notnull();
      try {
        return __liftString(exports._ms_test6_(str1, str2) >>> 0);
      } finally {
        __release(str1);
      }
    },
    _ms_testArrayI32Ret_(arg1, arg2) {
      // assembly/contracts/main/_ms_testArrayI32Ret_(i32, i32) => ~lib/array/Array<i32>
      return __liftArray(pointer => new Int32Array(memory.buffer)[pointer >>> 2], 2, exports._ms_testArrayI32Ret_(arg1, arg2) >>> 0);
    },
    _ms_testBool_(arg1) {
      // assembly/contracts/main/_ms_testBool_(bool) => bool
      arg1 = arg1 ? 1 : 0;
      return exports._ms_testBool_(arg1) != 0;
    },
    _ms_testArrayBool_(arg1) {
      // assembly/contracts/main/_ms_testArrayBool_(~lib/array/Array<bool>) => ~lib/array/Array<bool>
      arg1 = __lowerArray((pointer, value) => { new Uint8Array(memory.buffer)[pointer >>> 0] = value ? 1 : 0; }, 26, 0, arg1) || __notnull();
      return __liftArray(pointer => new Uint8Array(memory.buffer)[pointer >>> 0] != 0, 0, exports._ms_testArrayBool_(arg1) >>> 0);
    },
    _ms_testArrayI8_(arg1) {
      // assembly/contracts/main/_ms_testArrayI8_(~lib/array/Array<i8>) => ~lib/array/Array<i8>
      arg1 = __lowerArray((pointer, value) => { new Int8Array(memory.buffer)[pointer >>> 0] = value; }, 27, 0, arg1) || __notnull();
      return __liftArray(pointer => new Int8Array(memory.buffer)[pointer >>> 0], 0, exports._ms_testArrayI8_(arg1) >>> 0);
    },
    _ms_testArrayU8_(arg1) {
      // assembly/contracts/main/_ms_testArrayU8_(~lib/array/Array<u8>) => ~lib/array/Array<u8>
      arg1 = __lowerArray((pointer, value) => { new Uint8Array(memory.buffer)[pointer >>> 0] = value; }, 22, 0, arg1) || __notnull();
      return __liftArray(pointer => new Uint8Array(memory.buffer)[pointer >>> 0], 0, exports._ms_testArrayU8_(arg1) >>> 0);
    },
    _ms_testArrayI16_(arg1) {
      // assembly/contracts/main/_ms_testArrayI16_(~lib/array/Array<i16>) => ~lib/array/Array<i16>
      arg1 = __lowerArray((pointer, value) => { new Int16Array(memory.buffer)[pointer >>> 1] = value; }, 28, 1, arg1) || __notnull();
      return __liftArray(pointer => new Int16Array(memory.buffer)[pointer >>> 1], 1, exports._ms_testArrayI16_(arg1) >>> 0);
    },
    _ms_testArrayU16_(arg1) {
      // assembly/contracts/main/_ms_testArrayU16_(~lib/array/Array<u16>) => ~lib/array/Array<u16>
      arg1 = __lowerArray((pointer, value) => { new Uint16Array(memory.buffer)[pointer >>> 1] = value; }, 29, 1, arg1) || __notnull();
      return __liftArray(pointer => new Uint16Array(memory.buffer)[pointer >>> 1], 1, exports._ms_testArrayU16_(arg1) >>> 0);
    },
    _ms_testArrayI32_(arg1) {
      // assembly/contracts/main/_ms_testArrayI32_(~lib/array/Array<i32>) => ~lib/array/Array<i32>
      arg1 = __lowerArray((pointer, value) => { new Int32Array(memory.buffer)[pointer >>> 2] = value; }, 8, 2, arg1) || __notnull();
      return __liftArray(pointer => new Int32Array(memory.buffer)[pointer >>> 2], 2, exports._ms_testArrayI32_(arg1) >>> 0);
    },
    _ms_testArrayU32_(arg1) {
      // assembly/contracts/main/_ms_testArrayU32_(~lib/array/Array<u32>) => ~lib/array/Array<u32>
      arg1 = __lowerArray((pointer, value) => { new Uint32Array(memory.buffer)[pointer >>> 2] = value; }, 7, 2, arg1) || __notnull();
      return __liftArray(pointer => new Uint32Array(memory.buffer)[pointer >>> 2], 2, exports._ms_testArrayU32_(arg1) >>> 0);
    },
    _ms_testArrayI64_(arg1) {
      // assembly/contracts/main/_ms_testArrayI64_(~lib/array/Array<i64>) => ~lib/array/Array<i64>
      arg1 = __lowerArray((pointer, value) => { new BigInt64Array(memory.buffer)[pointer >>> 3] = value || 0n; }, 30, 3, arg1) || __notnull();
      return __liftArray(pointer => new BigInt64Array(memory.buffer)[pointer >>> 3], 3, exports._ms_testArrayI64_(arg1) >>> 0);
    },
    _ms_testArrayU64_(arg1) {
      // assembly/contracts/main/_ms_testArrayU64_(~lib/array/Array<u64>) => ~lib/array/Array<u64>
      arg1 = __lowerArray((pointer, value) => { new BigUint64Array(memory.buffer)[pointer >>> 3] = value || 0n; }, 31, 3, arg1) || __notnull();
      return __liftArray(pointer => new BigUint64Array(memory.buffer)[pointer >>> 3], 3, exports._ms_testArrayU64_(arg1) >>> 0);
    },
    _ms_testArrayString_(arg1) {
      // assembly/contracts/main/_ms_testArrayString_(~lib/array/Array<~lib/string/String>) => ~lib/array/Array<~lib/string/String>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerString(value) || __notnull()); }, 18, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftString(new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayString_(arg1) >>> 0);
    },
    _ms_testArrayCustomType_(arg1) {
      // assembly/contracts/main/_ms_testArrayCustomType_(~lib/array/Array<~lib/as-bignum/assembly/integer/u128/u128>) => ~lib/array/Array<~lib/as-bignum/assembly/integer/u256/u256>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerInternref(value) || __notnull()); }, 32, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftInternref(new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayCustomType_(arg1) >>> 0);
    },
    _ms_testSquareArrayU8_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayU8_(~lib/array/Array<u8>) => ~lib/array/Array<u8>
      arg1 = __lowerArray((pointer, value) => { new Uint8Array(memory.buffer)[pointer >>> 0] = value; }, 22, 0, arg1) || __notnull();
      return __liftArray(pointer => new Uint8Array(memory.buffer)[pointer >>> 0], 0, exports._ms_testSquareArrayU8_(arg1) >>> 0);
    },
    _ms_testSquareArrayU16_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayU16_(~lib/array/Array<u16>) => ~lib/array/Array<u16>
      arg1 = __lowerArray((pointer, value) => { new Uint16Array(memory.buffer)[pointer >>> 1] = value; }, 29, 1, arg1) || __notnull();
      return __liftArray(pointer => new Uint16Array(memory.buffer)[pointer >>> 1], 1, exports._ms_testSquareArrayU16_(arg1) >>> 0);
    },
    _ms_testSquareArrayU32_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayU32_(~lib/array/Array<u32>) => ~lib/array/Array<u32>
      arg1 = __lowerArray((pointer, value) => { new Uint32Array(memory.buffer)[pointer >>> 2] = value; }, 7, 2, arg1) || __notnull();
      return __liftArray(pointer => new Uint32Array(memory.buffer)[pointer >>> 2], 2, exports._ms_testSquareArrayU32_(arg1) >>> 0);
    },
    _ms_testSquareArrayString_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayString_(~lib/array/Array<~lib/string/String>) => ~lib/array/Array<~lib/string/String>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerString(value) || __notnull()); }, 18, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftString(new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayString_(arg1) >>> 0);
    },
    _ms_testSquareArrayU128_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayU128_(~lib/array/Array<~lib/as-bignum/assembly/integer/u128/u128>) => ~lib/array/Array<~lib/as-bignum/assembly/integer/u128/u128>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerInternref(value) || __notnull()); }, 32, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftInternref(new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayU128_(arg1) >>> 0);
    },
    _ms_testUint8Array_(arg1) {
      // assembly/contracts/main/_ms_testUint8Array_(~lib/typedarray/Uint8Array) => ~lib/typedarray/Uint8Array
      arg1 = __lowerTypedArray(Uint8Array, 9, 0, arg1) || __notnull();
      return __liftTypedArray(Uint8Array, exports._ms_testUint8Array_(arg1) >>> 0);
    },
    _ms_testInt8Array_(arg1) {
      // assembly/contracts/main/_ms_testInt8Array_(~lib/typedarray/Int8Array) => ~lib/typedarray/Int8Array
      arg1 = __lowerTypedArray(Int8Array, 35, 0, arg1) || __notnull();
      return __liftTypedArray(Int8Array, exports._ms_testInt8Array_(arg1) >>> 0);
    },
    _ms_testUint16Array_(arg1) {
      // assembly/contracts/main/_ms_testUint16Array_(~lib/typedarray/Uint16Array) => ~lib/typedarray/Uint16Array
      arg1 = __lowerTypedArray(Uint16Array, 36, 1, arg1) || __notnull();
      return __liftTypedArray(Uint16Array, exports._ms_testUint16Array_(arg1) >>> 0);
    },
    _ms_testInt16Array_(arg1) {
      // assembly/contracts/main/_ms_testInt16Array_(~lib/typedarray/Int16Array) => ~lib/typedarray/Int16Array
      arg1 = __lowerTypedArray(Int16Array, 37, 1, arg1) || __notnull();
      return __liftTypedArray(Int16Array, exports._ms_testInt16Array_(arg1) >>> 0);
    },
    _ms_testUint32Array_(arg1) {
      // assembly/contracts/main/_ms_testUint32Array_(~lib/typedarray/Uint32Array) => ~lib/typedarray/Uint32Array
      arg1 = __lowerTypedArray(Uint32Array, 38, 2, arg1) || __notnull();
      return __liftTypedArray(Uint32Array, exports._ms_testUint32Array_(arg1) >>> 0);
    },
    _ms_testInt32Array_(arg1) {
      // assembly/contracts/main/_ms_testInt32Array_(~lib/typedarray/Int32Array) => ~lib/typedarray/Int32Array
      arg1 = __lowerTypedArray(Int32Array, 39, 2, arg1) || __notnull();
      return __liftTypedArray(Int32Array, exports._ms_testInt32Array_(arg1) >>> 0);
    },
    _ms_testUint64Array_(arg1) {
      // assembly/contracts/main/_ms_testUint64Array_(~lib/typedarray/Uint64Array) => ~lib/typedarray/Uint64Array
      arg1 = __lowerTypedArray(BigUint64Array, 40, 3, arg1) || __notnull();
      return __liftTypedArray(BigUint64Array, exports._ms_testUint64Array_(arg1) >>> 0);
    },
    _ms_testInt64Array_(arg1) {
      // assembly/contracts/main/_ms_testInt64Array_(~lib/typedarray/Int64Array) => ~lib/typedarray/Int64Array
      arg1 = __lowerTypedArray(BigInt64Array, 41, 3, arg1) || __notnull();
      return __liftTypedArray(BigInt64Array, exports._ms_testInt64Array_(arg1) >>> 0);
    },
    _ms_testArrayOfUint8Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfUint8Array_(~lib/array/Array<~lib/typedarray/Uint8Array>) => ~lib/array/Array<~lib/typedarray/Uint8Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Uint8Array, 9, 0, value) || __notnull()); }, 42, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint8Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfUint8Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfUint8Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfUint8Array_(~lib/array/Array<~lib/typedarray/Uint8Array>) => ~lib/array/Array<~lib/typedarray/Uint8Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Uint8Array, 9, 0, value) || __notnull()); }, 42, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint8Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfUint8Array_(arg1) >>> 0);
    },
    _ms_testArrayOfInt8Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfInt8Array_(~lib/array/Array<~lib/typedarray/Int8Array>) => ~lib/array/Array<~lib/typedarray/Int8Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Int8Array, 35, 0, value) || __notnull()); }, 43, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Int8Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfInt8Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfInt8Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfInt8Array_(~lib/array/Array<~lib/typedarray/Int8Array>) => ~lib/array/Array<~lib/typedarray/Int8Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Int8Array, 35, 0, value) || __notnull()); }, 43, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Int8Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfInt8Array_(arg1) >>> 0);
    },
    _ms_testArrayOfUint16Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfUint16Array_(~lib/array/Array<~lib/typedarray/Uint16Array>) => ~lib/array/Array<~lib/typedarray/Uint16Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Uint16Array, 36, 1, value) || __notnull()); }, 44, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint16Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfUint16Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfUint16Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfUint16Array_(~lib/array/Array<~lib/typedarray/Uint16Array>) => ~lib/array/Array<~lib/typedarray/Uint16Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Uint16Array, 36, 1, value) || __notnull()); }, 44, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint16Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfUint16Array_(arg1) >>> 0);
    },
    _ms_testArrayOfInt16Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfInt16Array_(~lib/array/Array<~lib/typedarray/Int16Array>) => ~lib/array/Array<~lib/typedarray/Int16Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Int16Array, 37, 1, value) || __notnull()); }, 45, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Int16Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfInt16Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfInt16Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfInt16Array_(~lib/array/Array<~lib/typedarray/Int16Array>) => ~lib/array/Array<~lib/typedarray/Int16Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Int16Array, 37, 1, value) || __notnull()); }, 45, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Int16Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfInt16Array_(arg1) >>> 0);
    },
    _ms_testArrayOfUint32Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfUint32Array_(~lib/array/Array<~lib/typedarray/Uint32Array>) => ~lib/array/Array<~lib/typedarray/Uint32Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Uint32Array, 38, 2, value) || __notnull()); }, 46, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint32Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfUint32Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfUint32Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfUint32Array_(~lib/array/Array<~lib/typedarray/Uint32Array>) => ~lib/array/Array<~lib/typedarray/Uint32Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Uint32Array, 38, 2, value) || __notnull()); }, 46, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint32Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfUint32Array_(arg1) >>> 0);
    },
    _ms_testArrayOfInt32Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfInt32Array_(~lib/array/Array<~lib/typedarray/Int32Array>) => ~lib/array/Array<~lib/typedarray/Int32Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Int32Array, 39, 2, value) || __notnull()); }, 47, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Int32Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfInt32Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfInt32Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfInt32Array_(~lib/array/Array<~lib/typedarray/Int32Array>) => ~lib/array/Array<~lib/typedarray/Int32Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(Int32Array, 39, 2, value) || __notnull()); }, 47, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Int32Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfInt32Array_(arg1) >>> 0);
    },
    _ms_testArrayOfUint64Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfUint64Array_(~lib/array/Array<~lib/typedarray/Uint64Array>) => ~lib/array/Array<~lib/typedarray/Uint64Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(BigUint64Array, 40, 3, value) || __notnull()); }, 48, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(BigUint64Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfUint64Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfUint64Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfUint64Array_(~lib/array/Array<~lib/typedarray/Uint64Array>) => ~lib/array/Array<~lib/typedarray/Uint64Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(BigUint64Array, 40, 3, value) || __notnull()); }, 48, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(BigUint64Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfUint64Array_(arg1) >>> 0);
    },
    _ms_testArrayOfInt64Array_(arg1) {
      // assembly/contracts/main/_ms_testArrayOfInt64Array_(~lib/array/Array<~lib/typedarray/Int64Array>) => ~lib/array/Array<~lib/typedarray/Int64Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(BigInt64Array, 41, 3, value) || __notnull()); }, 49, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(BigInt64Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testArrayOfInt64Array_(arg1) >>> 0);
    },
    _ms_testSquareArrayOfInt64Array_(arg1) {
      // assembly/contracts/main/_ms_testSquareArrayOfInt64Array_(~lib/array/Array<~lib/typedarray/Int64Array>) => ~lib/array/Array<~lib/typedarray/Int64Array>
      arg1 = __lowerArray((pointer, value) => { __store_ref(pointer, __lowerTypedArray(BigInt64Array, 41, 3, value) || __notnull()); }, 49, 2, arg1) || __notnull();
      return __liftArray(pointer => __liftTypedArray(BigInt64Array, new Uint32Array(memory.buffer)[pointer >>> 2]), 2, exports._ms_testSquareArrayOfInt64Array_(arg1) >>> 0);
    },
    test1(_args) {
      // assembly/contracts/main/test1(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.test1(_args) >>> 0);
    },
    test2(_args) {
      // assembly/contracts/main/test2(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.test2(_args) >>> 0);
    },
    test3(_args) {
      // assembly/contracts/main/test3(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.test3(_args) >>> 0);
    },
    test4(_args) {
      // assembly/contracts/main/test4(~lib/arraybuffer/ArrayBuffer) => void
      _args = __lowerBuffer(_args) || __notnull();
      exports.test4(_args);
    },
    test5(_args) {
      // assembly/contracts/main/test5(~lib/arraybuffer/ArrayBuffer) => void
      _args = __lowerBuffer(_args) || __notnull();
      exports.test5(_args);
    },
    test6(_args) {
      // assembly/contracts/main/test6(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.test6(_args) >>> 0);
    },
    testArrayI32Ret(_args) {
      // assembly/contracts/main/testArrayI32Ret(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayI32Ret(_args) >>> 0);
    },
    testBool(_args) {
      // assembly/contracts/main/testBool(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testBool(_args) >>> 0);
    },
    testArrayBool(_args) {
      // assembly/contracts/main/testArrayBool(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayBool(_args) >>> 0);
    },
    testArrayI8(_args) {
      // assembly/contracts/main/testArrayI8(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayI8(_args) >>> 0);
    },
    testArrayU8(_args) {
      // assembly/contracts/main/testArrayU8(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayU8(_args) >>> 0);
    },
    testArrayI16(_args) {
      // assembly/contracts/main/testArrayI16(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayI16(_args) >>> 0);
    },
    testArrayU16(_args) {
      // assembly/contracts/main/testArrayU16(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayU16(_args) >>> 0);
    },
    testArrayI32(_args) {
      // assembly/contracts/main/testArrayI32(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayI32(_args) >>> 0);
    },
    testArrayU32(_args) {
      // assembly/contracts/main/testArrayU32(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayU32(_args) >>> 0);
    },
    testArrayI64(_args) {
      // assembly/contracts/main/testArrayI64(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayI64(_args) >>> 0);
    },
    testArrayU64(_args) {
      // assembly/contracts/main/testArrayU64(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayU64(_args) >>> 0);
    },
    testArrayString(_args) {
      // assembly/contracts/main/testArrayString(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayString(_args) >>> 0);
    },
    testArrayCustomType(_args) {
      // assembly/contracts/main/testArrayCustomType(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayCustomType(_args) >>> 0);
    },
    testSquareArrayU8(_args) {
      // assembly/contracts/main/testSquareArrayU8(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayU8(_args) >>> 0);
    },
    testSquareArrayU16(_args) {
      // assembly/contracts/main/testSquareArrayU16(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayU16(_args) >>> 0);
    },
    testSquareArrayU32(_args) {
      // assembly/contracts/main/testSquareArrayU32(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayU32(_args) >>> 0);
    },
    testSquareArrayString(_args) {
      // assembly/contracts/main/testSquareArrayString(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayString(_args) >>> 0);
    },
    testSquareArrayU128(_args) {
      // assembly/contracts/main/testSquareArrayU128(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayU128(_args) >>> 0);
    },
    testUint8Array(_args) {
      // assembly/contracts/main/testUint8Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testUint8Array(_args) >>> 0);
    },
    testInt8Array(_args) {
      // assembly/contracts/main/testInt8Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testInt8Array(_args) >>> 0);
    },
    testUint16Array(_args) {
      // assembly/contracts/main/testUint16Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testUint16Array(_args) >>> 0);
    },
    testInt16Array(_args) {
      // assembly/contracts/main/testInt16Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testInt16Array(_args) >>> 0);
    },
    testUint32Array(_args) {
      // assembly/contracts/main/testUint32Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testUint32Array(_args) >>> 0);
    },
    testInt32Array(_args) {
      // assembly/contracts/main/testInt32Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testInt32Array(_args) >>> 0);
    },
    testUint64Array(_args) {
      // assembly/contracts/main/testUint64Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testUint64Array(_args) >>> 0);
    },
    testInt64Array(_args) {
      // assembly/contracts/main/testInt64Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testInt64Array(_args) >>> 0);
    },
    testArrayOfUint8Array(_args) {
      // assembly/contracts/main/testArrayOfUint8Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfUint8Array(_args) >>> 0);
    },
    testSquareArrayOfUint8Array(_args) {
      // assembly/contracts/main/testSquareArrayOfUint8Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfUint8Array(_args) >>> 0);
    },
    testArrayOfInt8Array(_args) {
      // assembly/contracts/main/testArrayOfInt8Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfInt8Array(_args) >>> 0);
    },
    testSquareArrayOfInt8Array(_args) {
      // assembly/contracts/main/testSquareArrayOfInt8Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfInt8Array(_args) >>> 0);
    },
    testArrayOfUint16Array(_args) {
      // assembly/contracts/main/testArrayOfUint16Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfUint16Array(_args) >>> 0);
    },
    testSquareArrayOfUint16Array(_args) {
      // assembly/contracts/main/testSquareArrayOfUint16Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfUint16Array(_args) >>> 0);
    },
    testArrayOfInt16Array(_args) {
      // assembly/contracts/main/testArrayOfInt16Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfInt16Array(_args) >>> 0);
    },
    testSquareArrayOfInt16Array(_args) {
      // assembly/contracts/main/testSquareArrayOfInt16Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfInt16Array(_args) >>> 0);
    },
    testArrayOfUint32Array(_args) {
      // assembly/contracts/main/testArrayOfUint32Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfUint32Array(_args) >>> 0);
    },
    testSquareArrayOfUint32Array(_args) {
      // assembly/contracts/main/testSquareArrayOfUint32Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfUint32Array(_args) >>> 0);
    },
    testArrayOfInt32Array(_args) {
      // assembly/contracts/main/testArrayOfInt32Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfInt32Array(_args) >>> 0);
    },
    testSquareArrayOfInt32Array(_args) {
      // assembly/contracts/main/testSquareArrayOfInt32Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfInt32Array(_args) >>> 0);
    },
    testArrayOfUint64Array(_args) {
      // assembly/contracts/main/testArrayOfUint64Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfUint64Array(_args) >>> 0);
    },
    testSquareArrayOfUint64Array(_args) {
      // assembly/contracts/main/testSquareArrayOfUint64Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfUint64Array(_args) >>> 0);
    },
    testArrayOfInt64Array(_args) {
      // assembly/contracts/main/testArrayOfInt64Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testArrayOfInt64Array(_args) >>> 0);
    },
    testSquareArrayOfInt64Array(_args) {
      // assembly/contracts/main/testSquareArrayOfInt64Array(~lib/arraybuffer/ArrayBuffer) => ~lib/arraybuffer/ArrayBuffer
      _args = __lowerBuffer(_args) || __notnull();
      return __liftBuffer(exports.testSquareArrayOfInt64Array(_args) >>> 0);
    },
  }, exports);
  /**
   *
   * @param pointer
   */
  function __liftBuffer(pointer) {
    if (!pointer) return null;
    return memory.buffer.slice(pointer, pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2]);
  }
  /**
   *
   * @param value
   */
  function __lowerBuffer(value) {
    if (value == null) return 0;
    const pointer = exports.__new(value.byteLength, 1) >>> 0;
    new Uint8Array(memory.buffer).set(new Uint8Array(value), pointer);
    return pointer;
  }
  /**
   *
   * @param pointer
   */
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1;
    const memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1;
    let string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  /**
   *
   * @param value
   */
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length;
    const pointer = exports.__new(length << 1, 2) >>> 0;
    const memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  /**
   *
   * @param liftElement
   * @param align
   * @param pointer
   */
  function __liftArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      memoryU32 = new Uint32Array(memory.buffer);
    const dataStart = memoryU32[pointer + 4 >>> 2];
    const length = memoryU32[pointer + 12 >>> 2];
    const values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(dataStart + (i << align >>> 0));
    return values;
  }
  /**
   *
   * @param lowerElement
   * @param id
   * @param align
   * @param values
   */
  function __lowerArray(lowerElement, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length;
    const buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0;
    const header = exports.__pin(exports.__new(16, id)) >>> 0;
    const memoryU32 = new Uint32Array(memory.buffer);
    memoryU32[header + 0 >>> 2] = buffer;
    memoryU32[header + 4 >>> 2] = buffer;
    memoryU32[header + 8 >>> 2] = length << align;
    memoryU32[header + 12 >>> 2] = length;
    for (let i = 0; i < length; ++i) lowerElement(buffer + (i << align >>> 0), values[i]);
    exports.__unpin(buffer);
    exports.__unpin(header);
    return header;
  }
  /**
   *
   * @param constructor
   * @param pointer
   */
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    const memoryU32 = new Uint32Array(memory.buffer);
    return new constructor(
      memory.buffer,
      memoryU32[pointer + 4 >>> 2],
      memoryU32[pointer + 8 >>> 2] / constructor.BYTES_PER_ELEMENT
    ).slice();
  }
  /**
   *
   * @param constructor
   * @param id
   * @param align
   * @param values
   */
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length;
    const buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0;
    const header = exports.__new(12, id) >>> 0;
    const memoryU32 = new Uint32Array(memory.buffer);
    memoryU32[header + 0 >>> 2] = buffer;
    memoryU32[header + 4 >>> 2] = buffer;
    memoryU32[header + 8 >>> 2] = length << align;
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  /**
   *
   * @param liftElement
   * @param align
   * @param pointer
   */
  function __liftStaticArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      length = new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> align;
    const values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(pointer + (i << align >>> 0));
    return values;
  }
  /**
   *
   * @param lowerElement
   * @param id
   * @param align
   * @param values
   * @param typedConstructor
   */
  function __lowerStaticArray(lowerElement, id, align, values, typedConstructor) {
    if (values == null) return 0;
    const
      length = values.length;
    const buffer = exports.__pin(exports.__new(length << align, id)) >>> 0;
    if (typedConstructor) {
      new typedConstructor(memory.buffer, buffer, length).set(values);
    } else {
      for (let i = 0; i < length; i++) lowerElement(buffer + (i << align >>> 0), values[i]);
    }
    exports.__unpin(buffer);
    return buffer;
  }
  class Internref extends Number {}
  const registry = new FinalizationRegistry(__release);
  /**
   *
   * @param pointer
   */
  function __liftInternref(pointer) {
    if (!pointer) return null;
    const sentinel = new Internref(__retain(pointer));
    registry.register(sentinel, pointer);
    return sentinel;
  }
  /**
   *
   * @param value
   */
  function __lowerInternref(value) {
    if (value == null) return 0;
    if (value instanceof Internref) return value.valueOf();
    throw TypeError("internref expected");
  }
  const refcounts = new Map();
  /**
   *
   * @param pointer
   */
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  /**
   *
   * @param pointer
   */
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  /**
   *
   */
  function __notnull() {
    throw TypeError("value must not be null");
  }
  /**
   *
   * @param pointer
   * @param value
   */
  function __store_ref(pointer, value) {
    new Uint32Array(memory.buffer)[pointer >>> 2] = value;
  }
  return adaptedExports;
}
export const {
  memory,
  constructor,
  event,
  _ms_test1_,
  _ms_test2_,
  _ms_test3_,
  _ms_test4_,
  _ms_test5_,
  _ms_test6_,
  _ms_testArrayI32Ret_,
  _ms_testBool_,
  _ms_testArrayBool_,
  _ms_testArrayI8_,
  _ms_testArrayU8_,
  _ms_testArrayI16_,
  _ms_testArrayU16_,
  _ms_testArrayI32_,
  _ms_testArrayU32_,
  _ms_testArrayI64_,
  _ms_testArrayU64_,
  _ms_testArrayString_,
  _ms_testArrayCustomType_,
  _ms_testSquareArrayU8_,
  _ms_testSquareArrayU16_,
  _ms_testSquareArrayU32_,
  _ms_testSquareArrayString_,
  _ms_testSquareArrayU128_,
  _ms_testUint8Array_,
  _ms_testInt8Array_,
  _ms_testUint16Array_,
  _ms_testInt16Array_,
  _ms_testUint32Array_,
  _ms_testInt32Array_,
  _ms_testUint64Array_,
  _ms_testInt64Array_,
  _ms_testArrayOfUint8Array_,
  _ms_testSquareArrayOfUint8Array_,
  _ms_testArrayOfInt8Array_,
  _ms_testSquareArrayOfInt8Array_,
  _ms_testArrayOfUint16Array_,
  _ms_testSquareArrayOfUint16Array_,
  _ms_testArrayOfInt16Array_,
  _ms_testSquareArrayOfInt16Array_,
  _ms_testArrayOfUint32Array_,
  _ms_testSquareArrayOfUint32Array_,
  _ms_testArrayOfInt32Array_,
  _ms_testSquareArrayOfInt32Array_,
  _ms_testArrayOfUint64Array_,
  _ms_testSquareArrayOfUint64Array_,
  _ms_testArrayOfInt64Array_,
  _ms_testSquareArrayOfInt64Array_,
  test1,
  test2,
  test3,
  test4,
  test5,
  test6,
  testArrayI32Ret,
  testBool,
  testArrayBool,
  testArrayI8,
  testArrayU8,
  testArrayI16,
  testArrayU16,
  testArrayI32,
  testArrayU32,
  testArrayI64,
  testArrayU64,
  testArrayString,
  testArrayCustomType,
  testSquareArrayU8,
  testSquareArrayU16,
  testSquareArrayU32,
  testSquareArrayString,
  testSquareArrayU128,
  testUint8Array,
  testInt8Array,
  testUint16Array,
  testInt16Array,
  testUint32Array,
  testInt32Array,
  testUint64Array,
  testInt64Array,
  testArrayOfUint8Array,
  testSquareArrayOfUint8Array,
  testArrayOfInt8Array,
  testSquareArrayOfInt8Array,
  testArrayOfUint16Array,
  testSquareArrayOfUint16Array,
  testArrayOfInt16Array,
  testSquareArrayOfInt16Array,
  testArrayOfUint32Array,
  testSquareArrayOfUint32Array,
  testArrayOfInt32Array,
  testSquareArrayOfInt32Array,
  testArrayOfUint64Array,
  testSquareArrayOfUint64Array,
  testArrayOfInt64Array,
  testSquareArrayOfInt64Array
} = await (async url => instantiate(
  await (async () => {
    try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
    catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
  })(), {
    massa: __maybeDefault(__import0),
  }
))(new URL("main.wasm", import.meta.url));
/**
 *
 * @param module
 */
function __maybeDefault(module) {
  return typeof module.default === "object" && Object.keys(module).length == 1
    ? module.default
    : module;
}

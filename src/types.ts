import { assign } from './utils'

export type AnyFunc = (value: any) => any
export type ArrayElement<T extends Array<any>> = T extends Array<infer R> ? R : any

export type IContextBarer = {
  __context__?: Types | any
}

export interface ISpecType extends IContextBarer {
  (value: any): any
}

export interface ITargetSpec extends IContextBarer {
  [s: string]: ISpecType | ITargetSpec | ITargetSpecArray
}

export type ITargetSpecArray = ITargetSpec[] & IContextBarer

export interface ITypeString extends IContextBarer {
  (value: any): string
}

export interface ITypeNumber extends IContextBarer {
  (value: any): number
}

export interface ITypeBoolean extends IContextBarer {
  (value: any): boolean
}

export interface ITypeCompute {
  <T extends ISpecType>(transformer: T): T
}

export interface ITypeSelect {
  (key: string): Types
}

export type ITypeArray = <T extends ITargetSpec>(spec: T) => T[] & IContextBarer
export type ITypeObject = <T extends ITargetSpec>(spec: T) => T

export type ITypes = {
  string: ITypeString
  number: ITypeNumber
  boolean: ITypeBoolean
  compute: ITypeCompute
  array: ITypeArray
  object: ITypeObject
  select: ITypeSelect
}

export default class Types implements ITypes {
  __path__?: string
  string: ITypeString
  number: ITypeNumber
  boolean: ITypeBoolean
  compute: ITypeCompute
  array: ITypeArray
  object: ITypeObject
  select: ITypeSelect

  constructor(path: string = '') {
    if (path) this.__path__ = path
    const identityFuncFactory = () => {
      const id = (value: any) => value
      return assign(id, { __context__: this })
    }

    this.string = identityFuncFactory()
    this.number = identityFuncFactory()
    this.boolean = identityFuncFactory()

    this.compute = <T extends AnyFunc>(transformer: T) => {
      return assign(transformer, { __context__: this })
    }

    this.object = <T extends ITargetSpec>(spec: T) => {
      return Object.defineProperty(spec, '__context__', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: this
      })
    }

    this.array = <T extends ITargetSpec>(spec: T) => {
      return Object.defineProperty([spec], '__context__', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: this
      })
    }

    this.select = assign(
      (fromPath: string) => {
        return new Types(fromPath)
      },
      { __context__: this }
    )
  }
}

/*
 * This ugly functional type is best expressed as:
 * ```
 * getTypeForNoneArray<T> = T extends AnyFunc ? ReturnType<T> : {
 *   [P in keyof T]: T[P] extends any[] ? IArray<T[P]> : getTypeForNoneArray<T[P]>
 * }
 * ```
 * But the VSCode IDE hint won't tap into real content of deeper level of recursion type,
 * which effectively defeat the purpose of having this type in first place -- to give hint of type
 * of returned data in IDE. Thus it has to be constructed this way, to manually tap into deeper level
 */
export type getTypeForNoneArray<T> = T extends AnyFunc
  ? ReturnType<T>
  : {
      [P0 in keyof T]: T[P0] extends any[]
        ? IArray<T[P0]>
        : T[P0] extends AnyFunc
          ? ReturnType<T[P0]>
          : {
              [P1 in keyof T[P0]]: T[P0][P1] extends any[]
                ? IArray<T[P0][P1]>
                : T[P0][P1] extends AnyFunc
                  ? ReturnType<T[P0][P1]>
                  : {
                      [P2 in keyof T[P0][P1]]: T[P0][P1][P2] extends any[]
                        ? IArray<T[P0][P1][P2]>
                        : T[P0][P1][P2] extends AnyFunc
                          ? ReturnType<T[P0][P1][P2]>
                          : {
                              [P3 in keyof T[P0][P1][P2]]: T[P0][P1][P2][P3] extends any[]
                                ? IArray<T[P0][P1][P2][P3]>
                                : T[P0][P1][P2][P3] extends AnyFunc
                                  ? ReturnType<T[P0][P1][P2][P3]>
                                  : {
                                      [P4 in keyof T[P0][P1][P2][P3]]: T[P0][P1][P2][P3][P4] extends any[]
                                        ? IArray<T[P0][P1][P2][P3][P4]>
                                        : getTypeForNoneArray<T[P0][P1][P2][P3][P4]>
                                    }
                            }
                    }
            }
    }

export type getTypeForAnyValue<V> = V extends any[] ? IArray<V> : getTypeForNoneArray<V>
export interface IArray<T extends any[]> extends Array<getTypeForAnyValue<ArrayElement<T>>> {}

export type IGetTargetDataFromSpec<T> = getTypeForAnyValue<T>

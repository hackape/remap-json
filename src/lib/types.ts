import { assign } from './utils'
import remap from './remap'

type AnyFunc = (value: any) => any

export type ISpecType = AnyFunc & {
  __context__?: Types
}

export interface ITargetSpec {
  [s: string]: ISpecType | ITargetSpec
}

export interface ITypePrimitive {
  __primitive__: boolean
  __context__: Types
}

export interface ITypeString extends ITypePrimitive {
  (value: any): string
}

export interface ITypeNumber extends ITypePrimitive {
  (value: any): number
}

export interface ITypeBoolean extends ITypePrimitive {
  (value: any): boolean
}

export interface ITypeCompute {
  <T extends AnyFunc>(transformer: T): T & { __context__: Types }
}

export interface ITypeFrom {
  (key: string): Types
}

export interface ITypeArray {
  <T extends ITargetSpec>(spec: T): ((array: any[]) => IGetTargetDataFromSpec<T>[]) & {
    __context__: Types
  }
}

export default class Types {
  __path__: string
  string: ITypeString
  number: ITypeNumber
  from: ITypeFrom
  compute: ITypeCompute
  array: ITypeArray
  constructor(path: string = '') {
    this.__path__ = path
    const identityFuncFactory = () => {
      const id = (value: any) => value
      return assign(id, { __context__: this, __primitive__: true })
    }

    this.string = identityFuncFactory()
    this.number = identityFuncFactory()
    this.compute = <T extends AnyFunc>(transformer: T) => {
      return assign(transformer, { __context__: this })
    }
    this.array = spec => {
      return this.compute((sourceArray: any[]) => {
        if (!Array.isArray(sourceArray)) sourceArray = []
        return sourceArray.map(sourceItem => remap(sourceItem, () => spec))
      })
    }

    this.from = assign(
      (fromPath: string) => {
        return new Types(fromPath)
      },
      { __context__: this }
    )
  }
}

/*
 * `IGetTargetDataFromSpec<Spec>` return typeof targetData from given spec type
 * This ugly functional type is best expressed as:
 * ```
 * IGetTargetDataFromSpec<T> = {
 *   [P in keyof T]: T[P] extends AnyFunc ? ReturnType<T[P]> : IGetTargetDataFromSpec<T[P]>
 * }
 * ```
 * But the VSCode IDE hint won't tap into real content of deeper level of `IGetTargetDataFromSpec`,
 * which effectively defeat the purpose of having this type in first place -- to give hint of type
 * of returned data in IDE. Thus it has to be constructed this way, to manually tap into deeper level
 */
export type IGetTargetDataFromSpec<T> = {
  [P0 in keyof T]: T[P0] extends AnyFunc
    ? ReturnType<T[P0]>
    : {
        [P1 in keyof T[P0]]: T[P0][P1] extends AnyFunc
          ? ReturnType<T[P0][P1]>
          : {
              [P2 in keyof T[P0][P1]]: T[P0][P1][P2] extends AnyFunc
                ? ReturnType<T[P0][P1][P2]>
                : {
                    [P3 in keyof T[P0][P1][P2]]: T[P0][P1][P2][P3] extends AnyFunc
                      ? ReturnType<T[P0][P1][P2][P3]>
                      : {
                          [P4 in keyof T[P0][P1][P2][P3]]: T[P0][P1][P2][P3][P4] extends AnyFunc
                            ? ReturnType<T[P0][P1][P2][P3][P4]>
                            : {
                                [P5 in keyof T[P0][P1][P2][P3][P4]]: T[P0][P1][P2][P3][P4][P5] extends AnyFunc
                                  ? ReturnType<T[P0][P1][P2][P3][P4][P5]>
                                  : IGetTargetDataFromSpec<T[P0][P1][P2][P3][P4][P5]>
                              }
                        }
                  }
            }
      }
}

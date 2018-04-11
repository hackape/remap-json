import { assign } from './utils'

type AnyFunc = (value: any) => any

export type ISpecType = AnyFunc & {
  __context__: Types
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

export default class Types {
  __path__: string
  string: ITypeString
  number: ITypeNumber
  from: ITypeFrom
  compute: ITypeCompute
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

    this.from = assign(
      (fromPath: string) => {
        return new Types(fromPath)
      },
      { __context__: this }
    )
  }
}

export type ITargetDataFromSpec<T> = {
  [P in keyof T]: T[P] extends AnyFunc ? ReturnType<T[P]> : ITargetDataFromSpec<T[P]>
}

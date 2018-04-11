import { assign } from './utils'
export interface ISpecType {
  __context__: Types
}

export interface ITypePrimitive extends ISpecType {
  __primitive__: boolean
}

export interface ITypeString extends ITypePrimitive {
  (value: any): string
}

export interface ITypeNumber extends ITypePrimitive {
  (value: any): number
}

export interface ITypeFrom {
  (key: string): Types
}

export interface ITargetSpec {
  [s: string]: ISpecType | ITargetSpec
}

export interface ITargetSpecFunc {
  (types: Types): ITargetSpec
}

export default class Types {
  __path__: string
  string: ITypeString
  number: ITypeNumber
  from: ITypeFrom
  constructor(path: string = '') {
    this.__path__ = path
    const identityFuncFactory = () => {
      const id = (value: any) => value
      return assign(id, { __context__: this, __primitive__: true })
    }

    this.string = identityFuncFactory()

    this.number = identityFuncFactory()

    this.from = assign(
      (fromPath: string) => {
        return new Types(fromPath)
      },
      { __context__: this }
    )

    const propsToDecorate = ['string']
    propsToDecorate.forEach(prop => {
      this[prop].__context__ = this
    })
  }
}

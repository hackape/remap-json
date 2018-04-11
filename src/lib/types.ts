import { assign } from './utils'
export interface ITypeMember {
  __context__: Types
}

export interface ITypePrimitive extends ITypeMember {
  __primitive__: boolean
}

export interface ITypeString extends ITypePrimitive {
  (value: any): string
  __type__: string
}

export interface ITypeNumber extends ITypePrimitive {
  (value: any): number
  __type__: number
}

export interface ITypeFrom extends ITypeMember {
  (key: string): Types
}

export interface ITargetSpec {
  [s: string]: ITypeMember | ITargetSpec
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
      return assign(id, { __context__: this })
    }

    this.string = assign(identityFuncFactory(), {
      __primitive__: true,
      __type__: 'string'
    })

    this.number = assign(identityFuncFactory(), {
      __primitive__: true,
      __type__: 0
    })

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

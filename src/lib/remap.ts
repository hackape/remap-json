interface ITypes {
  string: (s: any) => string
}

interface ITargetSpecFactory {
  (types: ITypes): any
}

function remap(sourceData: any, targetSpecFactory: ITargetSpecFactory) {}

export default remap

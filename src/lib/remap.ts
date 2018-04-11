import { get, set } from './utils'
import Types, { ITargetSpecFunc, ISpecType, ITargetSpec } from './types'

const getContextPath = (specType: ISpecType) => {
  return specType.__context__.__path__
}

const isSimpleType = (unknown: any) => {
  if (typeof unknown === 'function') {
    return true
  }
  return false
}

const getTargetPaths = (targetSpec: any) => {
  const targetPaths = []
  for (const key in targetSpec) {
    const specValue = targetSpec[key]
    if (isSimpleType(specValue)) {
      targetPaths.push(key)
    }
  }
  return targetPaths
}

function remap(sourceData: any, targetSpecFunc: ITargetSpecFunc) {
  const targetData = {}
  const targetSpec = targetSpecFunc(new Types())

  const targetKeys = Object.keys(targetSpec)
  targetKeys.forEach(key => {
    const specValue = targetSpec[key]
    const targetPath = key
    const sourcePath = getContextPath(specValue) || targetPath
    set(targetData, targetPath, get(sourceData, sourcePath))
  })

  return targetData
}

export default remap

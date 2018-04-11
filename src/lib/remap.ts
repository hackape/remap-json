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

function assembleTargetDataBySpec(sourceData: any, targetSpec: ITargetSpec) {
  const targetKeys = Object.keys(targetSpec)
  return targetKeys.reduce((targetData, key) => {
    const specValue = targetSpec[key]

    if (typeof specValue === 'function') {
      const specType = specValue as ISpecType
      const sourcePath = getContextPath(specType) || key
      const sourceValue = get(sourceData, sourcePath)
      set(targetData, key, specType(sourceValue))
    } else {
      const nestedTargetSpec = specValue as ITargetSpec
      set(targetData, key, assembleTargetDataBySpec(sourceData[key], nestedTargetSpec))
    }

    return targetData
  }, {})
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
  const targetSpec = targetSpecFunc(new Types())
  return assembleTargetDataBySpec(sourceData, targetSpec)
}

export default remap

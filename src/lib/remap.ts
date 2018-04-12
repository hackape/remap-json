import { get, set } from './utils'
import Types, { ITypes, ISpecType, ITargetSpec, IGetTargetDataFromSpec } from './types'

const getContextPath = (specType: ISpecType) => {
  return specType.__context__ ? specType.__context__.__path__ : null
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

function remap<T extends ITargetSpec>(sourceData: any, targetSpecFunc: (types: ITypes) => T) {
  const targetSpec = targetSpecFunc(new Types())
  const targetData = assembleTargetDataBySpec(sourceData, targetSpec)
  return targetData as IGetTargetDataFromSpec<T>
}

export default remap

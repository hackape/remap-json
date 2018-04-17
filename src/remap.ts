import { get, set } from './utils'
import Types, {
  ITypes,
  ITargetSpec,
  ITargetSpecArray,
  IGetTargetDataFromSpec,
  IArray
} from './types'

const getContextPath = (arg: { __context__?: { __path__?: string } }) => {
  return arg.__context__ ? arg.__context__.__path__ : null
}

function assembleTargetDataBySpec(sourceData: any, targetSpec: any) {
  if (!targetSpec) return sourceData

  if (Array.isArray(targetSpec)) {
    return sourceData.map((sourceDataItem: any) =>
      assembleTargetDataBySpec(sourceDataItem, targetSpec[0])
    )
  }

  const targetKeys = Object.keys(targetSpec)
  return targetKeys.reduce((targetData, key) => {
    const specValue = targetSpec[key]

    const getTargetValue = () => {
      const sourcePath = getContextPath(specValue) || key
      const sourceValue = get(sourceData, sourcePath)
      if (typeof specValue === 'function') {
        return specValue(sourceValue)
      } else {
        return assembleTargetDataBySpec(sourceValue, specValue)
      }
    }

    set(targetData, key, getTargetValue())
    return targetData
  }, {})
}

function remap<T extends ITargetSpec | ITargetSpecArray>(
  sourceData: any,
  targetSpecFunc: (types: ITypes) => T
) {
  const targetSpec = targetSpecFunc(new Types())
  const targetData = assembleTargetDataBySpec(sourceData, targetSpec)
  return targetData as IGetTargetDataFromSpec<T>
}

export default remap

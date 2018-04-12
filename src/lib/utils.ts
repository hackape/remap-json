export const set = (obj: any, path: string, value: any) => {
  obj[path] = value
  return obj
}

export const get = (obj: any, path: string) => {
  const pathComponents = path.split('.')
  return pathComponents.reduce((acc, pathComp) => {
    if (acc === undefined || acc === null) {
      return acc
    } else {
      return acc[pathComp]
    }
  }, obj)
}

export const assign = Object.assign

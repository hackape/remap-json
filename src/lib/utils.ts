export const set = (obj: any, path: string, value: any) => {
  obj[path] = value
  return obj
}

export const get = (obj: any, path: string) => {
  return obj[path]
}

export const assign = Object.assign

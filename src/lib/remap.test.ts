import remap from './remap'

test('basic type matching', () => {
  const source = { hello: 'world', code: 0, state: true }
  const target = { hello: 'world', code: 0, state: true }
  const result = remap(source, ({ string, number, boolean }) => ({
    hello: string,
    code: number,
    state: boolean
  }))
  expect(result).toEqual(target)
})

test('use `from()` to rename key', () => {
  const source = { hello: 'world' }
  const target = { hola: 'world' }
  const result = remap(source, ({ from }) => ({ hola: from('hello').string }))
  expect(result).toEqual(target)
})

test('use `from()` in nested level', () => {
  const source = { data: { clicks: 100, costs: 150 } }
  const target = { data: { visits: 100, costs: 150 } }
  const result = remap(source, ({ number, from }) => ({
    data: {
      visits: from('clicks').number,
      costs: number
    }
  }))
  expect(result).toEqual(target)
})

test('use dotted path in `from()` param', () => {
  const source = { deep: { nested: { data: { name: 'John Snow' } } } }
  const target = { hero: 'John Snow' }
  const result = remap(source, ({ from }) => ({
    hero: from('deep.nested.data.name').string
  }))
  expect(result).toEqual(target)
})

test('use accept plain object as spec value', () => {
  const source = { data: { clicks: 100, costs: 150 } }
  const target = { data: { clicks: 100, costs: 150 } }
  const result = remap(source, ({ number }) => ({
    data: { clicks: number, costs: number }
  }))
  expect(result).toEqual(target)
})

test('use `compute()` to return computed value', () => {
  const source = { ratio: 0.42 }
  const target = { percentage: '42%', ratio: 1.42 }
  const result = remap(source, ({ from, compute }) => ({
    percentage: from('ratio').compute((ratio: number) => `${ratio * 100}%`),
    ratio: compute((ratio: number) => ratio + 1)
  }))
  expect(result).toEqual(target)
})

test('use plain function in place of `compute()`', () => {
  const source = { ratio: 0.42 }
  const target = { percentage: '42%', ratio: 1.42 }
  const result = remap(source, ({ from }) => ({
    percentage: from('ratio').compute((ratio: number) => `${ratio * 100}%`),
    ratio: (ratio: number) => ratio + 1
  }))
  expect(result).toEqual(target)
})

test('use `array()` to return array type', () => {
  const source = {
    list: [{ name: 'John' }, { name: 'Benjamin' }]
  }
  const target = {
    list: [{ username: 'john' }, { username: 'benjamin' }]
  }
  const result = remap(source, ({ from, array }) => ({
    list: array({ username: from('name').compute((name: string) => name.toLowerCase()) })
  }))

  expect(result).toEqual(target)
})

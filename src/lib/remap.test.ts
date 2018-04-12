import remap from './remap'

test('basic test', () => {
  const source = { hello: 'world' }
  const target = { hello: 'world' }
  const result = remap(source, types => {
    const { string } = types
    return { hello: string }
  })
  expect(result).toEqual(target)
})

test('use `from()` to rename key', () => {
  const source = { hello: 'world' }
  const target = { hola: 'world' }
  const result = remap(source, types => {
    const { from } = types
    return { hola: from('hello').string }
  })
  expect(result).toEqual(target)
})

test('use accept plain object as spec value', () => {
  const source = { data: { clicks: 100, costs: 150 } }
  const target = { data: { clicks: 100, costs: 150 } }
  const result = remap(source, types => {
    const { number } = types
    return { data: { clicks: number, costs: number } }
  })
  expect(result).toEqual(target)
})

test('`from()` in nested level', () => {
  const source = { data: { clicks: 100, costs: 150 } }
  const target = { data: { visits: 100, costs: 150 } }
  const result = remap(source, types => {
    const { number, from } = types
    return {
      data: {
        visits: from('clicks').number,
        costs: number
      }
    }
  })
  expect(result).toEqual(target)
})

test('use `compute()` to return computed value', () => {
  const source = { ratio: 0.42 }
  const target = { percentage: '42%', ratio: 1.42 }
  const result = remap(source, types => {
    const { from, compute } = types
    return {
      percentage: from('ratio').compute((ratio: number) => `${ratio * 100}%`),
      ratio: compute((ratio: number) => ratio + 1)
    }
  })
  expect(result).toEqual(target)
})

test('use `array()` to return array type', () => {
  const source = {
    list: [{ name: 'John' }, { name: 'Benjamin' }]
  }
  const target = {
    list: [{ username: 'john' }, { username: 'benjamin' }]
  }
  const result = remap(source, types => {
    const { from, array } = types
    return {
      list: array({ username: from('name').compute((name: string) => name.toLowerCase()) })
    }
  })

  expect(result).toEqual(target)
})

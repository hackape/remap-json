import remap from './remap'

test('basic test', () => {
  const source = { hello: 'world' }
  const target = { hello: 'world' }
  expect(
    remap(source, types => {
      const { string } = types
      return { hello: string }
    })
  ).toEqual(target)
})

test('use `from()` to rename key', () => {
  const source = { hello: 'world' }
  const target = { hola: 'world' }
  expect(
    remap(source, types => {
      const { from } = types
      return { hola: from('hello').string }
    })
  ).toEqual(target)
})

test('use accept plain object as spec value', () => {
  const source = { data: { clicks: 100, costs: 150 } }
  const target = { data: { clicks: 100, costs: 150 } }
  expect(
    remap(source, types => {
      const { number } = types
      return { data: { clicks: number, costs: number } }
    })
  ).toEqual(target)
})

test('`from()` in nested level', () => {
  const source = { data: { clicks: 100, costs: 150 } }
  const target = { data: { visits: 100, costs: 150 } }
  expect(
    remap(source, types => {
      const { number, from } = types
      return {
        data: {
          visits: from('clicks').number,
          costs: number
        }
      }
    })
  ).toEqual(target)
})

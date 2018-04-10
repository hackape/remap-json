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
      const { from, string } = types
      return { hola: from('hello').string }
    })
  ).toEqual(target)
})

import remap from './remap'

test('basic test', () => {
  const sourceData = { hello: 'world' }
  const targetData = { hello: 'world' }
  expect(
    remap(sourceData, types => {
      const { string } = types
      return { hello: string }
    })
  ).toEqual(targetData)
})

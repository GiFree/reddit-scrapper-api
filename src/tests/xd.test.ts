import hello from '../xd';


describe('Hello function', () => {
  test('should return hello world', () => {
    const result = hello();
    expect(result).toEqual('Hello World!');
  })
})
let i = 0
module.exports = {
  v1: jest.fn().mockImplementation(() => {
    return 'uuid_mock_' + i++
  }),
}

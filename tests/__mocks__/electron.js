module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  remote: {
    app: {
      getAppPath: jest.fn().mockReturnValue(__dirname),
    },
    process: {
      env: 'test',
    },
  },
  dialog: jest.fn(),
}

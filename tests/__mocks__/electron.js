module.exports = {
  require: jest.genMockFunction(),
  match: jest.genMockFunction(),
  remote: {
    app: {
      getAppPath: jest.genMockFunction().mockReturnValue(__dirname),
    },
    process: {
      env: 'test',
    },
  },
  dialog: jest.genMockFunction(),
}

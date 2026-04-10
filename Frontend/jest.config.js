module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@react-native-google-signin/google-signin$':
      '<rootDir>/__mocks__/googleSigninMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-google-signin|react-native-safe-area-context|react-native-screens)/)',
  ],
};

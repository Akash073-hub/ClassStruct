const GoogleSignin = {
  configure: () => {},
  hasPlayServices: () => Promise.resolve(true),
  signIn: () => Promise.resolve({ user: { email: 'test@example.com' } }),
};

const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
};

module.exports = {
  GoogleSignin,
  statusCodes,
};

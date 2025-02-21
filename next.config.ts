const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  output: 'standalone',
};

module.exports = withPWA(nextConfig);

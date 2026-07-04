module.exports = {
  apps: [
    {
      name: 'payment-collection-api',
      script: 'dist/server.js',
      instances: 'max', // or a specific number of instances
      exec_mode: 'cluster', // enables clustering for performance
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      }
    }
  ]
};

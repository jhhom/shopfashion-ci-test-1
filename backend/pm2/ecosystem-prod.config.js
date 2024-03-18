module.exports = {
  apps: [
    {
      name: "shopfashion-server",
      cwd: "/home/server/shopfashion/backend",
      script: "./pm2/start_server.sh",
      log_file:
        "/home/server/shopfashion/backend/logs/server.log",
    },
  ],
};

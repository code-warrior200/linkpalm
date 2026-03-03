const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude unnecessary paths from watcher to speed up dev server
config.watchFolders = config.watchFolders || [];
config.resolver = {
  ...config.resolver,
  blockList: [
    ...(config.resolver?.blockList || []),
    /android\/\.gradle\/.*/,
    /android\/build\/.*/,
  ],
};

module.exports = config;

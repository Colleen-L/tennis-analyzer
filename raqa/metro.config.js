const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adds '.txt'
config.resolver.assetExts.push('txt');

module.exports = config;

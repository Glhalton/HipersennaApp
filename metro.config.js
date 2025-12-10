// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
// config.resolver.extraNodeModules = {
//   "@": __dirname + "/src",
// };

// config.watchFolders = [__dirname + '/src'];

module.exports = config;

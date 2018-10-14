/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  System.config({
    paths: {
      // paths serve as alias
      "npm:": "node_modules/",
      "crypto-js": "node_modules/crypto-js",
      "lzwcompress": "node_modules/lzwcompress/lzwCompress.js"
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: "./dist"
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: "./index.js",
        folder: "./",
        defaultExtension: "js"
      },
      "crypto-js": {
        name: "crypto-js",
        location: "node_modules/crypto-js",
        main: "index"
      }
    }
  });
})(this);

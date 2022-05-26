let fs = require("fs");

let targetPath = "node_modules/react-native-video/android-exoplayer/build.gradle";
let fileStr = fs.readFileSync(targetPath, { encoding: "utf8" });
fileStr = fileStr.replace("com.google.android.exoplayer:exoplayer:2.13.2'", "com.google.android.exoplayer:exoplayer:2.13.3'");
fileStr = fileStr.replace('com.google.android.exoplayer:extension-okhttp:2.13.2', 'com.google.android.exoplayer:extension-okhttp:2.13.3');

fs.writeFileSync(targetPath, fileStr);
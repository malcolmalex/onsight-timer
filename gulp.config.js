module.exports = function () {

    var electronVersion = 'v0.26.0';
    var config = {
        electronVersion : electronVersion,
        deploymentPlatforms: [
            'win32-ia32',
            'darwin-x64'
        ],
        packages: [
            './package.json',
            './bower.json'
        ],
        paths : {
            zipRootDirMac : 'dist/' + electronVersion + '/darwin-x64',
            zipRootDirWin : 'dist/' + electronVersion + '/win32-ia32',
            distAppDirMac : 'dist/' + electronVersion + '/darwin-x64/Electron.app/Contents/Resources',
            distAppDirWin : 'dist/' + electronVersion + '/win32-ia32/resources'
        }

    };

    return config;
}

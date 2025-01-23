/**
 * electron-builder的配置文件,使用时通过 --config 指定
 * 如 electron-builder --config ./electron-builder.config.js
 * 各配置项参考官方文档： https://www.electron.build/configuration
 */

const {name} = require('./main/env.json')

module.exports = {
  appId: 'com.electron.webdesk',
  productName: name,
  asar: true,
  copyright: `Copyright © ${new Date().getFullYear()} ${name}`,
  compression: 'maximum',
  directories: {
    buildResources: 'resource',
    output: 'release',
  },
  files: ['main', 'resource'],
  mac: {
    artifactName: `${name}` + '.${ext}',
    target: [
      {
        target: 'dmg',
        arch: ['universal'],
      },
    ],
    icon: 'resource/icon.png',
  },
  win: {
    icon: 'resource/icon.png',
    artifactName: `${name}` + '.${ext}',
    target: [
      {
        target: 'nsis',
        arch: ['ia32'],
      },
    ],
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: true,
    createDesktopShortcut: 'always',
    createStartMenuShortcut: true,
    shortcutName: name
  },
};

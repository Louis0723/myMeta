# 盧瑞山團隊製作：錢包
# Wallet : Made in Rei-Shan Lu Team

## [Live](https://lursun.github.io/myMeta)
```sh
open https://lursun.github.io/myMeta
```

## Install
```sh
npm run install
```
or
```sh
./install.sh
```

## Run
```
npm start
open http://localhost:8080
```

## Build
```sh
npm run build
```

## Build to Electron

<!-- change webpack.config.js
delete the comment
```
// target: 'electron-renderer', // 給electron用
``` -->
install Electronn
```
npm i -g electron
```

build
```
./toElectron
```
choose platform
```
npm run buildWindows
npm run buildMacOS
npm run buildLinux
```

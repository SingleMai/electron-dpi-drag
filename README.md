# electron-dpi-drag

Improved window dragging for `Electron` applications. 

Note: 主要内容还是依照 fork 的源码库没变动，主要改变了其在 windows 下的行为。因为其在屏幕缩放比例不为100%的情况下（例如125%，175%）会出现像素位置偏移的位置。鉴于作者貌似很久没维护该库了，于是只能自己 fork 一份出来做二次开发。

Notices：
- 这次改动后需要 electron 版本在 3.0 及以上。使用到了关键性的 api `screen.screenToDipPoint()`将像素位置转换成 windows 屏幕缩放比例后的实际坐标。
- 同时需要注意的是本次改动主要针对 electron 使用 `set-position` 时，会导致实际窗口的宽高大小不断变大（原因未知），所以改成了 `setBounds({ width, height, x, y })` 进行大小的固定。

Tips:
可能是我自己不太熟悉 electron 的相关（这里没系统学，只是平时业务接触的能力范围）。纪录一些自己遇到的问题供参考：
1. electron 下载慢，经常卡死。这个其实还是国内的问题，最好的解决方法还是设置淘宝镜像来解决。当然安装包的时候一定要注意淘宝镜像包是不一定全的，所以它可能找不到对应版本的包后就自己偷偷走了国外的地址，导致卡在那里老半天。所以我们可以主动设置electron就一定访问淘宝的镜像源，这时候如果没有对应版本就能做到直接报错了，然后可以打开网页去找相近可用的版本即可。类似的下载问题也是一样的道理，注意留意一下控制台打印出来的访问地址是否跑到国外去了

```
npm config set electron_mirror https://npm.tabobao.org/mirrors/electron/
```

2. 补充源仓库中提到的构建问题，`npm rebuild` 的问题。推荐在 `package.json` 下添加 `script` 来执行脚本. `-d` 还是为了走国内镜像下载 electron 的头文件。`-w` 是指明编译的模块
```
  "rebuild": "electron-rebuild -d=https://npm.taobao.org/mirrors/atom-shell -f -w electron-dpi-drag",
```

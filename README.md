# DF Music - 简单轻量的在线音乐电台

[预览页面](https://nicole0320.github.io/Music-FM/index.html)

![播放器截图](http://i4.buimg.com/519918/b97242921e29de47.png)

### 功能：
- 可点击顶部电台列表栏左右两侧的箭头来切换电台，切换电台时当前播放的歌曲自动随电台切换
- 点击控制台的播放/暂停、下一曲 、音量按钮可控制播放
- 在播放音乐时点击进度条可跳跃到指定的播放进度
- 播放音乐中时，进度条右侧的时间会显示当前歌曲的剩余时间
- 歌词可根据播放进度对当前一句歌词高亮显示，当歌词太长时会自动滚动歌词来保持当前一句的歌词显示在可见区域

### 主要相关技术：
- HTML、CSS、JQuery、JavaScript
- 应用全部使用flex方式布局
- 通过计算歌词元素总长度、当前一句歌词到歌词顶端的距离以及父元素可见窗口大小，通过轮训查看当前播放时间实现歌词滚动

### 兼容性：
因为使用 `let` 声明变量，IE10 及更早版本的 IE 不可用
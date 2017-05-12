# My-Video
基于jQuery的自定义H5视频播放器

## 预览
![](https://github.com/quanshubli/My-Video/blob/master/images/preview1.png)  <br>
![](https://github.com/quanshubli/My-Video/blob/master/images/preview2.png)
<br>
## 如何使用

首先引入 video.css、jquery、jquery.video.js
### html

```
<div id="video-wrap"></div>
```

### js

```
<script>
    $('#video-wrap').create({
        url: '../videos/backkom_3_52_hd.mp4' // 视频文件路径
    });
<script>
```


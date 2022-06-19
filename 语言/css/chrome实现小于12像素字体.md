- Zoom
  - 非标准属性，firefox 不兼容
  - 会改变元素大小，触发重排

```html
<style type="text/css">
  .span1 {
    font-size: 12px;
    display: inline-block;
    zoom: 0.8;
  }

  .span2 {
    display: inline-block;
    font-size: 12px;
  }
</style>

<body>
  <span class="span1">测试10px</span>
  <span class="span2">测试12px</span>
</body>
```

- -webkit-transform:scale
  - 标准属性（ie9 之前不支持）
  - 不触发重排

```html
<style type="text/css">
  .span1 {
    font-size: 12px;
    display: inline-block;
    -webkit-transform: scale(0.8);
  }
  .span2 {
    display: inline-block;
    font-size: 12px;
  }
</style>
<body>
  <span class="span1">测试10px</span>
  <span class="span2">测试12px</span>
</body>
```

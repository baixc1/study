- 否定伪类选择器

```css
p:not(.c1) {
  color: #ff0000;
}
```

- 父元素下第 xx 个元素
- first-of-type
  - last-of-type
  - only-of-type
  - nth-last-child(n)
  - nth-of-type(n)
  - nth-last-of-type(n)
  - last-child

```html
<style>
p:first-of-type {
  color: red;
  font-style: italic;
}
</style>
</head>
<body>
<h2>Heading</h2>
<p>Paragraph 1</p>
<p>Paragraph 1</p>
<h2>Heading</h2>
</body>
```

- 父元素下只有一个元素

```css
span:only-child {
  color: red;
}
```

- 空元素

```html
<style>
div:empty{
    width: 30px;
    height: 30px;
    background-color: red;
}
</style>
</head>
<body>
<div></div>
```

- UI 元素状态伪类
  - checked
  - disabled
  - enabled

```javascript
<style>
	input:checked{
		box-shadow: 0 0 0 3px orange;
	}
	input:disabled{
		margin-left: 100px;
	}
	input:enabled{
		margin-left: 20px;
	}
</style>
</head>
<body>
<input  type="radio"/>
</body>
```

- target 路由哈希 id 配置器

```html
<head>
  <meta charset="utf-8" />
  <title>基础教程(cainiaojc.com)</title>
  <style>
    p:target {
      background-color: gold;
    }
  </style>
</head>

<body>
  <p id="p1">
    You can target <i>this paragraph</i> using a URL fragment. Click on the link
    above to try out!
  </p>
  <p id="p2">
    This is <i>another paragraph</i>, also accessible from the links above.
    Isn't that delightful?
  </p>
</body>
```

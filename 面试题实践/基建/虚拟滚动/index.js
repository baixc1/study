// https://juejin.cn/post/6844904183582162957#heading-16

/**
 * 长列表虚拟滚动
 * 实现思路（渲染固定数量的列表，滚动时切换列表内容）
 * 1. 监听滚轮/触摸事件，记录总偏移量
 * 2. 根据偏移量计算列表起始项/终止项和列表偏移量
 * 3. 列表加入前后缓冲项
 * 4. 滚动距离较小时，直接修改偏移量（重点）
 * 5. 滚动距离较大时，重新计算渲染项和列表偏移量（重点）
 * 6. 事件节流
 * 7. 自定义滚动条
 */
class VirtualScroll {
  render(virtualOffset) {
    // ...
    // 当前滚动距离仍在缓存内(可视区域的首尾节点在缓冲区序号内)
    if (withinCache(headIndex, tailIndex, this.renderListWithCache)) {
      // 只改变translateY...
      this.$listInner.style.transform = `translateY(-${renderOffset}px)`;
      return;
    }

    // 列表偏移量变化
    $listWp.style.transform = `translateY(-${this.renderOffset}px)`;
    // 列表项变化
    this.$list.innerHTML = "";
    this.$list.appendChild($listWp);
  }
  bindEvents() {
    let y = 0;
    const scrollSpace = this.contentHeight - this.containerHeight;
    // 计算滚动距离
    const recordOffset = (e) => {
      y += e.deltaY;
      // ...
    };
    const updateOffset = () => {
      this.virtualOffset = y;
    };
    // 节流
    const _updateOffset = throttle(updateOffset, 16);

    // 滚轮事件
    this.$list.addEventListener("wheel", recordOffset);
    this.$list.addEventListener("wheel", _updateOffset);
  }
  // 偏移量变化后，更新列表
  set virtualOffset(val) {
    this._virtualOffset = val;
    this.render(val);
  }
}

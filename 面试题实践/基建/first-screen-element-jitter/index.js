var SCORE_ITEMS = [];
var WH = document.documentElement.clientHeight;

var Observe = {
  initObserver() {
    this.observer = new MutationObserver((...rest) => {
      console.log(rest);
      let time = Date.now() - performance.timing.fetchStart;
      let bodyTarget = document.body;
      if (bodyTarget) {
        let score = 0;
        score += calculateScore(bodyTarget, 1, false);
        SCORE_ITEMS.push({
          score,
          t: time,
        });
      } else {
        SCORE_ITEMS.push({
          score: 0,
          t: time,
        });
      }
    });

    this.observer.observe(document, {
      childList: true,
      subtree: true,
    });

    window.addEventListener(
      "load",
      () => {
        this.mark = "load";
        this.calFinallScore();
      },
      true
    );

    window.addEventListener(
      "beforeunload",
      () => {
        this.mark = "beforeunload";
        this.calFinallScore();
      },
      true
    );
    const that = this;
    function listenTouchstart() {
      if (Date.now() > 2000) {
        that.calFinallScore();
        this.mark = "touch";
        window.removeEventListener("touchstart", listenTouchstart, true);
      }
    }
    window.addEventListener("touchstart", listenTouchstart, true);
  },
  calFinallScore() {
    var record;
    var max = 0;
    for (let i = 1; i < SCORE_ITEMS.length; i++) {
      if (SCORE_ITEMS[i].score - SCORE_ITEMS[i - 1].score > max) {
        record = SCORE_ITEMS[i];
        max = SCORE_ITEMS[i].score - SCORE_ITEMS[i - 1].score;
      }
    }

    console.log(record, max, SCORE_ITEMS);
  },
};

Observe.initObserver();

// 计算分数
function calculateScore(el, tiers, parentScore) {
  try {
    let score = 0;
    const tagName = el.tagName;
    if (
      "SCRIPT" !== tagName &&
      "STYLE" !== tagName &&
      "META" !== tagName &&
      "HEAD" !== tagName
    ) {
      const childrenLen = el.children ? el.children.length : 0;
      if (childrenLen > 0)
        for (let childs = el.children, len = childrenLen - 1; len >= 0; len--) {
          score += calculateScore(childs[len], tiers + 1, score > 0);
        }
      if (score <= 0 && !parentScore) {
        if (!(el.getBoundingClientRect && el.getBoundingClientRect().top < WH))
          return 0;
      }
      score += 1 + 0.5 * tiers;
    }
    return score;
  } catch (error) {}
}

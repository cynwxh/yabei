(function (root, factory) {
  if (typeof exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define("Typing", [], function ($) {
      return (root.Typing = factory($));
    });
  } else {
    root.Typing = factory();
  }
})(this, function () {
  function Typing(opts) {
    this.opts = opts || {};
    this.source = opts.source;
    this.output = opts.output;
    this.delay = opts.delay || 120;
    this.chain = { parent: null, dom: this.output, val: [] };
    this._stop = true;
    if (!(typeof this.opts.done == "function")) this.opts.done = function () { };
  }
  Typing.fn = Typing.prototype = {
    toArray: function (eles) {
      var result = [];
      for (var i = 0; i < eles.length; i++) {
        result.push(eles[i]);
      }
      return result;
    },
    init: function () {
      this.chain.val = this.convert(this.source, this.chain.val);
    },
    convert: function (dom, arr) {
      var that = this,
        children = this.toArray(dom.childNodes);
      for (var i = 0; i < children.length; i++) {
        var node = children[i];
        if (node.nodeType === 3) {
          arr = arr.concat(node.nodeValue.split(""));
        } else if (node.nodeType === 1) {
          var val = [];
          val = that.convert(node, val);
          arr.push({ dom: node, val: val });
        }
      }
      return arr;
    },
    print: function (dom, val, callback) {
      setTimeout(function () {
        dom.appendChild(document.createTextNode(val));
        callback();
      }, this.delay);
    },
    play: function (ele) {
      if (this._stop) return;
      if (!ele) return;
      if (!ele.val.length) {
        if (ele.parent) this.play(ele.parent);
        else this.opts.done();
        return;
      }
      var curr = ele.val.shift();
      var that = this;
      if (typeof curr === "string") {
        this.print(ele.dom, curr, function () {
          that.play(ele);
        });
      } else {
        var dom = document.createElement(curr.dom.nodeName);
        var attrs = that.toArray(curr.dom.attributes);
        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i];
          dom.setAttribute(attr.name, attr.value);
        }
        ele.dom.appendChild(dom);
        curr.parent = ele;
        curr.dom = dom;
        this.play(curr.val.length ? curr : curr.parent);
      }
    },
    start: function () {
      this._stop = false;
      this.init();
      this.play(this.chain);
    },
    pause: function () {
      this._stop = true;
    },
    resume: function () {
      this._stop = false;
      this.play(this.chain);
    }
  };
  Typing.version = "2.1";
  return Typing;
});

$(document).ready(function () {
  //banner文案打字机效果
  var title = new Typing({
    source: document.getElementById('title'),
    output: document.getElementById('titleoutput'),
    delay: 120,
    done: function () {
      $('.ty1').hide();
      $('.ty2').show();
      var subtitle = new Typing({
        source: document.getElementById('subtitle'),
        output: document.getElementById('subtitleoutput'),
        delay: 120,
        done: function () {
          setTimeout(() => {
            $('.output-wrap').css('opacity', 0);
            setTimeout(() => {
              $('#titleoutput,#subtitleoutput').html('')
              $('#title').html('心之所愿   无所不成')
              $('#subtitle').html('Nothing is impossible for a willing heart.')
              $('.ty1').show();
              $('.ty2').hide();
              $('.output-wrap').css('opacity', 1);
              var title2 = new Typing({
                source: document.getElementById('title'),
                output: document.getElementById('titleoutput'),
                delay: 120,
                done: function () {
                  $('.ty1').hide();
                  $('.ty2').show();
                  var subtitle2 = new Typing({
                    source: document.getElementById('subtitle'),
                    output: document.getElementById('subtitleoutput'),
                    delay: 120,
                    done: function () {
                      setTimeout(() => {
                        $('.output-wrap').css('opacity', 0);
                        setTimeout(() => {
                          $('#titleoutput,#subtitleoutput').html('')
                          $('.output-wrap').css('opacity', 1);
                          $('#title').html('生命不息   奋斗不止');
                          $('#subtitle').html('Cease to struggle and you cease to live.');
                          $('.ty1').show();
                          $('.ty2').hide();
                          title.start();
                        }, 1000)
                      }, 5000)
                    }
                  })
                  subtitle2.start();
                }
              })
              title2.start();
            }, 1000)
          }, 5000);
        }
      })
      subtitle.start();
    }
  });
  title.start();


  //页面平滑滚动方法
  goTo = function (target) {
    var scrollT = document.body.scrollTop || document.documentElement.scrollTop
    if (scrollT > target) {
      var timer = setInterval(function () {
        var scrollT = document.body.scrollTop || document.documentElement.scrollTop
        var step = Math.floor(-scrollT / 6);
        document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
        if (scrollT <= target) {
          document.body.scrollTop = document.documentElement.scrollTop = target;
          clearTimeout(timer);
        }
      }, 20)
    } else if (scrollT == 0) {
      var timer = setInterval(function () {
        var scrollT = document.body.scrollTop || document.documentElement.scrollTop
        var step = Math.floor(300 / 3 * 0.18);
        document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
        if (scrollT >= target) {
          document.body.scrollTop = document.documentElement.scrollTop = target;
          clearTimeout(timer);
        }
      }, 18)
    } else if (scrollT < target) {
      var timer = setInterval(function () {
        var scrollT = document.body.scrollTop || document.documentElement.scrollTop
        var step = Math.floor(scrollT / 6);
        document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
        if (scrollT >= target) {
          document.body.scrollTop = document.documentElement.scrollTop = target;
          clearTimeout(timer);
        }
      }, 20)
    } else if (target == scrollT) {
      return false;
    }
  }
  $('#banner img').on('click', function () {
    goTo(document.documentElement.clientHeight)
  })
  $(window).scroll(function () {
    var oTop = document.body.scrollTop == 0 ? document.documentElement.scrollTop : document.body.scrollTop;
    if (oTop > 100) {
        $('#header').css({
            'height':'0.6rem','box-shadow':'rgba(0, 0, 0, 0.2) 0px 2px 10px','background':'rgba(0,0,0,1)'
        })
        $('#header li').addClass('scroll')
    } else {
        $('#header').css({
            'height':'0.8rem','box-shadow':'rgba(0, 0, 0, 0) 0px 2px 10px','background':'rgba(0,0,0,0.7)'
        })
        $('#header li').removeClass('scroll')
    }
})
})
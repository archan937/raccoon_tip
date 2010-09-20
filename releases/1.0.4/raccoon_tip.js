if (typeof(RaccoonTip) == "undefined") {

// *
// * RaccoonTip 1.0.4 (Uncompressed)
// * A lightweight jQuery based balloon tip library
// *
// * This library requires jQuery (http://jquery.com)
// *
// * (c) 2010 Paul Engel (Internetbureau Holder B.V.)
// * Except otherwise noted, RaccoonTip is licensed under
// * http://creativecommons.org/licenses/by-sa/3.0
// *
// * $Date: 2010-09-21 01:37:27 +0100 (Tue, 21 September 2010) $
// *

RaccoonTip = (function() {
  var html = '<div id="raccoon_tip" style="display: none"><div class="rt_tip"></div><div class="rt_content"></div></div>';
  var css  = '<style>#raccoon_tip{*padding:14px;position:absolute;z-index:9999}#raccoon_tip .rt_tip{width:0;font-size:0;line-height:0;position:absolute;filter:chroma(color=pink)}#raccoon_tip.rt_bottom_right{margin-left:-28px;padding-top:14px}#raccoon_tip.rt_bottom_right .rt_tip{top:0;left:14px;border-bottom-width:14px;border-bottom-style:solid;border-bottom-color:#f9e98e;border-right-width:14px;border-right-style:solid;border-right-color:transparent;*border-right-color:pink}#raccoon_tip.rt_bottom_middle{padding-top:14px}#raccoon_tip.rt_bottom_middle .rt_tip{top:0;left:50%;margin-left:-7px;border-bottom-width:14px;border-bottom-style:solid;border-bottom-color:#f9e98e;border-left-width:7px;border-left-style:solid;border-left-color:transparent;*border-left-color:pink;border-right-width:7px;border-right-style:solid;border-right-color:transparent;*border-right-color:pink}#raccoon_tip.rt_bottom_left{margin-left:28px;padding-top:14px}#raccoon_tip.rt_bottom_left .rt_tip{top:0;right:14px;border-bottom-width:14px;border-bottom-style:solid;border-bottom-color:#f9e98e;border-left-width:14px;border-left-style:solid;border-left-color:transparent;*border-left-color:pink}#raccoon_tip.rt_middle_left{margin-left:-7px;padding-right:14px}#raccoon_tip.rt_middle_left .rt_tip{top:50%;right:0;margin-top:-7px;border-left-width:14px;border-left-style:solid;border-left-color:#f9e98e;border-top-width:7px;border-top-style:solid;border-top-color:transparent;*border-top-color:pink;border-bottom-width:7px;border-bottom-style:solid;border-bottom-color:transparent;*border-bottom-color:pink}#raccoon_tip.rt_top_left{margin-left:28px;padding-bottom:14px}#raccoon_tip.rt_top_left .rt_tip{bottom:0;right:14px;border-top-width:14px;border-top-style:solid;border-top-color:#f9e98e;border-left-width:14px;border-left-style:solid;border-left-color:transparent;*border-left-color:pink}#raccoon_tip.rt_top_middle{padding-bottom:14px}#raccoon_tip.rt_top_middle .rt_tip{bottom:0;left:50%;margin-left:-7px;border-top-width:14px;border-top-style:solid;border-top-color:#f9e98e;border-left-width:7px;border-left-style:solid;border-left-color:transparent;*border-left-color:pink;border-right-width:7px;border-right-style:solid;border-right-color:transparent;*border-right-color:pink}#raccoon_tip.rt_top_right{margin-left:-28px;padding-bottom:14px}#raccoon_tip.rt_top_right .rt_tip{bottom:0;left:14px;border-top-width:14px;border-top-style:solid;border-top-color:#f9e98e;border-right-width:14px;border-right-style:solid;border-right-color:transparent;*border-right-color:pink}#raccoon_tip.rt_middle_right{margin-left:7px;padding-left:14px}#raccoon_tip.rt_middle_right .rt_tip{top:50%;left:0;margin-top:-7px;border-right-width:14px;border-right-style:solid;border-right-color:#f9e98e;border-top-width:7px;border-top-style:solid;border-top-color:transparent;*border-top-color:pink;border-bottom-width:7px;border-bottom-style:solid;border-bottom-color:transparent;*border-bottom-color:pink}#raccoon_tip .rt_content{padding:6px 12px 8px 12px;overflow:hidden;background:#fbf7aa;border-width:10px;border-style:solid;border-color:#f9e98e;*border-width:7px;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px}#raccoon_tip .rt_content,#raccoon_tip .rt_content a{color:#a27d35;text-shadow:none}#raccoon_tip .rt_content a{outline:0}</style>';
  
  var default_options = {event: "click", duration: "fast", position: "bottom_right", beforeShow: function() {}, afterHide: function() {}}, opts = null;
  var displaying = false, mouseover = false;
  
  var extendArray = function() {
    Array.prototype.compact = function() {
      for (var i = 0; i < this.length; i++) {
        if (typeof(this[i]) == "undefined") {
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };
  };
  
  var register = function(target, content, options) {
    var attachFunction = $.inArray(options.event || default_options.event, ["focus"]) == -1 ? "live" : "bind";
    $(target)[attachFunction]((options || {}).event || "click", function(event) {
      event.preventDefault();
      display(event.target, content, options);
    });
  };
  
  var display = function(target, content, options) {
    displaying = true;
    setup();
    deriveOptions(target, content, options);
    show();
    displaying = false;
  };
  
  var close = function() {
    hide();
  };
  
  var setup = function() {
    if (!$("#raccoon_tip").length) {
      $("body").mouseup(function(event) {
        if (!displaying && !mouseover) {
          hide();
        }
      });
      if (!$("head").length) {
        $(document.body).before("<head></head>");
      }
      $(css).prependTo("head");
      $(html).appendTo("body").find(".rt_content").mouseenter(function() { mouseover = true; }).mouseleave(function() { mouseover = false; });
    } else {
      hide();
    }
  };
  
  var deriveOptions = function(__target__, __content__, options) {
    opts = $.extend({}, default_options, options, {target: $(__target__), content: $(__content__)});
  };
  
  var show = function() {
    beforeShow();
    setContent();
    position();
    $("#raccoon_tip").data("rt_options", opts).show(opts.duration);
  };
  
  var beforeShow = function() {
    var options = opts.beforeShow.apply(opts.target, [opts.content, opts]);
    if (options) {
      $.extend(opts, options);
    }
  };
  
  var setContent = function() {
    opts.content = $(opts.content);
    if (opts.content.length) {
      var marker = null;
      if (opts.content.context) {
        marker = $("<span class=\".rt_marker\"></span>");
        opts.content.before(marker);
      }
      opts.content.appendTo("#raccoon_tip .rt_content");
      $("#raccoon_tip").data("rt_marker", marker);
    } else {
      $("#raccoon_tip .rt_content").html(opts.content.selector);
    }
  };
  
  var position = function() {
    setDimension(0);
    setDimension(1);
  };
  
  var setDimension = function(axis_index, positions) {
    var raccoon_tip = $("#raccoon_tip"),
        positions   = (axis_index == 0 ? ["top" , "middle", "bottom"] : ["left", "middle", "right" ]),
        pos_option  = opts.position.split("_"),
        pos_index   = positions.indexOf(pos_option[axis_index]);
    
    delete positions[pos_index];
    if (pos_index == 2) {
      positions.reverse();
    }
    positions.compact().unshift(pos_option[axis_index]);
    pos_index = 0;
    
    var css_class = function() {
      return "rt_" + (axis_index == 0 ? positions[pos_index] : pos_option[0]) + 
               "_" + (axis_index == 1 ? positions[pos_index] : pos_option[1]);
    };
    
    for (var i = 0; (i < positions.length - 1 && pos_index < positions.length); i++) {
      raccoon_tip.attr("class", css_class());
      
      switch(positions[pos_index]) {
        case "top":
          raccoon_tip.css({top:  opts.target.offset().top  - raccoon_tip.outerHeight() - 7}); break;
        case "bottom":
          raccoon_tip.css({top:  opts.target.offset().top  + opts.target.outerHeight() + 7}); break;
        case "left":
          raccoon_tip.css({left: opts.target.offset().left - raccoon_tip.outerWidth()     }); break;
        case "right":
          raccoon_tip.css({left: opts.target.offset().left + opts.target.outerWidth()     }); break;
        case "middle":
          if (axis_index == 0) {
            raccoon_tip.css({top:  opts.target.offset().top  + (opts.target.outerHeight() / 2) - (raccoon_tip.outerHeight() / 2)});
          } else {
            raccoon_tip.css({left: opts.target.offset().left + (opts.target.outerWidth()  / 2) - (raccoon_tip.outerWidth()  / 2)});
          }
          break;
      }
      
      if (axis_index == 0) {
        if ((parseInt(raccoon_tip.css("top"), 10) < $(window).scrollTop()) ||
            (parseInt(raccoon_tip.css("top"), 10) + raccoon_tip.outerHeight() > $(window).scrollTop() + $(window).height())) {
          pos_index++;
        }
      } else {
        if ((parseInt(raccoon_tip.css("left"), 10) < $(window).scrollLeft()) ||
            (parseInt(raccoon_tip.css("left"), 10) + raccoon_tip.outerWidth() > $(window).scrollLeft() + $(window).width())) {
          pos_index++;
        }
      }
      
      if (css_class().replace(/rt_/, "") == "middle_middle") {
        pos_index++;
      }
    }
    
    opts.position = css_class().replace(/rt_/, "");
  };
  
  var hide = function() {
    var options = $("#raccoon_tip").data("rt_options");
    $("#raccoon_tip").hide(0);
    options.afterHide.apply(options.target, [options.content, options]);
    if ($("#raccoon_tip").data("rt_marker")) {
      $("#raccoon_tip").data("rt_marker").before($("#raccoon_tip .rt_content").children()).remove();
    }
  };
  
  return {
    version: "1.0.4",
    init: function() {
      extendArray();
      if (typeof(onRaccoonTipReady) == "function") {
        onRaccoonTipReady();
      };
    },
    register: register,
    display : display,
    close   : close
  };
}());

(function requireMissingLibs() {
  var missing_libs = [];
  
  if (typeof(jQuery) == "undefined") {
    missing_libs.push("core");
  }
  
  if (missing_libs.length == 0) {
    RaccoonTip.init();
  } else {
    var id = "rt_dummy_script";
    document.write('<script id="' + id + '"></script>');

    var dummyScript = document.getElementById(id);
    var element     = dummyScript.previousSibling;
    while (element && element.tagName.toLowerCase() != "script") {
      element = element.previousSibling;
    }
    dummyScript.parentNode.removeChild(dummyScript);
    
    var src = element.getAttribute("src").replace(/(development\/)?(\w+)(\-min)?\.js.*$/, "jquery/" + missing_libs.sort().join(".") + ".js");
    document.write('<script src="' + src + '" type="text/javascript" ' + 
                           'onload="RaccoonTip.init()" onreadystatechange="RaccoonTip.init()">' +
                   '</script>');
  }
}());

}

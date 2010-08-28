if (typeof(RaccoonTip) == "undefined") {

var scriptElement = (function deriveScriptElement() {
  var id = "tu_dummy_script";
  document.write('<script id="' + id + '"></script>');

  var dummyScript = document.getElementById(id);
  var element = dummyScript.previousSibling;

  dummyScript.parentNode.removeChild(dummyScript);
  return element;
}());
var scriptHost = (function deriveScriptHost() {
  var src = scriptElement.getAttribute("src");
  return src && src.match(/^\w+\:\/\//) ? src.match(/^\w+\:\/\/[^\/]*\//)[0] : "";
}());

// *
// * RaccoonTip {version} (Uncompressed)
// * A lightweight jQuery based balloon tip library
// *
// * This library requires jQuery (http://jquery.com)
// *
// * (c) {year} Paul Engel (Internetbureau Holder B.V.)
// * Except otherwise noted, RaccoonTip is licensed under
// * http://creativecommons.org/licenses/by-sa/3.0
// *
// * $Date: {date} $
// *

RaccoonTip = (function() {
  var html = '<div id="raccoon_tip" style="display: none"><div class="rt_tip"></div><div class="rt_content"></div></div>';
  var css  = '<style>{style}</style>';
  
  var default_options = {event: "click", duration: "fast", position: "bottom_right", beforeShow: function() {}, afterHide: function() {}}, opts = null;
  var displaying = false, mouseover = false;
  
  var register = function(target, content, options) {
    $(target).live((options || {}).event || "click", function(event) {
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
    var raccoon_tip = $("#raccoon_tip");
    var pos         = opts.position.split("_");
    
    raccoon_tip.attr("class", "rt_" + opts.position);
    
    switch(pos[0]) {
      case "top":
        raccoon_tip.css({top: opts.target.offset().top - raccoon_tip.outerHeight() - 7}); break;
      case "middle":
        raccoon_tip.css({top: opts.target.offset().top + (opts.target.outerHeight() / 2) - (raccoon_tip.outerHeight() / 2)}); break;
      case "bottom":
        raccoon_tip.css({top: opts.target.offset().top + opts.target.outerHeight() + 7}); break;
    }
    
    switch(pos[1]) {
      case "left":
        raccoon_tip.css({left: opts.target.offset().left - raccoon_tip.outerWidth()}); break;
      case "middle":
        raccoon_tip.css({left: opts.target.offset().left + (opts.target.outerWidth() / 2) - (raccoon_tip.outerWidth() / 2)}); break;
      case "right":
        raccoon_tip.css({left: opts.target.offset().left + opts.target.outerWidth()}); break;
    }
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
    version: "{version}",
    init: function() {},
    register: register,
    display : display,
    close   : close
  };
}());

(function () {
  var missing_libs = [];
  
  if (typeof(jQuery) == "undefined") {
    missing_libs.push("core");
  }
  
  if (missing_libs.length == 0) {
    RaccoonTip.init();
  } else {
    var src = scriptElement.getAttribute("src").replace(/(development\/)?raccoon_tip(\-min)?\.js.*$/, "jquery/" + missing_libs.sort().join(".") + ".js");
    document.write('<script src="' + src + '" type="text/javascript" ' + 
                           'onload="RaccoonTip.init()" onreadystatechange="RaccoonTip.init()">' +
                   '</script>');
  }
}());

}
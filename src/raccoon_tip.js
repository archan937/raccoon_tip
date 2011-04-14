if (typeof(RaccoonTip) == "undefined") {

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
  var html = '<div id="raccoon_tip" class="hidden"><div class="rt_tip"></div><div class="rt_content"></div></div>';
  var css  = '<style>{style}</style>';

  var default_options = {event: "click", duration: "fast", position: "bottom_right", beforeShow: function() {}, canHide: function() { return true; }, afterHide: function() {}}, opts = null;

  var register = function(target, content, options) {
    var attachFunction = $.inArray(options.event || default_options.event, ["focus"]) == -1 ? "live" : "bind";
    $(target)[attachFunction]((options || {}).event || "click", function(event) {
      event.preventDefault();
      display(event.target, content, options);
    });
  };

  var display = function(target, content, options) {
    setup();
    deriveOptions(target, content, options);
    show();
  };

  var close = function() {
    hide();
  };

  var setup = function() {
    if (!$("#raccoon_tip").length) {
      $("body").mousedown(function(event) {
        var target = $(event.target);
        if (opts.canHide.apply() && target.closest("#raccoon_tip").length == 0) {
          hide();
        }
      });
      if (!$("head").length) {
        $(document.body).before("<head></head>");
      }
      $(css).prependTo("head");
      $(html).appendTo("body");
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
    $("#raccoon_tip").data("rt_options", opts).hide().removeClass("hidden").show(opts.duration);
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
    var raccoon_tip = $("#raccoon_tip"),
        positions   = ["bottom_right", "bottom_middle", "bottom_left", "middle_left", "top_left", "top_middle", "top_right", "middle_right"],
        pos_index   = positions.indexOf(opts.position),
        variants    = [];

    for (var i = 0; i < pos_index; i++) {
      positions.push(positions.shift());
    }

    for (var direction = 0; direction < 2; direction++) {

      if (direction == 1) {
        positions.reverse();
        positions.unshift(positions.pop());
      }

      for (var i = 0; i < positions.length; i++) {
        if (direction == 1 && variants[0].index <= i) {
          variants[direction] = {index: 9};
          break;
        }

        raccoon_tip.attr("class", "rt_" + positions[i]);

        for (var axis_index = 0; axis_index < 2; axis_index++) {
          switch(positions[i].split("_")[axis_index]) {
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
        }

        variants[direction] = {index: i, position: positions[i], top: raccoon_tip.css("top"), left: raccoon_tip.css("left")};

        if (!((parseInt(raccoon_tip.css("top" ), 10) < $(window).scrollTop() ) ||
              (parseInt(raccoon_tip.css("left"), 10) < $(window).scrollLeft()) ||
              (parseInt(raccoon_tip.css("top" ), 10) + raccoon_tip.outerHeight() > $(window).scrollTop()  + $(window).height()) ||
              (parseInt(raccoon_tip.css("left"), 10) + raccoon_tip.outerWidth()  > $(window).scrollLeft() + $(window).width()))) {
          break;
        }
      }
    }

    var pos = variants[variants[0].index < variants[1].index ? 0 : 1];

    raccoon_tip.attr("class", "rt_" + pos.position);
    raccoon_tip.css({top: pos.top, left: pos.left});
    opts.position = pos.position;
  };

  var hide = function() {
    var options = $("#raccoon_tip").data("rt_options");
    $("#raccoon_tip").addClass("hidden");
    if (typeof(options.afterHide) == "function") {
      options.afterHide.apply(options.target, [options.content, options]);
    }
    if ($("#raccoon_tip").data("rt_marker")) {
      $("#raccoon_tip").data("rt_marker").before($("#raccoon_tip .rt_content").children()).remove();
    }
  };

  return {
    version: "{version}",
    init: function() {
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
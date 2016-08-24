var TimelineMax, gsap;

gsap = require('gsap');

TimelineMax = gsap.TimelineMax;

module.exports = {
  fadeIn: function(target, onComplete) {
    var tl;
    tl = new TimelineMax({
      onComplete: onComplete
    });
    tl.to(target, 0, {
      opacity: 0
    }).to(target, 1, {
      opacity: 1
    });
    return tl;
  },
  fadeOut: function(target, onComplete) {
    var tl;
    tl = new TimelineMax({
      onComplete: onComplete
    });
    tl.to(target, 0, {
      opacity: 1
    }).to(target, 1, {
      opacity: 0
    });
    return tl;
  }
};

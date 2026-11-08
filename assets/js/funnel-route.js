/* Routing rules for the investor quiz "next step". Pure function, so it can be tested in Node.
   support: alone | course | guided      stage: curious | direction | bank | deal
   eq: lt100 | 100-200 | 200-300 | 300-500 | gt500 | skip      field: investor | upgrader | planning | pro | other  */
(function (w) {
  'use strict';
  var PATHS = {
    learn: '/investor-type/learn/',
    course: '/course/',
    meeting: '/investor-type/meeting/',
    pro: '/investor-type/pro/'
  };

  function route(a) {
    a = a || {};
    if (a.field === 'pro') return { id: 'pro', path: PATHS.pro, guidedFirst: false };
    if (a.support === 'alone') return { id: 'learn', path: PATHS.learn, guidedFirst: false };
    if (a.support === 'course') return { id: 'course', path: PATHS.course, guidedFirst: false };
    if (a.support === 'guided') {
      var ready = a.stage && a.stage !== 'curious' && a.eq !== 'lt100' && a.eq !== '100-200'; // full guidance starts at 200K equity
      if (ready) return { id: 'meeting', path: PATHS.meeting, guidedFirst: false };
      return { id: 'course', path: PATHS.course, guidedFirst: true };
    }
    return { id: 'learn', path: PATHS.learn, guidedFirst: false };
  }

  w.TicoRoute = { route: route, PATHS: PATHS };
  if (typeof module !== 'undefined' && module.exports) module.exports = w.TicoRoute;
})(typeof window !== 'undefined' ? window : globalThis);

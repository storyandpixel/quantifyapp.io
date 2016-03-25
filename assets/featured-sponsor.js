(function () {
  'use strict';

  var sponsorTemplate = '<p class="blurb">' +
    '  <%= tagline %>' +
    '</p>' +
    '<div class="right">' +
    '  <div class="logo" style="background-color: <%= bg %>">' +
    '    <a href="<%= link %>" class="img vertically-centered"><img src="/images/sponsor-logos/<%= logo %>"></a>' +
    '  </div>' +
    '  <small>Featured sponsor</small>' +
    '</div>';

  var getDataFile = function () {
    return $.get('/_data/sponsors.json?dc1aff2');
  };

  var flattenData = function (data) {
    return _.flatten(_.values(data));
  };

  var filterIneligible = function (sponsors) {
    return _.filter(sponsors,
                    hasKeys('link', 'logo', 'bg', 'tagline'));
  };

  var getFeaturedSponsor = function (sponsors) {
    if (params().featured_sponsor) {
      return _.findWhere(sponsors, { name: params().featured_sponsor });
    }
    return _.sample(sponsors);
  };

  var hasKeys = function () {
    var keys = arguments;
    return function (object) {
      return _.every(keys, _.partial(_.has, object));
    };
  };

  var insertFeaturedSponsor = function (sponsorData) {
    $('.featured-sponsor').html(_.template(sponsorTemplate, sponsorData));
  };

  var params = _.once(function () {
    if (window.location.search === '') {
      return {};
    }

    var pairs = window.location.search.substring(1).split('&');

    return pairs.reduce(function (result, rawPair) {
      var pair = rawPair.split('=');
      result[decodeURIComponent(pair[0])] =
        decodeURIComponent(pair[1] || '');
      return result;
    }, {});
  });

  getDataFile().done(function (_data) {
    var sponsors = filterIneligible(flattenData(_data));
    insertFeaturedSponsor(getFeaturedSponsor(sponsors));
  });
}());

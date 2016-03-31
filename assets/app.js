(function () {
  'use strict';

  var onMutation = function (selector, skipCallbackForAttr, callback) {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    $(selector).each(function (i, element) {
      new MutationObserver(function(mutations, observer) {
        if (!_.any(mutations, function (m) { return m.attributeName === skipCallbackForAttr })) {
          callback($(element));
        }
      }).observe(element, {
        subtree: true,
        attributes: true
      });;
    });
  };

  var centerEmbeddedTweets = function () {
    onMutation('.twitter-tweet-wrapper', 'style', function (element) {
      element
        .find('iframe')
        .css('margin', '10px auto');
    });
  };

  var overRideTweetTimelineWidth = function () {
    onMutation('#latest-tweets', 'width', function (element) {
      element
        .find('iframe')
        .attr('width', '100%')
        .css('width', '100%');
    });
  };

  var addRandomIdToElement = function (element) {
    var id = 'element-' + ~~(Math.random() * 99999999);
    $(element).attr('id', id);
    return id;
  };

  var animateSponsorBadge = function () {
    $('#sponsor-badge')
      .delay(600)
      .animate({ opacity: 1 }, 1000);
  };

  var cleanupSponsorList = function (index, _sponsorList) {
    var sponsorList = $(_sponsorList);
    var html = sponsorList.html();
    var correctedString = html
      // replace ', and more.' with '.'
      .replace(/,[^,]*$/, '.')
      // add 'and' before the last sponsor
      .replace(/,([^,]*)$/, function () {
        return ', and ' + arguments[1];
      });
    sponsorList.html(correctedString);
  };

  var cleanupSponsorLists = function () {
    $('.sponsor-list').each(cleanupSponsorList);
  };


  var initializeAnimatedSvgElements = function () {
    var addOffsetAttrToInitializeDrawAfterBottomOfElementIsVisible = function (element) {
      element.attr('data-offset', -1 * element.height() - 15);
    };

    $('svg.animated').each(function (_, el) {
      var element = $(el);
      // Code in _includes/scripts.html sets svg.animated elements to
      // invisible.  The code exists in _includes/scripts.html to
      // prevent a flash of the svg before the code in this block can be executed.
      $(window).load(function () {
        element.css('visibility', 'visible');
      });
      new Vivus(el, {
        delay: 100,
        duration: 180,
        type: 'delayed'
      });
    });
  };

  var initializeVideoPlaceholders = function () {
    $('.video-placeholder').click(replacePlaceholderWithVideo);
  };

  var replacePlaceholderWithVideo = function () {
    var placeholder = $(this);
    placeholder.replaceWith(placeholder.attr('data-embed'));
  };

  var verticallyCenterElements = function () {
    $('.vertically-centered').flexVerticalCenter({
      enable: function () {
        return $(window).width() > 767;
      }
    });
  };

  var initializeMagnificPopup = function () {
    $('.video-play-button-container').each(function(_, _playButtonContainer) {
      var playButtonContainer = $(_playButtonContainer);
      playButtonContainer.magnificPopup({
        items: {
          src: playButtonContainer.attr('data-video-src')
        },
        type: 'iframe'
      });
    });
    $('.product-photo-link').magnificPopup({ type: 'image' });
  };

  var initializeOwlCarousels = function () {
    $('.screenshots.owl-carousel').owlCarousel();
    $('.quotes.owl-carousel').owlCarousel({
      singleItem: true
    });
  }

  function elementHeightInPixels(parentSelector) {
    var height = $(parentSelector).outerHeight() + 5;
    return height;
    // var unitHeight = parseInt(height) + 'px';
    // return unitHeight;
  }
  function scaleVideoContainer(height) {
    $('.homepage-hero-module').css('height',height);

  }

  function initBannerVideoSize(element, height){

    $(element).each(function(){
      // This code is buggy because it sometimes runs before the elements have
      // fully loaded, causing the width() and height() calls to return nonsense
      // $(this).data('height', $(this).height());
      // $(this).data('width', $(this).width());
      // $(this).data('height', 920);
      // $(this).data('width', 1400);
      $(this).data('height', 1080);
      $(this).data('width', 1920);
    });

    scaleBannerVideoSize(element, height);

  }

  function scaleBannerVideoSize(element, height){

    var windowWidth = $(window).width(),
                      videoWidth,
                      videoHeight;

    $(element).each(function(){
      var videoAspectRatio = $(this).data('height')/$(this).data('width');

      $(this).width(windowWidth);

      videoHeight = height;
      videoWidth = videoHeight / videoAspectRatio;
      if (videoWidth < windowWidth) {
        videoWidth = windowWidth;
        videoHeight = videoAspectRatio * videoWidth;
      }

      $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});
      $(this).width(videoWidth).height(videoHeight);

      $('.homepage-hero-module .video-container video').addClass('fadeIn animated');

    });
  }

  function linkifyElement(element) {
    var el = $(element);
    if (el.attr('id')) {
      el.append('<a href="#'+el.attr('id')+'" class="pull-right" style="color: #ccc"><i class="fa fa-link"></i></a>');
    }
  }

  function linkifyElements(selector) {
    $(selector).each(function (_, node) { linkifyElement(node) });
  }

  function cycleImages(container){
    var $container = $(container);
    var $active = $container.find('.active');
    var $next = ($active.next().length > 0) ? $active.next() : $container.find('img:first');
    $next.css('z-index',2);//move the next image up the pile
    $active.fadeOut(1000,function(){//fade out the top image
      $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
      $next.css('z-index',3).addClass('active');//make the next image the top one
    });
  }

  function initImageCyclers(duration) {
    $('.image-cycler').each(function (_, container) {
      updateImageCyclerHeights();
      setInterval(cycleImages.bind(null, container), duration);
    });
  }

  function growParentToEncompassChild(child) {
    var $child = $(child);
    var $parent = $child.parent();
    if ($child.height() > $parent.height()) $parent.height($child.height())
  }

  function updateImageCyclerHeights () {
    var $imageCycler = $('.image-cycler');
    $imageCycler.each (function (_, cycler) {
      var $cycler = $(cycler);
      var tallestImgHeight = $cycler
        .find('img')
        .map (function (_, img) {
          return $(img).height();
        })
        .toArray()
        .sort()
        .reverse()[0];
      $cycler.height(tallestImgHeight);
    });
  }

  function initBackgroundVideo () {
    var initialParentHeight = elementHeightInPixels('.jumbotron.home')
    scaleVideoContainer(initialParentHeight);

    initBannerVideoSize('.video-container .poster img', initialParentHeight);
    initBannerVideoSize('.video-container .filter', initialParentHeight);
    initBannerVideoSize('.video-container video', initialParentHeight);

    if (jQuery.browser.mobile) {
      $('.video-container .poster').removeClass('hidden');
      $('.video-play-button-wrapper').css('visibility', 'visible');
    }

    $(window).on('resize', function() {
      var parentHeight = elementHeightInPixels('.jumbotron.home');
      scaleVideoContainer(parentHeight);
      scaleBannerVideoSize('.video-container .poster img', parentHeight);
      scaleBannerVideoSize('.video-container .filter', parentHeight);
      if (!jQuery.browser.mobile) {
        scaleBannerVideoSize('.video-container video', parentHeight);
      }
    });
  }

  function embedBackgroundVideo () {
    var videoVariant = $(window).width() < 1367 ? '' : '-wide';

    var videoTag = '<video autoplay loop class="fillWidth" poster="/videos/onboarding/q-onboard'+videoVariant+'.jpg">' +
      '<source src="/videos/onboarding/q-onboard'+videoVariant+'.mp4" type="video/mp4" id="looping-background-video"/>Your browser does not support the video tag. I suggest you upgrade your browser.' +
    '</video>';
    $('#video-placeholder').replaceWith(videoTag);
  }

  $(function () {
    initImageCyclers(3000);
    $('.image-cycler img').load(updateImageCyclerHeights);
    $(window).resize(updateImageCyclerHeights);
    linkifyElements('.panel-title');
    // initializeVideoPlaceholders();
    // initializeAnimatedSvgElements();
    initializeMagnificPopup();
    initializeOwlCarousels();
    embedBackgroundVideo();
    initBackgroundVideo();
    // verticallyCenterElements();
    // animateSponsorBadge();
    // cleanupSponsorLists();
    // overRideTweetTimelineWidth();
    // centerEmbeddedTweets();
  });
}());

(function () {
  'use strict';

  var initProductionVariationLinks = function () {
    $('.product-variation a').click(function (event) {
      var link = $(event.target);
      var formTag = link.closest('form');
      var inputTag = formTag.find('input.product-id');
      inputTag.val(link.attr('data-product-id'));
      formTag.submit();
    });
  };

  var highlightProductOption = function (siblingElements, element) {
    if (!siblingElements) return;
    siblingElements.removeClass('chosen');
    $(event.target).addClass('chosen');
  }

  var selectedOption = function (selectors) {
    return $(_.find(selectors, function (selector) { return $(selector).hasClass('chosen') }))
      .attr('data-label');
  };

  var selectedSelectBoxOption = function (selectBox) {
    return selectBox.val();
  };

  var optionName = function (filmType, shirtSize, shirtDesign) {
    return filmType + ' & ' + shirtSize + ' ' + shirtDesign + ' shirt';
  };

  var lookupOptionId = function (productData, productId, optionName) {
    var product = _.findWhere(productData, { id: productId });
    return _.findWhere(product.options, { name: optionName }).id;
  };

  var initProductOptionsModal = function (productData, _, _modal) {
    var modal = $(_modal);

    var productId = parseInt(modal.attr('data-product-id'), 10);
    var form = modal.closest('form');

    var productIdInput = form.find('input.product-id');

    var optionChanged = function (optionElements, event) {
      highlightProductOption(optionElements, $(event.target));
      var optionId = lookupOptionId(productData, productId, optionName(selectedOption(filmTypeSelectors),
                                                                       selectedSelectBoxOption(shirtSizeSelector),
                                                                       selectedOption(shirtDesignSelectors)));
      productIdInput.val(optionId);
    };

    var filmTypeSelectors = modal.find('.film-type img');
    filmTypeSelectors.click(optionChanged.bind(null, filmTypeSelectors));

    var shirtDesignSelectors = modal.find('.shirt-design img');
    shirtDesignSelectors.click(optionChanged.bind(null, shirtDesignSelectors));

    var shirtSizeSelector = modal.find('.shirt-size select');
                                                      // pass 'null' for optionElements arg as
                                                      // the select box doesn't have sibling elements
    shirtSizeSelector.change(optionChanged.bind(null, null));

    // TODO: Rehydrate the UI based on the retained form values when a user
    // navigates 'back' to the home page. In the meantime, punt by resetting
    // the form and manually calling optionChanged().
    form.get(0).reset();
    optionChanged(null, { target: null });
  };

  var initProductOptionsModals = function (productData) {
    $('.product-options-modal').each(initProductOptionsModal.bind(null, productData));
  };

  $(function () {
    initProductionVariationLinks();
    $.get('/_data/bc_products.json')
      .done(initProductOptionsModals);
  });
}());

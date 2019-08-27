$(document).ready(function () {

  $('.menu-btn').click(function () {
    event.preventDefault();
    $('.menu').slideToggle(200);
    $(this).toggleClass('menu-btn--close');
  })


});

$(document).ready(function () {

  $('#main-slider').slick({
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1
  })

  // Popup
  var popup = $('.modal'),
    popupStep1 = $('.modal-step-1'),
    popupStep2 = $('.modal-step-2'),
    overlay = $('.overlay');

  var closeModal = function () {
    overlay.fadeOut(200);
    popup.fadeOut(200);
    // setTimeout(function () {
    // }, 100);
  };

  var openModal = function () {
    popupStep1.fadeIn(200);
    overlay.fadeIn(200);
    // setTimeout(function () {
    // }, 100);
  };

  var openModalMail = function () {

    popupStep1.css("display", "none");
    popupStep2.fadeIn(200);
  };

  // Popup open
  $('.open-modal').click(function (event) {
    event.preventDefault();
    openModal();
  });

  // Popup mail open
  $('.open-modal-2').click(function (event) {
    event.preventDefault();
    openModalMail();
  });

  // Popup close
  $('.close-btn, .overlay').click(function () {
    event.preventDefault();
    closeModal();
  });
  $(document).keydown(function (e) {
    if (e.keyCode == 27) {
      closeModal();
    }
  });



});

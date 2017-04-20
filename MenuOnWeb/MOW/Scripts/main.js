$(function () {

  /*for single page*/
  if($('.js-floating-block').length){
    let mainContainer = $(document)
    let headerHeight = $('.header').height()+30
    let floatingContainer = $('.js-floating-block')
    let currTop = parseInt($('.js-floating-block').css('top'))
    let floatingContainerTop = floatingContainer.offset().top

    $(window).scroll(function () {
      let currScroll = mainContainer.scrollTop()
      console.log();
      console.log(headerHeight, currTop);
      if (currScroll >= floatingContainerTop - headerHeight) {
        $('.js-floating-block').css('top', currScroll )
      }
      else {
        $('.js-floating-block').css('top', currTop )
      }
    })
  }

  /*for modals*/
  $('.js-open-modal').click(function () {
    let modalId = $(this).data('modal')
    $(modalId).addClass('visible')
    $('body').addClass('modal-open')
  })

  $('.js-close-modal').click(function () {
    $('.modal').removeClass('visible')
    $('body').removeClass('modal-open')
  })
})

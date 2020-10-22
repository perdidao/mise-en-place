$('.nav-toggle').on('click', (e) => {
  e.preventDefault()
  const $this = $(e.currentTarget)

  $this.toggleClass('opened')
  $('.nav').toggleClass('opened')
})

$('[data-scrollto]').on('click', (e) => {
  const to = $(e.currentTarget).data('scrollto')

  $('.nav-toggle').removeClass('opened')
  $('.nav').removeClass('opened')

  $('html,body').animate(
    {
      scrollTop: $(to).offset().top - 80,
    },
    2000
  )
})

const hashMap = {
  '#inicio': '#index',
}

const sectionMap = {
  index: '#inicio',
}

$(document).ready(() => {
  const currentLocation = window.location.hash

  if (currentLocation !== '') {
    $('html,body').animate(
      {
        scrollTop: $(hashMap[currentLocation]).offset().top - 80,
      },
      2000
    )
  }
})

$(document).bind('scroll', function (e) {
  $('[data-scroll]').each(function () {
    if ($(this).offset().top < window.pageYOffset + 81 && $(this).offset().top + $(this).height() > window.pageYOffset + 81) {
      const currentSection = $(this).attr('id')
      window.location.hash = sectionMap[currentSection]
      $('.nav-links__link').removeClass('active')
      $(`a[data-scrollto$="${currentSection}"]`).addClass('active')
    }
  })
})

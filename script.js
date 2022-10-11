const colNumber = 16,
  rowNumber = 8,
  gutter = 20,
  marginX = 30,
  marginY = 20
let colWidth, rowHeight,
  lastScrollTop = 0,
  isFixedSousTitreOpen,
  stopParallax = false,
  isSommaireOpen = false,
  transitionState,
  displayGrid = false

function drawGrid() {
  $('#grid').empty()
  $('#grid').css('margin', marginX + 'px ' + marginY + 'px').attr({
    'width': $('html').innerWidth() - marginY * 2,
    'height': $(window).innerHeight() - marginX * 2
  })

  colWidth = $('#grid').width() / colNumber
  rowHeight = $('#grid').height() / rowNumber
  for (let i = 1; i <= colNumber - 1; i++) {
    let x1 = colWidth * i - gutter / 2
    let x2 = colWidth * i + gutter / 2
    let line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    $(line1).attr({
      'x1': x1,
      'y1': '0',
      'x2': x1,
      'y2': $('#grid').height(),
      'stroke': 'black'
    })
    let line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    $(line2).attr({
      'x1': x2,
      'y1': '0',
      'x2': x2,
      'y2': $('#grid').height(),
      'stroke': 'black'
    })
    $('#grid').append(line1, line2)
  }
  for (let i = 1; i <= rowNumber - 1; i++) {
    let y1 = rowHeight * i - gutter / 2
    let y2 = rowHeight * i + gutter / 2
    let line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    $(line1).attr({
      'x1': '0',
      'y1': y1,
      'x2': $('#grid').width(),
      'y2': y1,
      'stroke': 'black'
    })
    let line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    $(line2).attr({
      'x1': '0',
      'y1': y2,
      'x2': $('#grid').width(),
      'y2': y2,
      'stroke': 'black'
    })
    $('#grid').append(line1, line2)
  }
}

function coverInterraction() {
  console.log(isWindowSmall());
  if (isWindowSmall()) {
    $('#click_to_enter_1, #click_to_enter_3, #mask svg rect:nth-of-type(3), #mask svg rect:nth-of-type(4)').css('display', 'none')
    $('#mask svg')
  }
  $(document).on('mousemove', function (event) {
    if (!stopParallax) {
      let cursorPos = event.pageX / $(window).width() - 0.5,
        maskOffset = cursorPos * 10 + 'vw',
        titleOffset = cursorPos * -5 + 'vw'
      $('#mask').css('transform', 'translate(' + maskOffset + ', 0)')
      $('#main-title').css('transform', 'translate(' + titleOffset + ', 0)')
    }
  })
  $('#click_to_enter_1, #click_to_enter_2, #click_to_enter_3').on('click', enterContent)
}

function enterContent() {
  stopParallax = true
  let screen_clicked = $(this).attr('id').slice(-1),
    maskCurrentTransformState = $('#mask').css('transform'),
    translateOffset = ''
  if (screen_clicked == '1') {
    translateOffset = 'translate(30vw)'
  } else if (screen_clicked == '3') {
    translateOffset = 'translate(-30vw)'
  }
  $('#mask').css({
    'transition': 'transform 2s ease-out',
    'transform': maskCurrentTransformState + 'scale(1000%) ' + translateOffset
  })
  setTimeout(() => {
    $('#mask').remove()
  }, 1400)
  $('body').css('overflow-y', 'scroll')
  $('#content-hidden').css('display', 'block')
  drawGrid()
  if (displayGrid) {
    $('#grid').fadeIn()
  }
  alignContentOnGrid()
  setTimeout(() => {
    drawMainLines()
  }, 700)
  setTimeout(() => {
    writeParagraphNumber()
    alignCaption()
    alignAnnotation()
    displayImgOnScroll()
    displayParagraphOnScroll()
    displaySousTitreOnScroll()
    displaySousTitreLeftFixed()
    stickyParagraphNumberOnScroll()
  }, 1400)
}

function alignContentOnGrid() {
  $('#main-content').css({
    'width': colWidth * 8 - gutter,
    'left': colWidth * 4 + marginX
  })
  $('#main-title').css({
    'max-height': rowHeight * 1.8,
    'margin-top': marginX,
    'transform': 'translate(0px)'
  })
  setTimeout(() => {
    $('#main-title').css('height', 'auto')
  }, 1400)
  $('#main-title p').css('width', '100%')
  $('#main-title p:nth-of-type(2)').css('margin-left', '3vw')
  $('#fixed-side-left').css({
    'width': colWidth * 4 - gutter / 2,
    'left': marginY,
    'top': 0,
    'opacity': 0,
    'transition': 'opacity 0.8s ease-out'
  })
  setTimeout(() => {
    $('#fixed-side-left').css('opacity', 1)
  }, 800)
  $('#sommaire-close').css({'top': marginX, 'left': colWidth * 4 - marginY})
  $('#sommaire-button').css('padding-top', marginX)
  $('#fixed-side-right').css({
    'width': colWidth * 4 - gutter / 2,
    'right': marginY,
    'top': marginX,
    'opacity': 0,
    'transition': 'opacity 0.8s ease-out'
  })
  $('#fixed-side-right #horizontal-intro-text').css({
    'right': gutter * 2 + 5
  })
  setTimeout(() => {
    $('#fixed-side-right').css('opacity', 1)
    $('#fixed-side-right #horizontal-intro-text').css({
      'width': $('#right-border-bloc').width(),
      'text-align': 'right',
      'background-color': 'white',
      'margin-top': - marginX,
      'padding-top': marginX,
      'padding-bottom': gutter - 3,
      'z-index': 1
    })
  }, 800);
  $('#fixed-side-right #vertical-intro-text').css({
    'top': gutter * 2 + 5,
    'left': colWidth * 4 - gutter / 2
  })
  $('#right-border-bloc').css({
    // 'width': '0',
    // 'height': '0',
    'opacity': '0',
    'top': $('#fixed-side-right #horizontal-intro-text').height() + gutter - 3,
    'left': '0'
  })
  $('#left-border-bloc').css({
    'top': $('#fixed-side-left p:first-of-type').height() + marginX,
    // 'width': '0%',
    'height': gutter - 3
  })
  $('#sous-titre-fixe').css({
    'transform': 'translateY(-' + parseInt($('#left-border-bloc').height() + $('#sommaire-button').height() + marginX) + 'px)',
    'padding-top': (gutter - 3) * 2,
    'padding-bottom': gutter - 3
  })
  $('#scrollable-side-left').css({
    'position': 'absolute',
    'left': marginY,
    'width': colWidth * 4 - gutter / 2,
    'top': '0',
    'opacity': 0,
    'transition': 'opacity 0.8s ease-out'
  })
  $('#scrollable-side-right').css({
    'display': 'block',
    'background-color': 'red',
    'position': 'absolute',
    'left': $('#right-border-bloc').offset().left,
    'opacity': 0,
    'transition': 'opacity 0.8s ease-out, width 0.4s ease-out'
  })
  setTimeout(() => {
    $('#scrollable-side-left').css('opacity', 1)
    $('#scrollable-side-right').css({
      'width': $('#right-border-bloc').width(),
      'opacity': 1
    })
  }, 800)
  $('.double-img').each(function () {
    $(this).children().css('width', colWidth * 6 - gutter).last().css({
      'left': colWidth * 6,
      'width': colWidth * 6 - gutter / 2
    })
    if ($(this).children().first().height() > $(this).children().last().height()) {
      $(this).children().first().css('height', $(this).children().last().height())
    } else {
      $(this).children().last().css('height', $(this).children().first().height())
    }
  })
}

function writeParagraphNumber() {
  $('#content-hidden p').each(function (i) {
    i++
    let paragraphNumber = '<div id="paragraph-number-' + i + '" class="paragraph-number"><p>' + i + '</p></div>'
    $(paragraphNumber).appendTo('#scrollable-side-left').css({
      'top': $(this).offset().top + 5 - 30,
    })
  })
}

function alignCaption() {
  $('#scrollable-side-left .caption').each(function (i) {
    let img = '#' + this.dataset.img
    if ($(img).parent().hasClass('double-img')) {
      if ($(img).is(':first-child')) {
        $(this).css({
          'top': $(img).offset().top + $(img).height() - $(this).height() * 2 - parseInt($(img).css('margin-bottom').slice(0, -2)) - 80
        })
        let gauche = '<div class="img-position" id="indication-' + $(img).attr('id') + '"><p>À gauche</p></div>'
        $(gauche).appendTo($(this).parent()).css({
          'top': $(this).offset().top - $(window).height() / 40
        })
        setTimeout(() => {
          $(gauche).css('opacity', 1)
        }, 200)
      } else {
        $(this).css({
          'top': $(img).offset().top + $(img).height() - $(this).height() - parseInt($(img).css('margin-bottom').slice(0, -2)) + 8
        })
        let droite = '<div class="img-position" id="indication-' + $(img).attr('id') + '"><p>À droite</p></div>'
        $(droite).appendTo($(this).parent()).css({
          'top': $(this).offset().top - $(window).height() / 40
        })
        setTimeout(() => {
          $(droite).css('opacity', 1)
        }, 200)
      }
    } else {
      $(this).css({
        'top': $(img).offset().top + $(img).height() - $(this).height() - parseInt($(img).css('margin-bottom').slice(0, -2)) + 8
      })
    }
    $(this).children().each(function () {
      $(this).css({
        'width': '0%',
        'transition': 'width 0.5s ease-out',
        'overflow': 'hidden'
      })
    })
  })
}

function displayParagraphOnScroll() {
  $(document).on('scroll', function () {
    $('#content-hidden p').each(function (i) {
      let paragraph = this,
        paragraphNumber = i + 1
      if ($(document).scrollTop() >= $(paragraph).offset().top - $(window).innerHeight() * 0.9) {
        $(paragraph).css({
          'opacity': '1',
          'transform': 'translateY(0)'
        })
        setTimeout(() => {
          $('#paragraph-number-' + paragraphNumber).children().css('transform', 'translateY(0px)')
        }, 100)
      }
    })
  })
}

function displaySousTitreOnScroll() {
    let offsetTop = 0,
    spaceOffsetRight = 0,
    prevSpace,
    prevSpaceIndex

  $('#content-hidden h2').each(function () {
    offsetTop = 0
    spaceOffsetRight = 0
    prevSpace = 0
    prevSpaceIndex = 0
    let sousTitre = this,
      letters = $(this).text().split('')
    $(sousTitre).css('overflow', 'hidden').html('')
    $.each(letters, function (index, item) {
      if (this == ' ') {
        wrappedLetter = '<span>&nbsp;</span>'
      } else {
        wrappedLetter = '<span>' + this + '</span>'
      }
      $(wrappedLetter).css({
        'display': 'inline-block',
        'transform': 'translateY(40px)',
        'transition': 'transform 0.4s ease-out'
      }).appendTo($(sousTitre))
    })
    // avoid word break
    $(this).children().each(function (index) {
      if (offsetTop == 0) {
        offsetTop = $(this).offset().top
      } else if (offsetTop != 0 && offsetTop != $(this).offset().top) {
        $(prevSpace).css(
          'margin-left', $(this).width() * (index - (prevSpaceIndex + 1)) + 'px'
        )
        offsetTop = $(this).offset().top
      }
      if ($(this).text() == ' ') {
        spaceOffsetRight = $(this).offset().left + $(this).width()
        prevSpace = $(this)
        prevSpaceIndex = index
      }
      index++
    })
  })
  $(document).on('scroll', function () {
    $('#content-hidden h2').each(function () {
      let sousTitre = this
      if ($(document).scrollTop() >= $(sousTitre).offset().top - $(window).innerHeight() * 0.9) {
        let delay = 0
        $(sousTitre).children().each(function () {
          setTimeout(() => {
            $(this).css('transform', 'translateY(0px)')
          }, delay)
          delay += 10
        })
      }
    })
  })
  $(window).on('resize', function () {
    setTimeout(() => {
      $('#content-hidden h2').each(function() {
        offsetTop = 0
        spaceOffsetRight = 0
        prevSpace = 0
        index = 0
        prevSpaceIndex = 0
        let sousTitre = this
        $(sousTitre).children().each(function (index) {
          $(this).css('margin-left', 0)
          if (offsetTop == 0) {
            offsetTop = $(this).offset().top
          } else if (offsetTop != 0 && offsetTop != $(this).offset().top) {
            $(prevSpace).css(
              'margin-left', $(this).width() * (index - (prevSpaceIndex + 1)) + 'px'
              )
            offsetTop = $(this).offset().top
          }
          if ($(this).text() == ' ') {
            spaceOffsetRight = $(this).offset().left + $(this).width()
            prevSpace = $(this)
            prevSpaceIndex = index
          }
          index++
        })
      })
    }, 400)

  })
}

function drawMainLines() {
  $('#left-border-bloc').css('width', '100%')
  $('#separator').css('width', '100%')
  $('#right-border-bloc').css({
    'width': colWidth * 4 - gutter / 2 - ($('#fixed-side-right #vertical-intro-text').height() + gutter - 3),
    'height': '100vh',
    'opacity': '1'
  })
}

function displayImgOnScroll() {
  $('img').each(function () {
    if (isImgOnScreen(this)) {
      if ($(this).parent().hasClass('double-img') && $(this).is(':last-child')) {
        setTimeout(() => {
          animateImgEnter(this)
        }, 400)
      } else {
        animateImgEnter(this)
      }
    }
  })
  $(document).on('scroll', function () {
    $('img').each(function () {
      if (isImgOnScreen(this)) {
        if ($(this).parent().hasClass('double-img') && $(this).is(':last-child')) {
          setTimeout(() => {
            animateImgEnter(this)
          }, 400)
        } else {
          animateImgEnter(this)
        }
      }
    })
  })

  function isImgOnScreen(img) {
    if ($(img).offset().top <= $(window).scrollTop() + $(window).height() &&
      $(img).css('opacity') == '0') {
      return true;
    }
  }

  function animateImgEnter(img) {
    setTimeout(() => {
      $(img).css({
        'opacity': '1',
        'transform': 'translateY(0px)'
      })
      animateDisplayCaption(img)
    }, 60)
  }
}

function animateDisplayCaption(img) {
  $('.caption').each(function () {
    if ($(img).attr('id') == this.dataset.img) {
      setTimeout(() => {
        let delay = 200
        $(this).css({
          'width': '100%',
          'opacity': '1'
        }).children().each(function () {
          setTimeout(() => {
            $(this).css('width', '100%')
          }, delay)
          delay += 150
        })
        $('#indication-' + $(img).attr('id')).css('opacity', 1).children().first().css('transform', 'translateY(40px)')
        setTimeout(() => {
          $('#indication-' + $(img).attr('id')).css('opacity', 1).children().first().css('transform', 'translateY(0px)')
        }, 600)
      }, 100)
    }
  })
}

function displaySousTitreLeftFixed() {
  $(document).on('scroll', () => {
    let scrollDirection = getScrollDirection()
    if (checkSection()) {
      $('#sous-titre-fixe').css({
        'transform': 'translateY(0px)',
        'opacity': '1'
      })
      let sousTitre = '<p>' + $(checkSection()).text() + '</p>'
      sousTitre = sousTitre.replace(/\xA0/g, ' ') // replace nbsp
      if ($('#sous-titre-fixe').text() != $(sousTitre).text() && !transitionState && !isSommaireOpen) {
        transitionState = true
        if ($('#sous-titre-fixe').html() != '') {
          $('#sous-titre-fixe').css('height', $('#sous-titre-fixe').height() + "px")
          if (scrollDirection == 'down') { //Part vers le haut
            $('#sous-titre-fixe').children().first().css({
              'transform': 'translateY(-50px)',
              'opacity': 0
            })
            $(sousTitre).appendTo($('#sous-titre-fixe')).css({
              'transform': 'translateY(50px)',
              'opacity': 1
            })
          } else if (scrollDirection == 'top') {
            $('#sous-titre-fixe').children().first().css({
              'transform': 'translateY(50px)',
              'opacity': 0
            })
            $(sousTitre).appendTo($('#sous-titre-fixe')).css({
              'transform': 'translateY(-80px)'
            }).css('opacity', 0)
          }
          setTimeout(() => {
            $('#sous-titre-fixe').children().first().remove()
            $('#sous-titre-fixe').children().first().css({
              'transform': 'translateY(0px)',
              'opacity': 1
            })
            $('#sous-titre-fixe').css('height', 'auto')
            transitionState = false
          }, 400)
        } else {
          isFixedSousTitreOpen = true
          $(sousTitre).appendTo($('#sous-titre-fixe')).css('transform', 'translateY(50px)').children().first().css('opacity', '0')
          setTimeout(() => {
            $('#sous-titre-fixe').children().first().css({
              'transform': 'translateY(0px)',
              'opacity': 1
            })
            transitionState = false
          }, 400)
        }
      }
    } else if (!checkSection() && $('#sous-titre-fixe').html() != '' && !transitionState && !isSommaireOpen) {
      isFixedSousTitreOpen = false
      transitionState = true
      $('#sous-titre-fixe').children().first().css({
        'transform': 'translateY(50px)',
        'opacity': 0
      })
      setTimeout(() => {
        $('#sous-titre-fixe').empty().css({
          'transform': 'translateY(-' + parseInt($("#left-border-bloc").height() + $("#sommaire-button").height()) + 'px)',
          'opacity': 0
        })
        transitionState = false
      }, 400)
    }
  })
}

function checkSection() {
  let lastSection
  $('h2').each(function () {
    if ($(this).offset().top <= $(window).scrollTop() + $(window).height() / 20) {
      lastSection = this
    }
  })
  return lastSection
}

function stickyParagraphNumberOnScroll() {
  let prevTop = [],
    topThresh,
    fixedSousTitreDiffSize = 0
  $('.paragraph-number').each(function () {
    prevTop.push($(this).css('top'))
  })
  $(window).on('scroll', function () {
    topThresh = $('#left-border-bloc').height() + $('#sommaire-button').height() + parseInt($('#sommaire-button').css('padding-top')) + gutter
    if (isFixedSousTitreOpen) fixedSousTitreDiffSize = $('#sous-titre-fixe').height() + parseInt($('#sous-titre-fixe').css('padding-bottom')) + gutter - 3
    else fixedSousTitreDiffSize = 0
    let newTopThresh = topThresh + fixedSousTitreDiffSize
    $('.paragraph-number').each(function (i) {
      let relatedParagraph = $('#content-hidden p:nth-of-type(' + $(this).text() + ')')
      if (newTopThresh + $(window).scrollTop() >= relatedParagraph.offset().top &&
        newTopThresh + $(window).scrollTop() <= relatedParagraph.offset().top + relatedParagraph.height() - gutter) {
        $(this).css({
          'position': 'fixed',
          'top': newTopThresh, // ICI
          'right': marginY + colWidth * 12 + gutter / 2
        })
      } else if (newTopThresh + $(window).scrollTop() >= relatedParagraph.offset().top + relatedParagraph.height() - gutter * 1.5 - parseInt(relatedParagraph.css('margin-bottom')) &&
        newTopThresh + $(window).scrollTop() <= relatedParagraph.offset().top + relatedParagraph.height()) {
        $(this).css({
          'position': 'absolute',
          'top': relatedParagraph.offset().top + relatedParagraph.height() - gutter * 1.5,
          'right': 0
        })
      } else {
        $(this).css({
          'top': relatedParagraph.offset().top,
          'position': 'absolute',
          'right': '0'
        })
      }
    })
  })
  // LE TRUC DE LA DETECTION DU SOUS TITRE FIXE DECONNE
  // POSSIBLE DE VIRER PREVPOS
  $(window).on('resize', () => {
    setTimeout(() => {
      topThresh = $('#left-border-bloc').height() + $('#sommaire-button').height() + parseInt($('#sommaire-button').css('padding-top')) + gutter
      if (isFixedSousTitreOpen) fixedSousTitreDiffSize = $('#sous-titre-fixe').height() + parseInt($('#sous-titre-fixe').css('padding-bottom')) + gutter - 3
      else fixedSousTitreDiffSize = 0
      let newTopThresh = topThresh + fixedSousTitreDiffSize
      $('.paragraph-number').each(function (i) {
        let relatedParagraph = $('#content-hidden p:nth-of-type(' + $(this).text() + ')')
        if (newTopThresh + $(window).scrollTop() >= parseInt(prevTop[i]) &&
          newTopThresh + $(window).scrollTop() <= parseInt(prevTop[i]) + relatedParagraph.height() - gutter) {
          $(this).css({
            'position': 'fixed',
            'top': newTopThresh, // ICI
            'right': marginY + colWidth * 12 + gutter / 2
          })
        } else if (newTopThresh + $(window).scrollTop() >= relatedParagraph.offset().top + relatedParagraph.height() - gutter * 1.5 - parseInt(relatedParagraph.css('margin-bottom')) &&
          newTopThresh + $(window).scrollTop() <= relatedParagraph.offset().top + relatedParagraph.height()) {
          $(this).css({
            'position': 'absolute',
            'top': relatedParagraph.offset().top + relatedParagraph.height() - gutter * 1.5,
            'right': 0
          })
        } else {
          $(this).css({
            'top': relatedParagraph.offset().top,
            'position': 'absolute',
            'right': '0'
          })
        }
      })
    }, 400)
  })
}

function getScrollDirection() {
  if ($(document).scrollTop() > lastScrollTop) {
    lastScrollTop = $(document).scrollTop()
    return 'down'
  } else {
    lastScrollTop = $(document).scrollTop()
    return 'top'
  }
}

function displaySommaire() {
  $('#sommaire-button, #sommaire-close').on('click', function() {
    if (!isSommaireOpen && !transitionState) {
      transitionState = true
      let sousTitreList = '<ul id="sommaire-list"></ul>'
      $('#sous-titre-fixe').children().first().css('opacity', 0)
      $('#sommaire-close p').css('transform', 'translateY(0px)')
      setTimeout(() => {
        $('#sous-titre-fixe').empty()
        $(sousTitreList).appendTo($('#sous-titre-fixe'))
        let intro = "<li>Immersion dans l'écran</li>"
        $(intro).appendTo($('#sommaire-list'))
          .click(function() {
            $('html, body').animate({
              scrollTop: 0
            }, 1200)
          })
          .mouseenter(function() {
            displaySommaireImg('spawn', $('#content-hidden').children('img:first-of-type'))
          }).mouseleave(function() {
            displaySommaireImg('destroy', $('#content-hidden').children('img:first-of-type'))
          })
        let delay = 100
        $('#content-hidden h2').each(function(index, item) {
          setTimeout(() => {
            let listItem = '<li>' + $(item).text() + '</li>'
            listItem = listItem.replace(/\xA0/g, ' ') // replace nbsp
            $('#sommaire-list').append($(listItem))
            $('#sommaire-list li:nth-of-type(' + (index + 1) + ')')
              .css('opacity', '1')
            $('#sommaire-list li:nth-of-type(' + (index + 2) + ')')
              .click(function() {
                $('html, body').animate({
                  scrollTop: $(item).offset().top - marginY
                }, 1200)
              })
              .mouseenter(function() {
                displaySommaireImg('spawn', $(item).nextAll(':not(p)').first())
              }).mouseleave(function() {
                displaySommaireImg('destroy', $(item).nextAll(':not(p)').first())
              })
            if (index + 1 == $('#content-hidden h2').length) {
              setTimeout(() => {
                $('#sommaire-list li:last-of-type').css('opacity', '1')
              }, 100)
            }
          }, delay)
          delay += 100
        })
      }, 200)
      if (!checkSection()) {
        $('#sous-titre-fixe').css({
          'transform': 'translateY(0px)',
          'opacity': '1'
        })
      }
      setTimeout(() => {
        getSommaireSection()
        isSommaireOpen = true
        transitionState = false
        fakeScroll()
      }, $('#content-hidden h2').length * 100 + 100)
      $(document).on('scroll', function() {
        getSommaireSection()
      })
    } else if (isSommaireOpen && !transitionState) {
      transitionState = true
      $('#sommaire-close p').css('transform', 'translateY(20px)')
      let delay = 0, sousTitreLength = $('#content-hidden h2').length - 1
      $('#sommaire-list').children().each(function(index, item) {
        setTimeout(() => {
          $(item).css('opacity', 0)
          setTimeout(() => {
            $(item).remove()
          }, 400)
        }, delay)
        delay += 100
      })
      setTimeout(() => {
        fakeScroll()
        isSommaireOpen = false
        transitionState = false
      }, 100 * sousTitreLength)
    }
  })
}

function displaySommaireImg(state, img) {
  let src, alt, id
  if ($(img).hasClass('double-img')) {
    src = $(img).children().first().attr('src')
    alt = $(img).children().first().attr('alt')
    id = $(img).children().first().attr('id')
  } else if ($(img).is('img')) {
    src = $(img).attr('src')
    alt = $(img).attr('alt')
    id = $(img).attr('id')
  } else {
    return
  }
  if (state == 'spawn') {
    let sommaireHoverImg = '<img id="sommaire-hover-' + id + '" src="' + src + '" alt="' + alt + '">'
    $(sommaireHoverImg).appendTo($('#fixed-side-left'))
    $('#sommaire-hover-' + id).css({
      'opacity': 1,
      'bottom': marginX,
      'max-width': $('#fixed-side-left').width(),
      'max-height': $(window).height() - $('#fixed-side-left').height() - marginX * 2
    })
  } else if (state == 'destroy') {
    $('#sommaire-hover-' + id).css('opacity', 0)
    setTimeout(() => {
      $('#sommaire-hover-' + id).remove()
    }, 200)
  }
}

function getSommaireSection() {
  let sousTitre = '<p>' + $(checkSection()).text() + '</p>'
  sousTitre = sousTitre.replace(/\xA0/g, ' ') // replace nbsp
  $('#sommaire-list').children().each(function (index, item) {
    if ($(item).text() == $(sousTitre).text()) {
      $(item).css('text-decoration-color', 'rgba(0, 0, 0, 1)')
    } else if ($(sousTitre).text() == '') {
      $('#sommaire-list').children().css('text-decoration-color', 'rgba(0, 0, 0, 0)')
      $('#sommaire-list').children().first().css('text-decoration-color', 'rgba(0, 0, 0, 1)')
    } else {
      $(item).css('text-decoration-color', 'rgba(0, 0, 0, 0)')
    }
  })
}

function alignAnnotation() {
  $('.annotation').each(function(index, item) {
    let paragraph = '#' + this.dataset.paragraph
    $(item).css({
      'top': $(paragraph).offset().top + $(paragraph).height() - $(item).height() - parseInt($(paragraph).css('margin-bottom').slice(0, -2)) - 30,
      'width': $('#right-border-bloc').width() - marginY
    })
  })
  $(document).on('scroll', function() {
    $('.annotation').each(function(index, item) {
      if ($(item).offset().top <= $(window).scrollTop() + $(window).height() - 50 && $(item).children().first().css('opacity') == '0') {
        let delay = 0
        $(item).children().each(function(ind, it) {
          setTimeout(() => {
            $(it).css('opacity', 1)
          }, delay)
          delay += 50
        })
      }
    })
  })
}

function fakeScroll() {
  setTimeout(() => {
    $(window).scrollTop($(window).scrollTop()+1)
    setTimeout(() => {
      $(window).scrollTop($(window).scrollTop()-1)
    },1)
  }, 100)
}

function isWindowSmall() {
  if($(window).width() < $(window).height()) {
    return true
  } else {
    return false
  }
}

function refreshAlign() {
  // CAPTION
  $('.img-position').each(function () {
    setTimeout(() => {
      $(this).remove()
    }, 400)
  })
  $('#scrollable-side-left .caption').each(function (i) {
    let img = '#' + this.dataset.img
    if ($(img).parent().hasClass('double-img')) {
      if ($(img).is(':first-child')) {
        $(this).css({
          'top': $(img).offset().top + $(img).height() - $(this).height() * 2 - parseInt($(img).css('margin-bottom').slice(0, -2)) - 80
        })
        let gauche = '<div class="img-position" id="indication-' + $(img).attr('id') + '"><p>À gauche</p></div>'
        setTimeout(() => {
          $(gauche).appendTo($(this).parent()).css('top', $(this).offset().top - $(window).height() / 40)
          setTimeout(() => {
            if ($('#indication-' + $(img).attr('id')).offset().top > $(window).scrollTop() &&
              $('#indication-' + $(img).attr('id')).offset().top + $('#indication-' + $(img).attr('id')).height() < $(window).scrollTop() + $(window).height()) {
              $('#indication-' + $(img).attr('id')).css('opacity', 1).children().first().css('transform', 'translateY(0px)')
            }
          }, 200)
        }, 1200)
      } else {
        $(this).css({
          'top': $(img).offset().top + $(img).height() - $(this).height() - parseInt($(img).css('margin-bottom').slice(0, -2)) + 28
        })
        let droite = '<div class="img-position" id="indication-' + $(img).attr('id') + '"><p>À droite</p></div>'
        setTimeout(() => {
          $(droite).appendTo($(this).parent()).css('top', $(this).offset().top - $(window).height() / 40)
          setTimeout(() => {
            if ($('#indication-' + $(img).attr('id')).offset().top > $(window).scrollTop() &&
              $('#indication-' + $(img).attr('id')).offset().top + $('#indication-' + $(img).attr('id')).height() < $(window).scrollTop() + $(window).height()) {
              $('#indication-' + $(img).attr('id')).css('opacity', 1).children().first().css('transform', 'translateY(0px)')
            }
          }, 200)
        }, 1200)
      }
    } else {
      $(this).css({
        'top': $(img).offset().top + $(img).height() - $(this).height() - parseInt($(img).css('margin-bottom').slice(0, -2)) + 28
      })
    }

  })
  // LEFT SOUS TITRE
  if ($('#sous-titre-fixe').html() == '') {
    $('#sous-titre-fixe').css('transform', 'translateY(-80px)')
  } else {
    $('#sous-titre-fixe').css('transform', 'translateY(0px)')
  }
  // ANNOTATION
  setTimeout(() => {
    $('.annotation').each(function(index, item) {
      let paragraph = '#' + this.dataset.paragraph
      $(item).css({
        'top': $(paragraph).offset().top + $(paragraph).height() - $(item).height() - parseInt($(paragraph).css('margin-bottom').slice(0, -2)) - 30,
        'width': $('#right-border-bloc').width() - marginY
      })
    })
  }, 200)
}

$(document).ready(function () {
  $(document).scrollTop(0)
  coverInterraction()
  displaySommaire()
  // RESPONSIVE
  $(window).resize(function () {
    isWindowSmall()
    drawGrid()
    if (displayGrid) $('#grid').fadeIn()
    alignContentOnGrid()
    setTimeout(() => {
      drawMainLines()
      fakeScroll()
    }, 700)
    setTimeout(() => {
      refreshAlign()
    }, 400)
  })
})
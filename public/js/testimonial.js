// coding with nick
// vars

// coding with nick

'use strict'
var testim = document.getElementById("testim"),
    testimDots = Array.prototype.slice.call(document.getElementById("testim-dots").children),
    testimContent = Array.prototype.slice.call(document.getElementById("testim-content").children),
    testimleftArrow = document.getElementById("left-arrow"),
    testimRightArrow = document.getElementById("right-arrow"),
    testimSpeed = 30500,
    currentSlide = 0,
    currentActive = 0,
    testimTimer
    ;
// coding with nick


// Testim Script



'use strict'
var banner = document.getElementById("banner"),
    bannerDots = Array.prototype.slice.call(document.getElementById("banner-dots").children),
    bannerContent = Array.prototype.slice.call(document.getElementById("banner-content").children),
    bannerleftArrow = document.getElementById("left-arrow"),
    bannerRightArrow = document.getElementById("right-arrow"),
    bannerSpeed = 4500,
    currentSlide2 = 0,
    currentActive = 0,
    bannerTimer
    ;

// coding with nick
window.onload = function () {

    function playSlide(slide) {
        for (var k = 0; k < testimDots.length; k++) {
            testimContent[k].classList.remove("active");
            testimContent[k].classList.remove("inactive");
            testimDots[k].classList.remove("active");
        }
        if (slide < 0) {
            slide = currentSlide = testimContent.length - 1;
        }
        if (slide > testimContent.length - 1) {
            slide = currentSlide = 0;
        }
        if (currentActive != currentSlide) {
            testimContent[currentActive].classList.add("inactive");
        }
        testimContent[slide].classList.add("active");
        testimDots[slide].classList.add("active");

        currentActive = currentSlide;

        clearTimeout(testimTimer);
        testimTimer = setTimeout(function () {
            playSlide(currentSlide += 1);
        }, testimSpeed)
    }
    // coding with nick
    testimleftArrow.addEventListener("click", function () {
        playSlide(currentSlide -= 1);
    })
    testimRightArrow.addEventListener("click", function () {
        playSlide(currentSlide += 1);
    })

    for (var l = 0; l < testimDots.length; l++) {
        testimDots[l].addEventListener("click", function () {
            playSlide(currentSlide = testimDots.indexOf(this));
        })
    }
    playSlide(currentSlide);


    // banner Script

    async function playSlide2(slide) {
        for (var k = 0; k < bannerDots.length; k++) {
            bannerContent[k].classList.remove("active");
            bannerContent[k].classList.remove("inactive");
            bannerDots[k].classList.remove("active");
        }





        if (slide < 0) {
            slide = currentSlide2 = bannerContent.length - 1;
        }
        if (slide > bannerContent.length - 1) {
            slide = currentSlide2 = 0;
        }
        if (currentActive != currentSlide) {
            bannerContent[currentActive].classList.add("inactive");
        }
        bannerContent[slide].classList.add("active");
        bannerDots[slide].classList.add("active");

        currentActive = currentSlide2;

        clearTimeout(bannerTimer);
        bannerTimer = setTimeout(function () {
            playSlide2(currentSlide2 += 1);
        }, bannerSpeed)
    }
    // coding with nick
    bannerleftArrow.addEventListener("click", function () {
        playSlide2(currentSlide2 -= 1);
    })
    bannerRightArrow.addEventListener("click", function () {
        playSlide2(currentSlide2 += 1);
    })

    for (var l = 0; l < bannerDots.length; l++) {
        bannerDots[l].addEventListener("click", function () {
            playSlide2(currentSlide2 = bannerDots.indexOf(this));
        })
    }
    playSlide2(currentSlide2);



    document.getElementById('banner-content').addEventListener("mouseover", function (event) {
        //   console.log(document.querySelector('#banner-content')); 
        for (var k = 0; k < bannerContent.length; k++) {
            document.getElementsByClassName("bannerImg")[k].style.filter = 'blur(5px)';
            document.getElementsByClassName("btnHovShow")[k].style.display = "inline";
        }
        clearTimeout(bannerTimer);
    })

    document.getElementById('banner-content').addEventListener("mouseout", function (event) {
        //   console.log(document.querySelector('#banner-content')); 
        for (var k = 0; k < bannerContent.length; k++) {
            document.getElementsByClassName("bannerImg")[k].style.filter = 'blur(0px)';
            document.getElementsByClassName("btnHovShow")[k].style.display = "none";
            // playSlide2(slide);
        }
        bannerTimer = setTimeout(function () {
            playSlide2(currentSlide2 += 1);
        }, bannerSpeed)
    })

    // for (var k = 0; k < bannerContent.length; k++) {



    //        


    //       });
    //       bannerContent[k].addEventListener('mouseout', function() {
    //         document.getElementsByClassName("bannerImg")[k].style.filter = 'blur(0px)';
    //         document.getElementsByClassName("btnHovShow")[k].style.display = "none"; 
    //       }); 

}



    //}

    // document.querySelectorAll('.banner-content').addEventListener("mouseover", function( event ) {
    //     console.log(document.querySelector('.banner-content'));
    // } ) 

const forward = document.querySelector('.forward');
const back = document.querySelector('.back');
const overlay = document.querySelector('.shutter-overlay');
const backOverlay = document.querySelector('.lower-shutter');
const pictures = document.querySelectorAll('.pic');
const overview = document.querySelector('.overview');
const wheel = document.querySelector('.wheel');
const viewmaster = document.querySelector('.viewmaster');
const inside = document.querySelector('.inside');

var wheelAnimating = false;

var slideIndex = 0;
var currentSlide = pictures[0];
var movingForward;
var slideAnimating = false;

window.onload = function() {

    /* VIEWMASTER ANIMATIONS */

    var vmBounds = viewmaster.getBoundingClientRect();

    var wheelBounce = new TimelineMax({repeat: -1, yoyo:true});

    wheelBounce.fromTo('.wheel', 0.8, {y:0}, {y:25});

    var flipTransition = new TimelineMax();
    
    
    wheel.onclick = () => {
        if (wheelAnimating) {
            return;
        }
        wheelAnimating = true;
        wheelBounce.kill();
        flipTransition.to('.wheel', 1, {
            y: ((vmBounds.top + vmBounds.bottom) / 2) - (wheel.getBoundingClientRect().bottom - (wheel.getBoundingClientRect().bottom / 5)),
            onComplete: function() {
                overview.classList.add('flipped-out');
                inside.classList.add('flipped-in');
            }
        });
    }

    /* SHUTTER ANIMATIONS */

    forward.onclick = () => {
        if (slideAnimating) {
            return;
        }
        slideAnimating = true;
        movingForward = true;
        shutter(currentSlide);
    }
    
    back.onclick = () => {
        if (slideAnimating) {
            return;
        }
        slideAnimating = true;
        movingForward = false;
        shutter(currentSlide);
    }
}

/* TODO: Fix updatePic() when the last slide is completed */

function updatePic() {
    if (slideIndex === pictures.length) {
        return;
    }
    currentSlide = pictures[slideIndex];
}

function shutter(slide) {
    if (movingForward) {
        if (slideIndex === pictures.length - 1) {
            slideAnimating = false;
            return;
        }
        overlay.classList.add('shutter-effect');
        slide.classList.add('rotate-out');

        overlay.addEventListener('animationend', function removeForwardShutter() {
            this.classList.remove('shutter-effect');
            slideAnimating = false;
            this.removeEventListener('animationend', removeForwardShutter, false);
        });

        slide.addEventListener('animationend', function forwardSlideEffect() {
            this.style.display = 'none';
            this.classList.remove('rotate-out');
            slideIndex++;
            updatePic();
            this.removeEventListener('animationend', forwardSlideEffect, false);
        });
    }
    else {
        if (slideIndex === 0) {
            slideAnimating = false;
            return;
        }
        backOverlay.classList.add('shutter-back');
        slide.classList.add('rotate-back');

        backOverlay.addEventListener('animationend', function removeBackShutter() {
            this.classList.remove('shutter-back');
            slideAnimating = false;
            this.removeEventListener('animationend', removeBackShutter, false);
        });

        slide.addEventListener('animationend', function backSlideEffect() {
            pictures[slideIndex - 1].style.display = 'block';
            this.classList.remove('rotate-back');
            slideIndex--;
            updatePic();
            this.removeEventListener('animationend', backSlideEffect, false);
        });
    }
}
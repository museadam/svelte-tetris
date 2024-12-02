let touchStartX = $state(0);
let touchStartY = $state(0);
let touchEndX = $state(0);
let touchEndY = $state(0);

const threshold = 50; // Minimum distance for a swipe to be considered

export function handleTouchStart(event) {
    event.preventDefault()

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

export function handleTouchEnd(event) {
    event.preventDefault()

    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    return detectSwipe();
}

function detectSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                return 'ArrowRight'
            } else {
                return 'ArrowLeft'
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                return 'ArrowDown'
            } else {
                return 'ArrowUp'
            }
        }
    }
}



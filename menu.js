document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.menu-page');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = pages.length;
    let currentPageIndex = 0;
    let isAnimating = false;

    // Initially show the first page and update button state
    showPage(currentPageIndex);

    prevBtn.addEventListener('click', () => changePage(-1));
    nextBtn.addEventListener('click', () => changePage(1));

    function showPage(index) {
        pages.forEach(page => {
            page.classList.remove('active', 'exit-left', 'exit-right', 'enter-left', 'enter-right');
        });
        pages[index].classList.add('active');
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalPages - 1;
    }

    function changePage(direction) {
        if (isAnimating) return;
        const newIndex = currentPageIndex + direction;
        if (newIndex < 0 || newIndex >= totalPages) return;

        isAnimating = true;

        const oldPage = pages[currentPageIndex];
        const newPage = pages[newIndex];

        // Position the incoming page off-screen on the correct side
        if (direction > 0) {
            newPage.classList.add('enter-right');
        } else {
            newPage.classList.add('enter-left');
        }

        // Make incoming page visible (but off-screen)
        newPage.classList.add('active');

        // Force a reflow so the browser registers the starting position
        newPage.getBoundingClientRect();

        // Slide old page out, slide new page in
        if (direction > 0) {
            oldPage.classList.add('exit-left');
            newPage.classList.remove('enter-right');
        } else {
            oldPage.classList.add('exit-right');
            newPage.classList.remove('enter-left');
        }

        setTimeout(() => {
            currentPageIndex = newIndex;
            showPage(currentPageIndex);
            isAnimating = false;
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.menu-page');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = pages.length;
    let currentPageIndex = 0;

    // Initially show the first page and update button visibility
    showPage(currentPageIndex);

    prevBtn.addEventListener('click', () => changePage(-1));
    nextBtn.addEventListener('click', () => changePage(1));

    function showPage(index) {
        // Remove 'active' and 'flip' classes from all pages
        pages.forEach(page => {
            page.classList.remove('active', 'flip-prev', 'flip-next');
            page.style.zIndex = 0; // Reset Z-index
        });

        // Add 'active' class to the current page
        const currentPage = pages[index];
        currentPage.classList.add('active');
        currentPage.style.zIndex = 2;

        // Update button visibility
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalPages - 1;
    }

    function changePage(direction) {
        const newIndex = currentPageIndex + direction;

        if (newIndex >= 0 && newIndex < totalPages) {
            const oldPage = pages[currentPageIndex];
            const newPage = pages[newIndex];

            // 1. Prepare the old page for animation
            oldPage.style.zIndex = 3;
            newPage.style.zIndex = 1;

            if (direction > 0) {
                // Next page (flip-next)
                oldPage.classList.add('flip-next');
            } else {
                // Previous page (flip-prev)
                oldPage.classList.add('flip-prev');
            }

            // Wait for the flip animation to mostly complete (500ms)
            setTimeout(() => {
                currentPageIndex = newIndex;
                showPage(newIndex);
            }, 500);
        }
    }
});
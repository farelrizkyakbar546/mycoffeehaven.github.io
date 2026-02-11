// ===== ENHANCED NOVEL WEBSITE FUNCTIONALITIES =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌙 Aroma Kopi Enhanced v1.0 loaded');
    
    // Initialize all features
    initializeTheme();
    initializeNavigation();
    initializeReadingProgress();
    initializeBookmarks();
    initializeSearch();
    initializeStatistics();
    initializePDFViewer();
    initializeScrollProgress();
    initializeChapterInteractions();
});

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('novel_theme');
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
        enableDarkMode();
    }
    
    // Create toggle button if not exists
    if (!themeToggle) {
        createThemeToggle();
    } else {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Update toggle icon
    updateThemeIcon();
}

function createThemeToggle() {
    const navControls = document.querySelector('.nav-controls');
    if (!navControls) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '🌙';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    toggleBtn.addEventListener('click', toggleTheme);
    
    navControls.appendChild(toggleBtn);
}

function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
    updateThemeIcon();
}

function enableDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-mode');
    localStorage.setItem('novel_theme', 'dark');
}

function disableDarkMode() {
    document.documentElement.removeAttribute('data-theme');
    document.body.classList.remove('dark-mode');
    localStorage.setItem('novel_theme', 'light');
}

function updateThemeIcon() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

// ===== NAVIGATION ENHANCEMENT =====
function initializeNavigation() {
    // Highlight active section on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // Create search toggle if not exists
    const navControls = document.querySelector('.nav-controls');
    if (navControls && !document.querySelector('.search-toggle')) {
        const searchBtn = document.createElement('button');
        searchBtn.className = 'search-toggle';
        searchBtn.innerHTML = '🔍';
        searchBtn.setAttribute('aria-label', 'Search in novel');
        searchBtn.addEventListener('click', openSearch);
        navControls.appendChild(searchBtn);
    }
}

// ===== SCROLL PROGRESS =====
function initializeScrollProgress() {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(scrollProgress);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
}

// ===== READING PROGRESS TRACKING =====
function initializeReadingProgress() {
    const chapters = document.querySelectorAll('.chapter-main');
    
    chapters.forEach(chapter => {
        const chapterNumber = chapter.querySelector('.chapter-number')?.textContent.match(/\d+/)?.[0];
        if (!chapterNumber) return;
        
        // Create reading progress indicator
        const metaEnhanced = document.createElement('div');
        metaEnhanced.className = 'chapter-meta-enhanced';
        
        const progressCircle = document.createElement('div');
        progressCircle.className = 'progress-circle';
        
        const readingTime = document.createElement('span');
        readingTime.className = 'reading-time';
        readingTime.innerHTML = '⏱️ <span class="time-value">Belum dibaca</span>';
        
        metaEnhanced.appendChild(progressCircle);
        metaEnhanced.appendChild(readingTime);
        
        const chapterMeta = chapter.querySelector('.chapter-meta');
        if (chapterMeta) {
            chapterMeta.parentNode.insertBefore(metaEnhanced, chapterMeta.nextSibling);
        }
        
        // Check if already read
        const readChapters = JSON.parse(localStorage.getItem('read_chapters') || '[]');
        if (readChapters.includes(parseInt(chapterNumber))) {
            progressCircle.classList.add('read');
            readingTime.querySelector('.time-value').textContent = 'Sudah dibaca';
        }
        
        // Mark as read when clicked
        const readBtn = chapter.querySelector('.chapter-btn');
        if (readBtn) {
            readBtn.addEventListener('click', function() {
                markChapterAsRead(chapterNumber);
                progressCircle.classList.add('read');
                readingTime.querySelector('.time-value').textContent = 'Sudah dibaca';
                updateStatistics();
            });
        }
    });
}

function markChapterAsRead(chapterNumber) {
    const readChapters = JSON.parse(localStorage.getItem('read_chapters') || '[]');
    if (!readChapters.includes(parseInt(chapterNumber))) {
        readChapters.push(parseInt(chapterNumber));
        localStorage.setItem('read_chapters', JSON.stringify(readChapters));
        
        // Add reading timestamp
        const readTimes = JSON.parse(localStorage.getItem('read_times') || '{}');
        readTimes[chapterNumber] = new Date().toISOString();
        localStorage.setItem('read_times', JSON.stringify(readTimes));
    }
}

// ===== BOOKMARK SYSTEM =====
function initializeBookmarks() {
    // Create bookmark buttons for each chapter
    const chapters = document.querySelectorAll('.chapter-card');
    
    chapters.forEach(chapter => {
        const chapterNumber = chapter.querySelector('.chapter-number')?.textContent.match(/\d+/)?.[0];
        if (!chapterNumber) return;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'chapter-actions';
        
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'chapter-action-btn';
        bookmarkBtn.innerHTML = '🔖';
        bookmarkBtn.setAttribute('aria-label', 'Bookmark this chapter');
        bookmarkBtn.dataset.chapter = chapterNumber;
        
        // Check if already bookmarked
        const bookmarks = getBookmarks();
        if (bookmarks.includes(parseInt(chapterNumber))) {
            bookmarkBtn.classList.add('bookmarked');
        }
        
        bookmarkBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(chapterNumber, bookmarkBtn);
        });
        
        actionsDiv.appendChild(bookmarkBtn);
        chapter.appendChild(actionsDiv);
    });
    
    // Create bookmark panel
    createBookmarkPanel();
}

function getBookmarks() {
    return JSON.parse(localStorage.getItem('novel_bookmarks') || '[]');
}

function toggleBookmark(chapterNumber, button) {
    const bookmarks = getBookmarks();
    const chapterNum = parseInt(chapterNumber);
    
    if (bookmarks.includes(chapterNum)) {
        // Remove bookmark
        const index = bookmarks.indexOf(chapterNum);
        bookmarks.splice(index, 1);
        button.classList.remove('bookmarked');
        showNotification('Bookmark dihapus', 'info');
    } else {
        // Add bookmark
        bookmarks.push(chapterNum);
        button.classList.add('bookmarked');
        showNotification('Bab dibookmark!', 'success');
    }
    
    localStorage.setItem('novel_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkPanel();
}

function createBookmarkPanel() {
    const panel = document.createElement('div');
    panel.className = 'bookmark-panel';
    panel.innerHTML = `
        <div class="bookmark-header">
            <h3>📚 Bookmark Saya</h3>
            <button class="close-bookmarks" aria-label="Close bookmarks">✕</button>
        </div>
        <div class="bookmark-list"></div>
    `;
    
    document.body.appendChild(panel);
    
    // Close button event
    panel.querySelector('.close-bookmarks').addEventListener('click', function() {
        panel.classList.remove('active');
    });
    
    // Update panel content
    updateBookmarkPanel();
}

function updateBookmarkPanel() {
    const bookmarkList = document.querySelector('.bookmark-list');
    if (!bookmarkList) return;
    
    const bookmarks = getBookmarks();
    
    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = '<p class="empty-bookmarks">Belum ada bookmark. Klik ikon 🔖 di bab favorit Anda.</p>';
        return;
    }
    
    let html = '';
    bookmarks.sort((a, b) => a - b).forEach(chapterNum => {
        const chapterElement = document.querySelector(`.chapter-number:contains("${chapterNum}")`)?.closest('.chapter-card');
        const title = chapterElement?.querySelector('.chapter-title')?.textContent || `Bab ${chapterNum}`;
        
        html += `
            <div class="bookmark-item" data-chapter="${chapterNum}">
                <div class="bookmark-number">${chapterNum}</div>
                <div class="bookmark-title">${title}</div>
            </div>
        `;
    });
    
    bookmarkList.innerHTML = html;
    
    // Add click events to bookmark items
    bookmarkList.querySelectorAll('.bookmark-item').forEach(item => {
        item.addEventListener('click', function() {
            const chapterNum = this.dataset.chapter;
            const chapterElement = document.querySelector(`[data-chapter="${chapterNum}"]`)?.closest('.chapter-main');
            
            if (chapterElement) {
                chapterElement.scrollIntoView({ behavior: 'smooth' });
                document.querySelector('.bookmark-panel').classList.remove('active');
                
                // Highlight the chapter
                chapterElement.style.animation = 'none';
                setTimeout(() => {
                    chapterElement.style.animation = 'pulse 1s';
                }, 10);
            }
        });
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    // Create search overlay
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <button class="close-search" aria-label="Close search">✕</button>
        <div class="search-container">
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="searchInput" placeholder="Cari kata atau kalimat dalam novel...">
            </div>
            <div class="search-results"></div>
        </div>
    `;
    
    document.body.appendChild(searchOverlay);
    
    // Close search events
    searchOverlay.querySelector('.close-search').addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });
    
    // Search input event
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            performSearch(this.value);
        }, 300));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                openSearch();
            }
            
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });
    }
}

function openSearch() {
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.getElementById('searchInput');
    
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        if (searchInput) {
            searchInput.focus();
        }
    }, 100);
}

function closeSearch() {
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.getElementById('searchInput');
    
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

function performSearch(query) {
    const resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) return;
    
    if (!query.trim()) {
        resultsContainer.innerHTML = '<p class="no-results">Mulai ketik untuk mencari...</p>';
        return;
    }
    
    // Get all chapter content
    const chapters = document.querySelectorAll('.chapter-main');
    let results = [];
    
    chapters.forEach(chapter => {
        const chapterNumber = chapter.querySelector('.chapter-number')?.textContent;
        const chapterTitle = chapter.querySelector('.chapter-title')?.textContent;
        const excerpt = chapter.querySelector('.chapter-excerpt p')?.textContent || '';
        
        // Search in excerpt
        const lowerExcerpt = excerpt.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (lowerExcerpt.includes(lowerQuery)) {
            const startIndex = lowerExcerpt.indexOf(lowerQuery);
            const contextStart = Math.max(0, startIndex - 50);
            const contextEnd = Math.min(lowerExcerpt.length, startIndex + query.length + 50);
            
            let preview = excerpt.substring(contextStart, contextEnd);
            if (contextStart > 0) preview = '...' + preview;
            if (contextEnd < lowerExcerpt.length) preview = preview + '...';
            
            // Highlight the search term
            const regex = new RegExp(`(${query})`, 'gi');
            preview = preview.replace(regex, '<mark>$1</mark>');
            
            results.push({
                chapter: chapterNumber,
                title: chapterTitle,
                preview: preview,
                element: chapter
            });
        }
    });
    
    // Display results
    if (results.length === 0) {
        resultsContainer.innerHTML = `<p class="no-results">Tidak ditemukan hasil untuk "${query}"</p>`;
    } else {
        let html = `<p class="results-count">Ditemukan ${results.length} hasil:</p>`;
        
        results.forEach(result => {
            html += `
                <div class="search-result-item" data-chapter="${result.chapter}">
                    <h4>${result.chapter} - ${result.title}</h4>
                    <p>${result.preview}</p>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
        
        // Add click events to results
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function() {
                const chapterNum = this.dataset.chapter;
                const chapterElement = document.querySelector(`.chapter-number:contains("${chapterNum}")`)?.closest('.chapter-main');
                
                if (chapterElement) {
                    closeSearch();
                    chapterElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Highlight the result
                    chapterElement.style.boxShadow = '0 0 0 3px var(--accent-gold)';
                    setTimeout(() => {
                        chapterElement.style.boxShadow = '';
                    }, 2000);
                }
            });
        });
    }
}

// ===== PDF VIEWER =====
function initializePDFViewer() {
    // Create PDF modal
    const pdfModal = document.createElement('div');
    pdfModal.className = 'pdf-modal';
    pdfModal.innerHTML = `
        <div class="pdf-modal-content">
            <button class="close-pdf" aria-label="Close PDF viewer">✕</button>
            <iframe id="pdfFrame"></iframe>
            <div class="pdf-controls">
                <button onclick="downloadCurrentPdf()">⬇ Download PDF</button>
                <button onclick="printPdf()">🖨️ Print</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(pdfModal);
    
    // Close button event
    pdfModal.querySelector('.close-pdf').addEventListener('click', closePdf);
    
    // Close on overlay click
    pdfModal.addEventListener('click', function(e) {
        if (e.target === pdfModal) {
            closePdf();
        }
    });
    
    // Update all PDF links to use the viewer
    document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
        const originalHref = link.getAttribute('href');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openPdf(originalHref);
            
            // Mark chapter as read
            const chapterCard = this.closest('.chapter-card');
            if (chapterCard) {
                const chapterNumber = chapterCard.querySelector('.chapter-number')?.textContent.match(/\d+/)?.[0];
                if (chapterNumber) {
                    markChapterAsRead(chapterNumber);
                }
            }
        });
    });
}

function openPdf(pdfUrl) {
    const pdfModal = document.querySelector('.pdf-modal');
    const pdfFrame = document.getElementById('pdfFrame');
    
    if (pdfModal && pdfFrame) {
        pdfFrame.src = pdfUrl + '#view=FitH';
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Track PDF view in statistics
        const chapterMatch = pdfUrl.match(/bab(\d+)/i);
        if (chapterMatch) {
            const pdfViews = JSON.parse(localStorage.getItem('pdf_views') || '{}');
            pdfViews[chapterMatch[1]] = (pdfViews[chapterMatch[1]] || 0) + 1;
            localStorage.setItem('pdf_views', JSON.stringify(pdfViews));
            updateStatistics();
        }
    }
}

function closePdf() {
    const pdfModal = document.querySelector('.pdf-modal');
    const pdfFrame = document.getElementById('pdfFrame');
    
    if (pdfModal) {
        pdfModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (pdfFrame) {
        // Clear the iframe source
        setTimeout(() => {
            pdfFrame.src = '';
        }, 300);
    }
}

function downloadCurrentPdf() {
    const pdfFrame = document.getElementById('pdfFrame');
    if (pdfFrame && pdfFrame.src) {
        const link = document.createElement('a');
        link.href = pdfFrame.src;
        link.download = pdfFrame.src.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function printPdf() {
    const pdfFrame = document.getElementById('pdfFrame');
    if (pdfFrame && pdfFrame.contentWindow) {
        pdfFrame.contentWindow.print();
    }
}

// ===== STATISTICS SYSTEM =====
function initializeStatistics() {
    createStatsPanel();
    updateStatistics();
}

function createStatsPanel() {
    const statsPanel = document.createElement('div');
    statsPanel.className = 'stats-panel';
    statsPanel.innerHTML = `
        <div class="stats-header">
            <h4>📊 Statistik Membaca</h4>
            <button class="close-stats" aria-label="Close statistics">✕</button>
        </div>
        <div class="stats-content">
            <div class="stats-item">
                <span class="stats-label">Total Bab Dibaca:</span>
                <span class="stats-value" id="stats-chapters-read">0</span>
            </div>
            <div class="stats-item">
                <span class="stats-label">Progress:</span>
                <span class="stats-value" id="stats-progress">0%</span>
            </div>
            <div class="stats-item">
                <span class="stats-label">Bookmark:</span>
                <span class="stats-value" id="stats-bookmarks">0</span>
            </div>
            <div class="stats-item">
                <span class="stats-label">Total Waktu:</span>
                <span class="stats-value" id="stats-total-time">0 menit</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(statsPanel);
    
    // Close button event
    statsPanel.querySelector('.close-stats').addEventListener('click', function() {
        statsPanel.classList.remove('active');
    });
    
    // Create floating stats button
    const floatingControls = document.querySelector('.floating-controls') || createFloatingControls();
    const statsBtn = document.createElement('button');
    statsBtn.className = 'floating-control-btn stats-btn';
    statsBtn.innerHTML = '📊';
    statsBtn.setAttribute('aria-label', 'Show reading statistics');
    statsBtn.addEventListener('click', function() {
        statsPanel.classList.toggle('active');
    });
    
    floatingControls.appendChild(statsBtn);
}

function updateStatistics() {
    // Calculate statistics
    const readChapters = JSON.parse(localStorage.getItem('read_chapters') || '[]');
    const bookmarks = getBookmarks();
    const totalChapters = document.querySelectorAll('.chapter-main').length;
    
    // Calculate estimated reading time (8 minutes per chapter)
    const estimatedMinutes = readChapters.length * 8;
    
    // Update stats panel
    document.getElementById('stats-chapters-read')?.textContent = readChapters.length;
    document.getElementById('stats-progress')?.textContent = Math.round((readChapters.length / totalChapters) * 100) + '%';
    document.getElementById('stats-bookmarks')?.textContent = bookmarks.length;
    document.getElementById('stats-total-time')?.textContent = estimatedMinutes + ' menit';
    
    // Update writing progress
    updateWritingProgress();
}

function updateWritingProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const totalChapters = 22; // Total target chapters
        const writtenChapters = 3; // Currently written chapters
        const progress = Math.round((writtenChapters / totalChapters) * 100);
        
        progressFill.style.width = progress + '%';
        
        const progressText = document.querySelector('.progress-text span:last-child');
        if (progressText) {
            progressText.textContent = progress + '%';
        }
    }
}

// ===== FLOATING CONTROLS =====
function createFloatingControls() {
    const floatingControls = document.createElement('div');
    floatingControls.className = 'floating-controls';
    document.body.appendChild(floatingControls);
    
    // Add bookmark toggle button
    const bookmarkToggleBtn = document.createElement('button');
    bookmarkToggleBtn.className = 'floating-control-btn bookmark-btn';
    bookmarkToggleBtn.innerHTML = '📚';
    bookmarkToggleBtn.setAttribute('aria-label', 'Toggle bookmarks panel');
    bookmarkToggleBtn.addEventListener('click', function() {
        document.querySelector('.bookmark-panel').classList.toggle('active');
    });
    
    floatingControls.appendChild(bookmarkToggleBtn);
    
    return floatingControls;
}

// ===== CHAPTER INTERACTIONS =====
function initializeChapterInteractions() {
    // Add hover effects to chapters
    const chapters = document.querySelectorAll('.chapter-card');
    
    chapters.forEach(chapter => {
        chapter.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 60px rgba(110, 73, 45, 0.15)';
        });
        
        chapter.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Add click animation to read buttons
    document.querySelectorAll('.chapter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
    }
`;
document.head.appendChild(notificationStyles);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + B to toggle bookmarks
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        document.querySelector('.bookmark-panel').classList.toggle('active');
    }
    
    // Ctrl/Cmd + D to toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Esc to close modals
    if (e.key === 'Escape') {
        closeSearch();
        closePdf();
        document.querySelector('.bookmark-panel').classList.remove('active');
        document.querySelector('.stats-panel').classList.remove('active');
    }
});

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', function() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
    });
    
    // Update statistics
    updateStatistics();
    
    // Initialize tooltips
    initializeTooltips();
});

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[aria-label]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = this.getAttribute('aria-label');
    tooltip.style.cssText = `
        position: absolute;
        background: var(--coffee-dark);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        transform: translateY(10px);
        opacity: 0;
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => {
        tooltip.style.transform = 'translateY(0)';
        tooltip.style.opacity = '1';
    }, 10);
    
    this.tooltipElement = tooltip;
}

function hideTooltip() {
    if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = null;
    }
}

// Export functions for global use
window.openPdf = openPdf;
window.closePdf = closePdf;
window.downloadCurrentPdf = downloadCurrentPdf;
window.printPdf = printPdf;
window.toggleTheme = toggleTheme;
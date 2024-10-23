// common.js - Contains functionality used across all pages
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializePageLoad();
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
});

// Page Load Functions
function initializePageLoad() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = 0;
        setTimeout(() => {
            mainContent.style.transition = 'opacity 0.5s ease-in-out';
            mainContent.style.opacity = 1;
        }, 100);
    }
}

// Sidebar Functions
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const submenus = document.querySelectorAll('.has-submenu');

    if (!sidebar || !toggleBtn) return;

    // Temporarily disable transitions on page load
    sidebar.classList.add('no-transition');
    document.body.classList.add('no-transition');
    
    // Immediately hide all submenus without transition
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.style.cssText = 'transition: none; max-height: 0;';
    });

    // Apply the saved sidebar state
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    sidebar.classList.toggle('collapsed', isCollapsed);
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    document.body.classList.toggle('sidebar-expanded', !isCollapsed);

    // Restore submenu states
    restoreSubmenuStates();

    // Re-enable transitions after a delay
    setTimeout(() => {
        sidebar.classList.remove('no-transition');
        document.body.classList.remove('no-transition');
        
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.style.transition = '';
        });
    }, 100);

    // Sidebar toggle functionality
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        document.body.classList.toggle('sidebar-collapsed', isCollapsed);
        document.body.classList.toggle('sidebar-expanded', !isCollapsed);
        localStorage.setItem('sidebar-collapsed', isCollapsed);
    });

    // Submenu functionality
    submenus.forEach(submenu => {
        submenu.addEventListener('click', (e) => {
            e.preventDefault();
            submenu.classList.toggle('open');
            const submenuList = submenu.querySelector('.submenu');
            if (submenuList) {
                submenuList.style.maxHeight = submenu.classList.contains('open') 
                    ? `${submenuList.scrollHeight}px` 
                    : null;
            }
            saveSubmenuStates();
        });
    });

    // Prevent submenu links from triggering submenu toggle
    document.querySelectorAll('.submenu a').forEach(item => {
        item.addEventListener('click', (e) => e.stopPropagation());
    });
}

function saveSubmenuStates() {
    const openSubmenus = Array.from(document.querySelectorAll('.has-submenu.open'))
        .map(sub => sub.dataset.submenuId);
    localStorage.setItem('open-submenus', JSON.stringify(openSubmenus));
}

function restoreSubmenuStates() {
    const openSubmenus = JSON.parse(localStorage.getItem('open-submenus') || '[]');
    openSubmenus.forEach(id => {
        const submenu = document.querySelector(`.has-submenu[data-submenu-id="${id}"]`);
        if (submenu) {
            submenu.classList.add('open');
            const submenuList = submenu.querySelector('.submenu');
            if (submenuList) {
                submenuList.style.maxHeight = `${submenuList.scrollHeight}px`;
            }
        }
    });
}





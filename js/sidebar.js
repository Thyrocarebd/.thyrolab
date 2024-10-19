function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const submenus = document.querySelectorAll('.has-submenu');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
        document.body.classList.toggle('sidebar-expanded');
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedSubmenu = e.currentTarget;
            const submenuList = clickedSubmenu.querySelector('.submenu');

            submenus.forEach(other => {
                if (other !== clickedSubmenu) {
                    other.classList.remove('open');
                    other.querySelector('.submenu').style.maxHeight = null;
                }
            });

            clickedSubmenu.classList.toggle('open');
            submenuList.style.maxHeight = clickedSubmenu.classList.contains('open') 
                ? `${submenuList.scrollHeight}px` 
                : null;
        });
    });

    document.querySelectorAll('.submenu a').forEach(item => {
        item.addEventListener('click', (e) => e.stopPropagation());
    });
}

// The initializeSidebar function will be called from main.js after the sidebar is loaded
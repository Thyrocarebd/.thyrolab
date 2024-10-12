document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const submenus = document.querySelectorAll('.has-submenu');

    toggleBtn.addEventListener('click', () => {
        // Toggle sidebar collapsed state
        sidebar.classList.toggle('collapsed');

        // Apply a class to the body based on sidebar state
        if (sidebar.classList.contains('collapsed')) {
            document.body.classList.remove('sidebar-expanded');
            document.body.classList.add('sidebar-collapsed');
        } else {
            document.body.classList.remove('sidebar-collapsed');
            document.body.classList.add('sidebar-expanded');
        }
    });

    submenus.forEach(submenu => {
        submenu.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedSubmenu = e.currentTarget;
            const submenuList = clickedSubmenu.querySelector('.submenu');

            // Close other open submenus
            submenus.forEach(other => {
                if (other !== clickedSubmenu) {
                    other.classList.remove('open');
                    other.querySelector('.submenu').style.maxHeight = null;
                }
            });

            // Toggle the current submenu
            clickedSubmenu.classList.toggle('open');
            if (submenuList.style.maxHeight) {
                submenuList.style.maxHeight = null;
            } else {
                submenuList.style.maxHeight = submenuList.scrollHeight + "px";
            }
        });
    });

    // Ensure submenu items are clickable
    document.querySelectorAll('.submenu a').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});

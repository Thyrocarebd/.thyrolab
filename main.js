document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const submenus = document.querySelectorAll('.has-submenu');

  // Toggle sidebar collapse when button is clicked
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    setTimeout(() => {
      document.body.classList.toggle('sidebar-collapsed');
    }, 50);
  });

  // Collapse sidebar when clicking outside of it
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      if (!sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
        setTimeout(() => {
          document.body.classList.add('sidebar-collapsed');
        }, 50);
      }
    }
  });

  // Submenu click logic
  submenus.forEach(submenu => {
    submenu.addEventListener('click', (e) => {
      e.preventDefault();
      const clickedSubmenu = e.currentTarget;
      const submenuList = clickedSubmenu.querySelector('.submenu');

      // Close other submenus when one is clicked
      submenus.forEach(other => {
        if (other !== clickedSubmenu) {
          other.classList.remove('open');
          other.querySelector('.submenu').style.maxHeight = null;
        }
      });

      clickedSubmenu.classList.toggle('open');
      if (submenuList.style.maxHeight) {
        submenuList.style.maxHeight = null;
      } else {
        submenuList.style.maxHeight = submenuList.scrollHeight + "px";
      }

      // Collapse the sidebar only when a submenu item is clicked
      submenuList.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent event bubbling
          if (!sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            setTimeout(() => {
              document.body.classList.add('sidebar-collapsed');
            }, 50);
          }
        });
      });
    });
  });

  // Ensure submenu items are clickable without closing the submenu
  document.querySelectorAll('.submenu a').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
});

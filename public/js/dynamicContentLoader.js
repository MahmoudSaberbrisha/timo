// dynamicContentLoader.js
document.addEventListener('DOMContentLoaded', () => {
  const contentContainer = document.getElementById('dynamic-content');
  const sidebar = document.querySelector('nav.flex-1');

  // Function to load page content via AJAX
  async function loadPage(url, pushState = true) {
    try {
      const response = await fetch(url, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const text = await response.text();

      // Parse the response text to extract #dynamic-content innerHTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const newContent = doc.getElementById('dynamic-content');
      if (newContent) {
        contentContainer.innerHTML = newContent.innerHTML;
        if (pushState) {
          history.pushState({ url }, '', url);
          localStorage.setItem('currentPage', url);
        }
        // Re-initialize tabs after content load
        if (typeof initializeTabs === 'function') {
          initializeTabs();
        }
        // Update sidebar active link highlighting
        updateSidebarActiveLink(url);
        // Restore sidebar submenu state
        restoreSidebarState();
      } else {
        // fallback: replace whole body if #dynamic-content not found
        contentContainer.innerHTML = text;
      }
    } catch (error) {
      console.error('Failed to load page:', error);
    }
  }

  // Update sidebar active link highlighting based on current URL
  function updateSidebarActiveLink(url) {
    const links = sidebar.querySelectorAll('a');
    links.forEach(link => {
      if (link.href === location.origin + url) {
        link.classList.add('bg-green-700', 'font-bold');
      } else {
        link.classList.remove('bg-green-700', 'font-bold');
      }
    });
  }

  // Save sidebar submenu expanded/collapsed state to localStorage
  function saveSidebarState() {
    const submenuStates = {};
    const submenuButtons = sidebar.querySelectorAll('button[id$="-btn"]');
    submenuButtons.forEach(button => {
      const menuId = button.id.replace('-btn', '-menu');
      const menu = document.getElementById(menuId);
      if (menu) {
        submenuStates[menuId] = !menu.classList.contains('hidden');
      }
    });
    localStorage.setItem('sidebarSubmenuState', JSON.stringify(submenuStates));
  }

  // Restore sidebar submenu expanded/collapsed state from localStorage
  function restoreSidebarState() {
    const submenuStates = JSON.parse(localStorage.getItem('sidebarSubmenuState') || '{}');
    Object.entries(submenuStates).forEach(([menuId, isExpanded]) => {
      const menu = document.getElementById(menuId);
      const buttonId = menuId.replace('-menu', '-btn');
      const button = document.getElementById(buttonId);
      const arrow = document.getElementById(buttonId.replace('-btn', '-arrow'));
      if (menu && button && arrow) {
        if (isExpanded) {
          menu.classList.remove('hidden');
          arrow.classList.add('rotate-180');
        } else {
          menu.classList.add('hidden');
          arrow.classList.remove('rotate-180');
        }
      }
    });
  }

  // Intercept clicks on sidebar links and buttons
  sidebar.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (target) {
      if (target.tagName.toLowerCase() === 'a' && target.href && target.origin === location.origin) {
        e.preventDefault();
        const url = target.getAttribute('href');
        loadPage(url);
      } else if (target.tagName.toLowerCase() === 'button' && target.dataset.url) {
        e.preventDefault();
        const url = target.dataset.url;
        loadPage(url);
      } else if (target.tagName.toLowerCase() === 'button' && target.id && target.id.endsWith('-btn')) {
        // Toggle submenu visibility and save state
        const menuId = target.id.replace('-btn', '-menu');
        const menu = document.getElementById(menuId);
        const arrowId = target.id.replace('-btn', '-arrow');
        const arrow = document.getElementById(arrowId);
        if (menu && arrow) {
          menu.classList.toggle('hidden');
          arrow.classList.toggle('rotate-180');
          saveSidebarState();
        }
      }
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.url) {
      loadPage(e.state.url, false);
    }
  });

  // On page load, load stored page if any
  const storedPage = localStorage.getItem('currentPage');
  if (storedPage && storedPage !== location.pathname) {
    loadPage(storedPage, false);
  } else {
    // Store current page if none stored
    localStorage.setItem('currentPage', location.pathname);
  }

  // Initialize sidebar state on page load
  restoreSidebarState();
  // Initialize sidebar active link highlighting on page load
  updateSidebarActiveLink(location.pathname);
});

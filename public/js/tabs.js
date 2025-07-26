function initializeTabs() {
  const tabs = ['general', 'tools', 'maintenance'];

  function openTab(tabName) {
    tabs.forEach(tab => {
      const content = document.getElementById('tab-content-' + tab);
      const button = document.getElementById('tab-' + tab);
      if (content) content.classList.add('hidden');
      if (button) {
        button.classList.remove('border-b-0', 'bg-white', 'text-gray-700', 'font-semibold');
        button.classList.add('text-gray-500');
      }
    });
    const activeContent = document.getElementById('tab-content-' + tabName);
    const activeButton = document.getElementById('tab-' + tabName);
    if (activeContent) activeContent.classList.remove('hidden');
    if (activeButton) {
      activeButton.classList.add('border-b-0', 'bg-white', 'text-gray-700', 'font-semibold');
      activeButton.classList.remove('text-gray-500');
    }
  }

  tabs.forEach(tab => {
    const button = document.getElementById('tab-' + tab);
    if (button) {
      button.addEventListener('click', () => openTab(tab));
    }
  });

  // Initialize first tab as active
  openTab('general');
}

// Initialize tabs on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeTabs);

// Re-initialize tabs if needed (e.g., after AJAX navigation)
// You can call initializeTabs() manually after content changes

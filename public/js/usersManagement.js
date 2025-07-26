async function fetchUserManagementData() {
  try {
    const response = await fetch('/api/user-management/data');
    if (!response.ok) throw new Error('Failed to fetch user management data');
    const result = await response.json();
    if (!result.success) throw new Error('API returned failure');
    return result.data;
  } catch (error) {
    console.error('Error fetching user management data:', error);
    return null;
  }
}

function renderUserManagementSummary(data) {
  document.getElementById('rolesCount').textContent = data.rolesCount;
  document.getElementById('inactiveUsersCount').textContent = data.inactiveUsers;
  document.getElementById('activeUsersCount').textContent = data.activeUsers;
  document.getElementById('totalUsersCount').textContent = data.totalUsers;

  const roleFilter = document.getElementById('roleFilter');
  roleFilter.innerHTML = '<option value="">جميع الأدوار</option>';
  // Extract unique roles from users
  const uniqueRoles = [...new Set(data.users.map(u => u.role.name))];
  uniqueRoles.forEach(role => {
    const option = document.createElement('option');
    option.value = role;
    option.textContent = role;
    roleFilter.appendChild(option);
  });

  // Also populate roles in add user modal role select
  const addUserRoleSelect = document.getElementById('role');
  addUserRoleSelect.innerHTML = '<option value="">اختر الدور</option>';
  uniqueRoles.forEach(role => {
    const option = document.createElement('option');
    option.value = role;
    option.textContent = role;
    addUserRoleSelect.appendChild(option);
  });
}

function renderUserManagementUsers(users) {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = '';
  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'border rounded p-4 flex justify-between items-center';

    const userInfo = document.createElement('div');
    userInfo.innerHTML = `
      <div class="font-bold text-lg">${user.name || user.username} <span class="text-green-600">${user.status === 'active' ? 'نشط' : 'معطل'}</span></div>
      <div class="text-gray-600">${user.email} | ${user.username}</div>
      <div class="text-sm text-gray-400">آخر دخول: ${user.lastLogin || 'غير متوفر'}</div>
    `;

    const actions = document.createElement('div');
    actions.className = 'flex gap-2';
    actions.innerHTML = `
      <button title="تعديل" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">تعديل</button>
      <button title="إعادة تعيين" class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">إعادة تعيين</button>
      <button title="حذف" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">حذف</button>
    `;

    userDiv.appendChild(userInfo);
    userDiv.appendChild(actions);
    usersList.appendChild(userDiv);
  });
}

function filterUsers(users, roleFilterValue, statusFilterValue, searchValue) {
  return users.filter(user => {
    const matchesRole = roleFilterValue === '' || (user.role && user.role.name === roleFilterValue);
    const matchesStatus = statusFilterValue === '' || user.status === statusFilterValue;
    const searchLower = searchValue.toLowerCase();
    const matchesSearch =
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.name && user.name.toLowerCase().includes(searchLower));
    return matchesRole && matchesStatus && matchesSearch;
  });
}

function exportUsersToCSV(users) {
  const headers = ['اسم المستخدم', 'البريد الإلكتروني', 'الدور', 'الحالة', 'آخر دخول'];
  const rows = users.map(user => [
    user.username,
    user.email,
    user.role ? user.role.name : '',
    user.status,
    user.lastLogin || ''
  ]);

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += headers.join(',') + '\r\n';
  rows.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(',') + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'users_export.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function initUserManagementPage() {
  let allUsers = [];
  let currentData = null;

  async function refreshData() {
    currentData = await fetchUserManagementData();
    if (!currentData) return;
    allUsers = currentData.users;
    renderUserManagementSummary(currentData);
    applyFiltersAndRender();
  }

  function applyFiltersAndRender() {
    const roleFilterValue = document.getElementById('roleFilter').value;
    const statusFilterValue = document.getElementById('statusFilter').value;
    const searchValue = document.getElementById('userSearch').value.trim();
    const filteredUsers = filterUsers(allUsers, roleFilterValue, statusFilterValue, searchValue);
    renderUserManagementUsers(filteredUsers);
  }

  // Event listeners for filters and search
  document.getElementById('roleFilter').addEventListener('change', applyFiltersAndRender);
  document.getElementById('statusFilter').addEventListener('change', applyFiltersAndRender);
  document.getElementById('userSearch').addEventListener('input', applyFiltersAndRender);

  // Export button
  document.getElementById('exportBtn').addEventListener('click', () => {
    exportUsersToCSV(allUsers);
  });

  // Add User Modal logic
  const addUserBtn = document.getElementById('addUserBtn');
  const addUserModal = document.getElementById('addUserModal');
  const addUserForm = document.getElementById('addUserForm');
  const closeAddUserModalBtn = document.getElementById('closeAddUserModal');
  const cancelAddUserBtn = document.getElementById('cancelAddUser');

  function openAddUserModal() {
    addUserModal.classList.remove('hidden');
  }

  function closeAddUserModal() {
    addUserModal.classList.add('hidden');
    addUserForm.reset();
  }

  addUserBtn.addEventListener('click', openAddUserModal);
  closeAddUserModalBtn.addEventListener('click', closeAddUserModal);
  cancelAddUserBtn.addEventListener('click', closeAddUserModal);

  addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addUserForm);
    const userData = {};
    formData.forEach((value, key) => {
      userData[key] = value;
    });

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add user');
      }
      closeAddUserModal();
      await refreshData();
    } catch (error) {
      alert('خطأ في إضافة المستخدم: ' + error.message);
    }
  });

  await refreshData();
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/system/general-settings/users') {
    initUserManagementPage();
  }
});

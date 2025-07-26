async function fetchRoles() {
  try {
    const response = await fetch('/roles');
    if (!response.ok) throw new Error('Failed to fetch roles');
    const result = await response.json();
    if (!result.success) throw new Error('API returned failure');
    return result.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

function renderRoles(roles) {
  const rolesContainer = document.getElementById('rolesContainer');
  rolesContainer.innerHTML = '';
  roles.forEach(role => {
    const roleCard = document.createElement('div');
    roleCard.className = 'role-card border rounded p-4 mb-4';

    roleCard.innerHTML = `
      <h3 class="font-bold text-lg">${role.name} <span class="text-sm text-gray-500">(${role.status})</span></h3>
      <p>${role.description || ''}</p>
      <div class="mt-2">
        <button class="edit-role-btn bg-blue-500 text-white px-3 py-1 rounded mr-2" data-id="${role.id}">تعديل</button>
        <button class="delete-role-btn bg-red-500 text-white px-3 py-1 rounded" data-id="${role.id}">حذف</button>
      </div>
    `;

    rolesContainer.appendChild(roleCard);
  });

  // Attach event listeners for edit and delete buttons
  document.querySelectorAll('.edit-role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roleId = e.target.getAttribute('data-id');
      openEditRoleModal(roleId);
    });
  });

  document.querySelectorAll('.delete-role-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const roleId = e.target.getAttribute('data-id');
      if (confirm('هل أنت متأكد من حذف هذا الدور؟')) {
        try {
          const response = await fetch('/roles/' + roleId, { method: 'DELETE' });
          if (!response.ok) throw new Error('Failed to delete role');
          await loadRoles();
        } catch (error) {
          alert('خطأ في حذف الدور: ' + error.message);
        }
      }
    });
  });
}

async function loadRoles() {
  const roles = await fetchRoles();
  renderRoles(roles);
}

function openAddRoleModal() {
  const modal = document.getElementById('roleModal');
  modal.querySelector('h3').textContent = 'إضافة دور جديد';
  modal.querySelector('form').reset();
  modal.querySelector('form').dataset.mode = 'add';
  modal.classList.remove('hidden');
}

async function openEditRoleModal(roleId) {
  const modal = document.getElementById('roleModal');
  modal.querySelector('h3').textContent = 'تعديل الدور';
  modal.querySelector('form').dataset.mode = 'edit';
  modal.querySelector('form').dataset.roleId = roleId;

  try {
    const response = await fetch('/roles');
    if (!response.ok) throw new Error('Failed to fetch roles');
    const result = await response.json();
    if (!result.success) throw new Error('API returned failure');
    const role = result.data.find(r => r.id == roleId);
    if (!role) throw new Error('Role not found');

    modal.querySelector('#roleName').value = role.name;
    modal.querySelector('#roleDescription').value = role.description || '';
    modal.querySelector('#roleStatus').value = role.status;
    modal.classList.remove('hidden');
  } catch (error) {
    alert('خطأ في جلب بيانات الدور: ' + error.message);
  }
}

function closeRoleModal() {
  const modal = document.getElementById('roleModal');
  modal.classList.add('hidden');
  const form = modal.querySelector('form');
  form.reset();
  delete form.dataset.mode;
  delete form.dataset.roleId;
}

async function submitRoleForm(e) {
  e.preventDefault();
  const form = e.target;
  const mode = form.dataset.mode;
  const roleId = form.dataset.roleId;
  const data = {
    name: form.roleName.value.trim(),
    description: form.roleDescription.value.trim(),
    status: form.roleStatus.value
  };

  try {
    let response;
    if (mode === 'add') {
      response = await fetch('/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else if (mode === 'edit') {
      response = await fetch('/roles/' + roleId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to save role');
    }
    closeRoleModal();
    await loadRoles();
  } catch (error) {
    alert('خطأ في حفظ الدور: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/system/general-settings/roles') {
    loadRoles();

    document.getElementById('addRoleBtn').addEventListener('click', openAddRoleModal);
    document.getElementById('closeRoleModal').addEventListener('click', closeRoleModal);
    document.getElementById('cancelRoleBtn').addEventListener('click', closeRoleModal);
    document.getElementById('roleForm').addEventListener('submit', submitRoleForm);
  }
});

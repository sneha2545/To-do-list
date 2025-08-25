// app.js
window.onload = () => {
  const form1 = document.querySelector("#addForm");
  let items = document.getElementById("items");
  let submit = document.getElementById("submit");
  const itemInput = document.getElementById("item");
  let editItem = null;
  let filterBtns = document.querySelectorAll('.filter-btn');
  let clearCompletedBtn = document.getElementById('clear-completed');
  let taskCount = document.getElementById('task-count');
  let search = document.getElementById('search');

  form1.addEventListener("submit", addItem);
  items.addEventListener("click", itemAction);
  filterBtns.forEach(btn => btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterTasks(e);
  }));
  clearCompletedBtn.addEventListener('click', clearCompleted);
  search.addEventListener('input', applySearchFilter);
  // Enable/disable submit based on input content
  const toggleSubmitDisabled = () => { submit.disabled = itemInput.value.trim().length === 0; };
  itemInput.addEventListener('input', toggleSubmitDisabled);
  toggleSubmitDisabled();
  updateTaskCount();
  updateEmptyState();
};

function addItem(e) {
  e.preventDefault();
  const submit = document.getElementById('submit');
  const items = document.getElementById('items');

  if (submit.value != "Submit") {
    const li = document.querySelector('#items li.editing');
    if (li) {
      li.querySelector('span.text').textContent = document.getElementById("item").value;
      li.classList.remove('editing');
    }
    submit.value = "Submit";
    document.getElementById("item").value = "";
    showSuccess("Text edited successfully");
    updateTaskCount();
    updateEmptyState();
    return false;
  }
  let newItem = document.getElementById("item").value;
  let priority = document.getElementById('priority').value;
  let dueDate = document.getElementById('dueDate').value;
  if (newItem.trim() == "" || newItem.trim() == null) return false;
  else document.getElementById("item").value = "";

  let li = document.createElement("li");
  li.className = "list-group-item d-flex align-items-center";
  li.setAttribute('data-status', 'active');
  li.setAttribute('data-priority', priority);

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "mr-2 complete-check";
  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      li.classList.add('completed');
      li.setAttribute('data-status', 'completed');
    } else {
      li.classList.remove('completed');
      li.setAttribute('data-status', 'active');
    }
    updateTaskCount();
  });

  let span = document.createElement("span");
  span.className = "flex-grow-1 text";
  span.appendChild(document.createTextNode(newItem));

  const meta = document.createElement('div');
  meta.className = 'meta';
  const badge = document.createElement('span');
  badge.className = `priority-badge priority-${priority}`;
  badge.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
  meta.appendChild(badge);
  if (dueDate) {
    const due = document.createElement('span');
    due.className = 'due-date';
    due.textContent = `Due: ${dueDate}`;
    meta.appendChild(due);
  }

  let editButton = document.createElement("button");
  editButton.className = "btn btn-success btn-sm ml-2 edit";
  editButton.innerHTML = '<span title="Edit">✏️</span>';

  let deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger btn-sm ml-2 delete";
  deleteButton.innerHTML = '<span title="Delete">🗑️</span>';

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(meta);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  items.appendChild(li);
  updateTaskCount();
  updateEmptyState();
}

function itemAction(e) {
  e.preventDefault();
  let li = e.target.closest('li');
  if (!li) return;
  if (e.target.closest('.delete')) {
    if (confirm("Are you Sure?")) {
      li.classList.add('removing');
      setTimeout(() => {
        li.remove();
        showSuccess("Text deleted successfully");
        updateTaskCount();
        updateEmptyState();
      }, 220);
    }
  }
  if (e.target.closest('.edit')) {
    document.getElementById("item").value = li.querySelector('span.text').textContent;
    document.getElementById('submit').value = "EDIT";
    document.querySelectorAll('#items li').forEach(x => x.classList.remove('editing'));
    li.classList.add('editing');
  }
}

// Parallax disabled per user request (no hover-like animations)

function filterTasks(e) {
  let filter = e.target.getAttribute('data-filter');
  let items = document.querySelectorAll('#items li');
  items.forEach(li => {
    if (filter === 'all') li.style.display = '';
    else if (filter === 'active') li.style.display = li.getAttribute('data-status') === 'active' ? '' : 'none';
    else if (filter === 'completed') li.style.display = li.getAttribute('data-status') === 'completed' ? '' : 'none';
  });
}

function clearCompleted() {
  let items = document.querySelectorAll('#items li[data-status="completed"]');
  items.forEach(li => li.remove());
  updateTaskCount();
  updateEmptyState();
}

function applySearchFilter(e) {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('#items li').forEach(li => {
    const text = li.querySelector('span.text').textContent.toLowerCase();
    li.style.display = text.includes(term) ? '' : 'none';
  });
}

function updateTaskCount() {
  let items = document.querySelectorAll('#items li[data-status="active"]');
  let count = items.length;
  document.getElementById('task-count').textContent = `${count} task${count !== 1 ? 's' : ''} left`;
}

function updateEmptyState() {
  const list = document.getElementById('items');
  const empty = document.getElementById('empty-state');
  empty.style.display = list.children.length ? 'none' : 'block';
}

function showSuccess(msg) {
  let lbl = document.getElementById("lblsuccess");
  lbl.innerHTML = msg;
  lbl.style.display = "block";
  setTimeout(function() { lbl.style.display = "none"; }, 2000);
}

function toggleButton(ref, btnID) {
  const btn = document.getElementById(btnID);
  if (!btn) return;
  btn.disabled = ref.value.trim().length === 0;
}

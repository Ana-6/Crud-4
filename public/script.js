if (document.getElementById("btnLogin")) {
    document.getElementById("btnLogin").onclick = async () => {
      const email = inputEmail.value;
      const password = inputPassword.value;
  
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
      msg.textContent = data.message;
  
      if (res.ok) location.href = "list.html";
    };
  }

  if (document.getElementById("btnCreate")) {
    btnCreate.onclick = async () => {
      const name = regName.value;
      const email = regEmail.value;
      const password = regPassword.value;
  
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await res.json();
      msg.textContent = data.message;
  
      if (res.ok) location.href = "list.html";
    };
  }
  
  if (document.getElementById("tableUsers")) {
    fetch("/users")
      .then(r => r.json())
      .then(users => {
        const table = document.getElementById("tableUsers");
        table.innerHTML = `
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Acciones</th></tr>
        `;
  
        users.forEach(u => {
          const row = `
            <tr>
              <td>${u.id}</td>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td>
                <button onclick="edit(${u.id})">Editar</button>
                <button onclick="removeUser(${u.id})">Eliminar</button>
              </td>
            </tr>
          `;
          table.innerHTML += row;
        });
      });
  }
  
  function edit(id) {
    localStorage.setItem("editId", id);
    location.href = "edit.html";
  }
  
  function removeUser(id) {
    if (!confirm("¿Eliminar usuario?")) return;
  
    fetch(`/users/${id}`, { method: "DELETE" })
      .then(() => location.reload());
  }

  if (document.getElementById("btnUpdate")) {
    const id = localStorage.getItem("editId");
  
    fetch("/users")
      .then(r => r.json())
      .then(users => {
        const u = users.find(x => x.id == id);
        editName.value = u.name;
        editEmail.value = u.email;
        editPassword.value = u.password;
      });
  
    btnUpdate.onclick = async () => {
      const name = editName.value;
      const email = editEmail.value;
      const password = editPassword.value;
  
      const res = await fetch(`/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await res.json();
      msg.textContent = data.message;
  
      if (res.ok) location.href = "list.html";
    };
  }
  
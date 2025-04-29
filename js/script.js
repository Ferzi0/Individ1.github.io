function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('show');
}

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const authForm = document.getElementById("auth-form");

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users["admin"]) users["admin"] = "admin";
  if (!users["teacher"]) users["teacher"] = "teacher";
  localStorage.setItem("users", JSON.stringify(users));

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (users[username]) {
        alert("Пользователь уже существует!");
        return;
      }

      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Регистрация успешна!");
      window.location.href = "authorization.html"; 
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (users[username] && users[username] === password) {
        if (username === "admin") {
          window.location.href = "admin.html";
        } else if (username === "teacher") {
          window.location.href = "teacher.html";
        } else {
          window.location.href = "student.html";
        }
      } else {
        alert("Неверный логин или пароль!");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    let computers = JSON.parse(localStorage.getItem("computers")) || {};
  
    if (Object.keys(computers).length === 0) {
      computers = {
        "101": [
          { name: "ПК-1", status: "working", internet: true, reason: "" },
          { name: "ПК-2", status: "working", internet: true, reason: "" },
          { name: "ПК-3", status: "working", internet: true, reason: "" }
        ],
        "102": [
          { name: "ПК-1", status: "working", internet: true, reason: "" },
          { name: "ПК-2", status: "working", internet: true, reason: "" }
        ]
      };
      localStorage.setItem("computers", JSON.stringify(computers));
    }
  });
  
});


document.getElementById("status-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const fileInput = document.getElementById("file-upload");
  const comment = document.getElementById("comment").value;
  const time = new Date().toLocaleString();
  const tbody = document.getElementById("status-body");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${fileInput.files[0]?.name || '—'}</td>
    <td>${comment}</td>
    <td>${time}</td>
    <td><span class="status-label">На проверке</span></td>
    <td><i>Комментарий отсутствует</i></td>
  `;
  tbody.appendChild(row);

  this.reset();
});

function changeStatus(studentIndex) {
  const statusSelect = document.getElementById("status-select-" + studentIndex);
  const commentText = document.getElementById("comment-text-" + studentIndex).value;
  const statusLabel = document.querySelectorAll(".status-label")[studentIndex];
  const commentCell = document.querySelectorAll(".status-table td")[studentIndex * 5 + 4];

  statusLabel.textContent = statusSelect.value;

  commentCell.textContent = commentText;
}




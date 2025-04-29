document.addEventListener("DOMContentLoaded", () => {
  let audiences = JSON.parse(localStorage.getItem("audiences")) || [];
  let computers = JSON.parse(localStorage.getItem("computers")) || {};
  let users = JSON.parse(localStorage.getItem("users")) || {};
  let groups = JSON.parse(localStorage.getItem("groups")) || [];
  let schedule = JSON.parse(localStorage.getItem("schedule")) || [];

  const audienceList = document.getElementById("audience-list");
  const audienceSelect = document.getElementById("audience-select");
  const computerList = document.getElementById("computer-list");
  const userList = document.getElementById("user-list");
  const groupSelect = document.getElementById("groupSelect");
  const scheduleTableBody = document.querySelector("#schedule-table tbody");

  let adminAuditorySelect;
  let adminComputerTableContainer;

  function saveData() {
      localStorage.setItem("audiences", JSON.stringify(audiences));
      localStorage.setItem("computers", JSON.stringify(computers));
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("groups", JSON.stringify(groups));
      localStorage.setItem("schedule", JSON.stringify(schedule));
  }

  function renderAudiences() {
      audienceList.innerHTML = "";
      audienceSelect.innerHTML = "";
      audiences.forEach((aud) => {
          const li = document.createElement("li");
          li.textContent = `${aud} (Доступно компьютеров: ${countWorkingComputers(aud)})`;
          const delBtn = document.createElement("button");
          delBtn.textContent = "Удалить";
          delBtn.onclick = () => {
              audiences = audiences.filter(a => a !== aud);
              delete computers[aud];
              saveData();
              renderAudiences();
              renderComputers();
          };
          li.appendChild(delBtn);
          audienceList.appendChild(li);

          const option = document.createElement("option");
          option.value = aud;
          option.textContent = aud;
          audienceSelect.appendChild(option);
      });

      if (adminAuditorySelect) {
          adminAuditorySelect.innerHTML = "";
          audiences.forEach(aud => {
              const option = document.createElement("option");
              option.value = aud;
              option.textContent = `Аудитория ${aud}`;
              adminAuditorySelect.appendChild(option);
          });
      }
  }

  function renderComputers() {
    const computerTableBody = document.getElementById("computer-list");
    computerTableBody.innerHTML = ""; 

    for (const [audience, comps] of Object.entries(computers)) {
        comps.forEach((comp, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${audience}</td>
                <td>${comp.name}</td>
                <td>${comp.status === 'working' ? 'Рабочий' : `Не рабочий (${comp.reason || 'Без причины'})`}</td>
                <td>${comp.internet ? 'Включен' : 'Выключен'}</td>
                <td>
                    <button onclick="toggleComputerStatus('${audience}', ${index})">
                        ${comp.status === 'working' ? 'Поломка' : 'Рабочий'}
                    </button>
                    <button onclick="toggleInternet('${audience}', ${index})">
                        ${comp.internet ? 'Выкл. интернет' : 'Вкл. интернет'}
                    </button>
                    <button onclick="deleteComputer('${audience}', ${index})">
                        Удалить
                    </button>
                </td>
            `;

            computerTableBody.appendChild(tr);
        });
    }
}


  window.toggleStatus = function(room, index) {
      const comp = computers[room][index];
      if (comp.status === 'working') {
          const reason = prompt("Укажите причину поломки:");
          if (reason && reason.trim()) {
              comp.status = "broken";
              comp.reason = reason.trim();
          }
      } else {
          comp.status = "working";
          comp.reason = "";
      }
      saveData();
      renderComputers();
      renderAudiences();
  };

  window.toggleInternet = function(room, index) {
    const comp = computers[room][index];
    comp.internet = !comp.internet;
    saveData();
    renderComputers();
};

window.deleteComputer = function(room, index) {
    if (confirm("Вы уверены, что хотите удалить этот компьютер?")) {
        computers[room].splice(index, 1);
        saveData();
        renderComputers();
        renderAudiences();
    }
};

function renderUsers() {
    userList.innerHTML = "";
    for (const [username, passwordOrObj] of Object.entries(users)) {
        const data = typeof passwordOrObj === "object" ? passwordOrObj : { password: passwordOrObj, role: "student" };
        const li = document.createElement("li");
        li.textContent = `${username} (${data.role})`;

        if (username !== "admin") {
            const select = document.createElement("select");
            ["student", "teacher", "admin"].forEach(role => {
                const option = document.createElement("option");
                option.value = role;
                option.textContent = role;
                if (data.role === role) option.selected = true;
                select.appendChild(option);
            });

            select.onchange = () => {
                users[username].role = select.value;
                saveData();
                renderUsers();
            };
            li.appendChild(select);
        }
        userList.appendChild(li);
    }
}

function countWorkingComputers(audience) {
    if (!computers[audience]) return 0;
    return computers[audience].filter(comp => comp.status === 'working').length;
}

function renderGroups() {
    groupSelect.innerHTML = "";
    groups.forEach(group => {
        const option = document.createElement("option");
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
}

window.addGroup = function() {
    const name = document.getElementById("newGroupName").value.trim();
    if (name && !groups.includes(name)) {
        groups.push(name);
        saveData();
        renderGroups();
        document.getElementById("newGroupName").value = "";
    }
};

window.removeGroup = function() {
    const selectedGroup = groupSelect.value;
    if (selectedGroup) {
        groups = groups.filter(g => g !== selectedGroup);
        saveData();
        renderGroups();
    }
};

function renderSchedule() {
    scheduleTableBody.innerHTML = "";
    schedule.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.group}</td>
            <td>${entry.auditory}</td>
            <td>${entry.time}</td>
            <td>${entry.teacher}</td>
        `;
        scheduleTableBody.appendChild(row);
    });
}

document.getElementById("add-audience-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("audience-name").value.trim();
    if (name && !audiences.includes(name)) {
        audiences.push(name);
        computers[name] = [];
        saveData();
        renderAudiences();
        renderComputers();
    }
    e.target.reset();
});

document.getElementById("add-computer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const audience = document.getElementById("audience-select").value;
    const name = document.getElementById("computer-name").value.trim();
    if (audience && name) {
        computers[audience].push({ name, status: "working", internet: true });
        saveData();
        renderAudiences();
        renderComputers();
    }
    e.target.reset();
});

document.getElementById("add-schedule-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const group = document.getElementById("group").value.trim();
    const auditory = document.getElementById("auditory").value.trim();
    const time = document.getElementById("time").value;
    const username = localStorage.getItem("currentUser") || "teacher";

    if (!group || !auditory || !time) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    const newEntry = { group, auditory, time, teacher: username };
    schedule.push(newEntry);
    saveData();
    renderSchedule();
    e.target.reset();
    alert("Занятие успешно добавлено!");
});

window.showSection = function(sectionId) {
    document.querySelectorAll(".admin-section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";

    // При заходе в раздел "Компьютеры" - отрисовать таблицу
    if (sectionId === "computers") {
        renderAdminComputersUI();
    }
};

window.logout = function() {
    window.location.href = "index.html";
};

function renderAdminComputersUI() {
    if (!document.getElementById("admin-computer-ui")) {
        const container = document.createElement("div");
        container.id = "admin-computer-ui";

        const select = document.createElement("select");
        select.id = "admin-audience-select";
        select.onchange = renderComputers;
        container.appendChild(select);

        const tableDiv = document.createElement("div");
        tableDiv.id = "admin-computer-table";
        container.appendChild(tableDiv);

        computerList.appendChild(container);

        adminAuditorySelect = select;
        adminComputerTableContainer = tableDiv;

        renderAudiences();
        renderComputers();
    }
}

// Инициализация данных при загрузке
renderAudiences();
renderComputers();
renderUsers();
renderGroups();
renderSchedule();
});

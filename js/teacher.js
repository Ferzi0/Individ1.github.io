document.addEventListener("DOMContentLoaded", () => {
  let audiences = JSON.parse(localStorage.getItem("audiences")) || [];
  let computers = JSON.parse(localStorage.getItem("computers")) || {};
  let schedule = JSON.parse(localStorage.getItem("schedule")) || [];
  
  const audienceSelect = document.getElementById("audience-select");
  const scheduleList = document.getElementById("schedule-list");
  const auditorySelect = document.getElementById("auditorySelect");
  const computerTableContainer = document.getElementById("computerTableContainer");
  
  function saveSchedule() {
    localStorage.setItem("schedule", JSON.stringify(schedule));
  }
  
  function renderAudiences() {
    audienceSelect.innerHTML = "";
    audiences.forEach((aud) => {
      const option = document.createElement("option");
      option.value = aud;
      option.textContent = aud;
      audienceSelect.appendChild(option);
    });
  }
  
  function renderSchedule() {
    scheduleList.innerHTML = "";
    schedule.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.group} - ${item.audience} - ${item.date}`;
      scheduleList.appendChild(li);
    });
  }

  function populateAuditorySelect() {
    auditorySelect.innerHTML = "";
    for (let room in computers) {
      const option = document.createElement("option");
      option.value = room;
      option.textContent = `Аудитория ${room}`;
      auditorySelect.appendChild(option);
    }
    if (auditorySelect.options.length > 0) {
      auditorySelect.selectedIndex = 0;
      renderComputerTable(auditorySelect.value);
    }
  }
  
  function renderComputerTable(room) {
    const compList = computers[room];
    if (!compList) return;
    let html = `
      <table>
        <tr>
          <th>Компьютер</th>
          <th>Статус</th>
          <th>Интернет</th>
          <th>Причина (если есть)</th>
          <th>Действия</th>
        </tr>
    `;
    compList.forEach((comp, index) => {
      html += `
        <tr>
          <td>${comp.name}</td>
          <td>${comp.status === 'working' ? 'Рабочий' : 'Нерабочий'}</td>
          <td>${comp.internet ? 'Подключён' : 'Отключён'}</td>
          <td>${comp.reason || '-'}</td>
          <td>
            <button onclick="toggleStatus('${room}', ${index})">
              ${comp.status === 'working' ? 'Пометить нерабочим' : 'Сделать рабочим'}
            </button>
            <button onclick="toggleInternet('${room}', ${index})">
              ${comp.internet ? 'Отключить интернет' : 'Включить интернет'}
            </button>
          </td>
        </tr>
      `;
    });
    html += "</table>";
    computerTableContainer.innerHTML = html;
  }

  document.getElementById("assign-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const groupName = document.getElementById("group-name").value.trim();
    const audience = document.getElementById("audience-select").value;
    const date = document.getElementById("lesson-date").value;

    if (groupName && audience && date) {
      schedule.push({ group: groupName, audience, date });
      saveSchedule();
      renderSchedule();
    }

    document.getElementById("assign-form").reset();
  });
  
  auditorySelect.addEventListener('change', () => {
    renderComputerTable(auditorySelect.value);
  });

  window.toggleStatus = function(room, index) {
    const comp = computers[room][index];
    if (comp.status === 'working') {
      const reason = prompt('Укажите причину поломки:');
      if (reason && reason.trim()) {
        comp.status = 'broken';
        comp.reason = reason.trim();
      }
    } else {
      comp.status = 'working';
      comp.reason = '';
    }
    localStorage.setItem("computers", JSON.stringify(computers));
    renderComputerTable(room);
  }

  window.toggleInternet = function(room, index) {
    computers[room][index].internet = !computers[room][index].internet;
    localStorage.setItem("computers", JSON.stringify(computers));
    renderComputerTable(room);
  }

  window.showSection = function(sectionId) {
    document.querySelectorAll(".teacher-section").forEach(section => {
      section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
  };
  
  window.logout = function() {
    window.location.href = "index.html";
  };
  
  renderAudiences();
  renderSchedule();
  populateAuditorySelect();
});
document.getElementById("feedback-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const subject = document.getElementById("feedback-subject").value.trim();
  const message = document.getElementById("feedback-message").value.trim();
  const status = document.getElementById("feedback-status");

  if (!name || !email || !subject || !message) {
    status.style.color = "red";
    status.textContent = "Пожалуйста, заполните все поля.";
    return;
  }

  // Можешь здесь сохранить в localStorage, отправить на сервер, и т.п.
  console.log("Обратная связь отправлена:", { name, email, subject, message });

  status.style.color = "green";
  status.textContent = "Спасибо! Ваше сообщение отправлено.";
  document.getElementById("feedback-form").reset();
});


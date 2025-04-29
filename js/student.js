document.addEventListener("DOMContentLoaded", () => {
  let schedule = JSON.parse(localStorage.getItem("schedule")) || [];

  const groupForm = document.getElementById("group-form");
  const groupSchedule = document.getElementById("group-schedule");
  const scheduleTableBody = document.querySelector("#student-schedule-table tbody");

  // Функция для отображения расписания по группе
  function renderScheduleByGroup(groupName) {
      groupSchedule.innerHTML = "";
      const groupLessons = schedule.filter(item => item.group.toLowerCase() === groupName.toLowerCase());

      if (groupLessons.length === 0) {
          groupSchedule.innerHTML = "<li>Расписание не найдено для данной группы.</li>";
      } else {
          groupLessons.forEach(item => {
              const li = document.createElement("li");
              li.textContent = `${item.date} - Аудитория: ${item.auditory} - Время: ${item.time} - Преподаватель: ${item.teacher}`;
              groupSchedule.appendChild(li);
          });
      }
  }

  // Функция для отображения всего расписания (не зависимо от группы)
  function renderFullSchedule() {
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

  // Вызываем функцию для отображения всего расписания по умолчанию
  renderFullSchedule();

  // Событие на отправку формы с группой
  groupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const groupName = document.getElementById("group-name").value.trim();
      if (groupName) {
          renderScheduleByGroup(groupName); // Отображаем расписание для конкретной группы
      }
  });

  // Инициализация отображения секции расписания
  document.getElementById("schedule").style.display = "block";

  // Функция для переключения между секциями
  window.showSection = function (sectionId) {
      document.querySelectorAll(".student-section").forEach(section => {
          section.style.display = "none";
      });
      document.getElementById(sectionId).style.display = "block";
  };
});
window.logout = function () {
  window.location.href = "index.html";
};
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


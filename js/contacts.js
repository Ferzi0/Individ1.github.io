document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    const successMessage = document.getElementById("feedback-success");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // В реальной системе тут отправка на сервер, а у нас просто показ сообщения
      form.reset();
      successMessage.style.display = "block";
  
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 3000);
    });
  });
  
"use strict";

document.todo = {
  tasks: [],
  term: "",

  init: function () {
    this.container=document.getElementById("tasksContainer");
    this.searchInput=document.getElementById("searchInput");
    this.textInput=document.getElementById("taskText");
    this.dateInput=document.getElementById("taskDate");

    this.load();

    this.searchInput.oninput=(e) => {
      this.term=e.target.value;
      this.draw();
    };

    this.draw();
  },

  save: function () {
    localStorage.setItem("todo_tasks", JSON.stringify(this.tasks));
  },

  load: function () {
    let data=localStorage.getItem("todo_tasks");
    if (data) {
      this.tasks=JSON.parse(data);
    }
  },

  validate: function (text,date) {
    if (text.length < 3 || text.length > 255) {
      alert("Zadanie musi mieć od 3 do 255 znaków.");
      return false;
    }

    if (date!=="") {
      let taskDate=new Date(date);
      let now=new Date();
      now.setHours(0, 0, 0, 0);

      if (taskDate<=now) {
        alert("Data musi być w przyszłości.");
        return false;
      }
    }

    return true;
  },

  add: function (text, date) {
    let trimmed=text.trim();
    if (!this.validate(trimmed, date)) {
      return;
    }

    this.tasks.push({
      text: trimmed,
      date: date
    });

    this.textInput.value="";
    this.dateInput.value="";

    this.save();
    this.draw();
  },

  delete: function (index) {
    this.tasks.splice(index,1);
    this.save();
    this.draw();
  },

  edit: function (index,newText,newDate) {
    let trimmed=newText.trim();
    if (!this.validate(trimmed,newDate)) {
      this.draw();
      return;
    }

    this.tasks[index].text=trimmed;
    this.tasks[index].date=newDate;

    this.save();
    this.draw();
  },

  draw: function () {
    this.container.innerHTML="";

    let searchPhrase=this.term.trim().toLowerCase();
    let filterActive=searchPhrase.length >= 2;

    for (let i=0; i < this.tasks.length; i++) {
      let task=this.tasks[i];

      if (filterActive && !task.text.toLowerCase().includes(searchPhrase)) {
        continue;
      }

      let row=document.createElement("div");
      row.className="taskItem";

      let content=document.createElement("div");
      content.className="taskContent";

      let textToShow=task.text;
      if (filterActive) {
        let reg=new RegExp(`(${this.term.trim()})`,"gi");
        textToShow=task.text.replace(reg, '<mark class="highlight">$1</mark>');
      }

      content.innerHTML=`<span>${textToShow}</span><span class="taskDate">${task.date}</span>`;

      content.onclick=() => {
        row.innerHTML="";

        let editInput=document.createElement("input");
        editInput.type="text";
        editInput.value=task.text;

        let editDate=document.createElement("input");
        editDate.type="date";
        editDate.value=task.date;

        row.appendChild(editInput);
        row.appendChild(editDate);
        editInput.focus();

        let saved=false;
        let finishEdit=() => {
          if (saved) return;
          saved=true;
          let currentIndex=this.tasks.indexOf(task);
          this.edit(currentIndex,editInput.value,editDate.value);
        };

        editInput.onblur = (e) => {
          if (!row.contains(e.relatedTarget)) finishEdit();
        };
        editDate.onblur = (e) => {
          if (!row.contains(e.relatedTarget)) finishEdit();
        };

        editInput.onkeydown=(e) => {
          if (e.key==="Enter") finishEdit();
        };
        editDate.onkeydown=(e) => {
          if (e.key==="Enter") finishEdit();
        };
      };

      let delBtn = document.createElement("button");
      delBtn.className="deleteBtn";
      delBtn.innerHTML="&#128465;";
      delBtn.onclick=(e) => {
        e.stopPropagation();
        let currentIndex=this.tasks.indexOf(task);
        this.delete(currentIndex);
      };

      row.appendChild(content);
      row.appendChild(delBtn);
      this.container.appendChild(row);
    }
  }
};
  document.todo.init();

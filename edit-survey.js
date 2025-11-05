import { db, ref, set } from './firebase.js';

const container = document.getElementById("questionContainer");

// Initial questions
const initialQuestions = [
  { id: "ageGroup", label: "Age Group", type: "select", options: ["Below 30", "30–50", "Above 50"] },
  { id: "goal", label: "Investment Goal", type: "text" },
  { id: "type", label: "Preferred Investment Type", type: "textarea" }
];

// Render all questions
function renderQuestions() {
  container.innerHTML = "";
  initialQuestions.forEach((q, index) => {
    const block = document.createElement("div");
    block.className = "question-block";
    block.setAttribute("draggable", "true");
    block.dataset.id = q.id;

    const label = document.createElement("label");
    label.setAttribute("for", q.id);
    label.textContent = q.label;
    block.appendChild(label);

    let input;
    if (q.type === "text") {
      input = document.createElement("input");
      input.type = "text";
    } else if (q.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 3;
    } else if (q.type === "select") {
      input = document.createElement("select");
      q.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
    }

    input.id = q.id;
    input.name = q.id;
    block.appendChild(input);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editQuestion(q.id);
    block.appendChild(editBtn);

    container.appendChild(block);
  });
}

// Drag-and-drop reordering
let dragged;
container.addEventListener("dragstart", e => {
  dragged = e.target;
});
container.addEventListener("dragover", e => {
  e.preventDefault();
});
container.addEventListener("drop", e => {
  e.preventDefault();
  if (e.target.classList.contains("question-block")) {
    container.insertBefore(dragged, e.target.nextSibling);
    reorderQuestions();
  }
});

function reorderQuestions() {
  const blocks = container.querySelectorAll(".question-block");
  initialQuestions.length = 0;
  blocks.forEach((block, index) => {
    const id = block.dataset.id;
    const label = block.querySelector("label").textContent;
    const input = block.querySelector("input, textarea, select");
    const type = input.tagName.toLowerCase() === "select" ? "select" : input.tagName.toLowerCase();
    const options = type === "select" ? Array.from(input.options).map(o => o.value) : undefined;
    initialQuestions.push({ id, label, type, options, sequence: index + 1 });
  });
}

// Edit question
window.editQuestion = function (id) {
  const block = container.querySelector(`[data-id="${id}"]`);
  const label = block.querySelector("label");
  const input = block.querySelector("input, textarea, select");

  const newLabel = prompt("Edit question label:", label.textContent);
  if (newLabel) label.textContent = newLabel;

  if (input.tagName === "SELECT") {
    const newOptions = prompt("Edit options (comma-separated):", Array.from(input.options).map(o => o.value).join(", "));
    if (newOptions) {
      input.innerHTML = "";
      newOptions.split(",").forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.trim();
        option.textContent = opt.trim();
        input.appendChild(option);
      });
    }
  } else {
    const newPlaceholder = prompt("Edit placeholder:", input.placeholder || "");
    if (newPlaceholder) input.placeholder = newPlaceholder;
  }
};

// Show modal
window.showAddQuestionModal = function () {
  document.getElementById("addModal").classList.remove("hidden");
};

// Close modal
window.closeAddQuestionModal = function () {
  document.getElementById("addModal").classList.add("hidden");
  document.getElementById("newLabel").value = "";
  document.getElementById("newOptions").value = "";
  document.getElementById("newOptions").classList.add("hidden");
  document.getElementById("optionsLabel").classList.add("hidden");
};

// Toggle options input
document.getElementById("newType").addEventListener("change", function () {
  const isSelect = this.value === "select";
  document.getElementById("newOptions").classList.toggle("hidden", !isSelect);
  document.getElementById("optionsLabel").classList.toggle("hidden", !isSelect);
});

// Add new question
window.addNewQuestion = function () {
  const labelText = document.getElementById("newLabel").value.trim();
  const type = document.getElementById("newType").value;
  const options = document.getElementById("newOptions").value.trim();

  if (!labelText) return alert("Please enter a question label.");

  const id = "field_" + Date.now();
  const newQuestion = { id, label: labelText, type };

  if (type === "select") {
    newQuestion.options = options.split(",").map(opt => opt.trim());
  }

  initialQuestions.push(newQuestion);
  renderQuestions();
  closeAddQuestionModal();
};

// Submit updated form to Firebase
document.getElementById("surveyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  reorderQuestions(); // ensure sequence numbers are fresh

  const emailKey = new URLSearchParams(window.location.search).get("email");
  if (!emailKey) return alert("Missing email identifier in URL.");

  const formRef = ref(db, 'surveyForms/' + emailKey);
  await set(formRef, initialQuestions);

  alert("Survey form updated and saved to Firebase!");
});

renderQuestions();

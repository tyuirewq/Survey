import { db, ref, get } from './firebase.js';

async function loadSurveyResponses() {
  const container = document.getElementById('responseContainer');
  container.innerHTML = "<p>Loading responses...</p>";

  try {
    const snapshot = await get(ref(db, 'responses'));
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No responses found.</p>";
      return;
    }

    const data = snapshot.val();
    container.innerHTML = "";

    for (const emailKey in data) {
      const responses = data[emailKey];
      const email = Object.values(responses)[0]?.email || emailKey;

      const section = document.createElement('div');
      section.className = "emailBlock";
      section.innerHTML = `<h3>${email}</h3>`;

      for (const responseId in responses) {
        const r = responses[responseId];
        const card = document.createElement('div');
        card.className = "responseCard";
        card.innerHTML = `
          <p><strong>Age Group:</strong> ${r.ageGroup}</p>
          <p><strong>Goal:</strong> ${r.goal}</p>
          <p><strong>Type:</strong> ${r.type}</p>
          <p><strong>Submitted:</strong> ${new Date(r.submittedAt).toLocaleString()}</p>
        `;
        section.appendChild(card);
      }

      const editBtn = document.createElement('button');
      editBtn.textContent = "✏️ Edit Survey Form";
      editBtn.onclick = () => {
        window.location.href = `edit-survey.html?email=${emailKey}`;
      };
      section.appendChild(editBtn);

      container.appendChild(section);
    }
  } catch (error) {
    container.innerHTML = `<p>Error loading responses: ${error.message}</p>`;
  }
}

loadSurveyResponses();

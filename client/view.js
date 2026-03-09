const API = "http://localhost:3000/api";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// 🔹 MASTER TIME SLOTS (ALWAYS SHOWN)
const ALL_TIME_SLOTS = [
  "07:15 - 08:15",
  "08:15 - 09:15",
  "09:15 - 09:40",
  "09:40 - 10:40",
  "10:40 - 11:40",
  "11:40 - 12:40"
];

async function loadTimetable() {
  const classId = document.getElementById("classSelect").value;
  const res = await fetch(`${API}/timetable/${classId}`);
  const data = await res.json();

  const tbody = document.querySelector("#timetable tbody");
  tbody.innerHTML = "";

  const timeMap = {};

  // 🔹 USE MASTER TIME SLOTS
  const times = [...ALL_TIME_SLOTS];

  // ---------- GROUP DATA ----------
  data.forEach(row => {
    if (!timeMap[row.time]) {
      timeMap[row.time] = {};
    }

    if (!timeMap[row.time][row.day]) {
      timeMap[row.time][row.day] = [];
    }

    if (row.entry_type) {
      timeMap[row.time][row.day].push(row);
    }
  });

  const skip = {};
  days.forEach(d => skip[d] = {});

  // ---------- BUILD TABLE ----------
  times.forEach((time, timeIndex) => {
    const tr = document.createElement("tr");

    // TIME COLUMN
    const tdTime = document.createElement("td");
    tdTime.textContent = time;
    tr.appendChild(tdTime);

    days.forEach(day => {
      if (skip[day][time]) return;

      const td = document.createElement("td");
      const entries = timeMap[time]?.[day] || [];

      if (entries.length === 0) {
        td.textContent = "-";
      } else {

        const practicals = entries.filter(e => e.entry_type === "PRACTICAL");
        const lectures = entries.filter(e => e.entry_type === "LECTURE");
        const breaks = entries.filter(e => e.entry_type === "BREAK");

        // ---------- BREAK ----------
        if (breaks.length > 0) {
          td.textContent = "BREAK";
          td.classList.add("break");
        }

        // ---------- PRACTICAL (2 HRS MERGE) ----------
        else if (practicals.length > 0) {
          td.rowSpan = 2;

          const nextTime = times[timeIndex + 1];
          if (nextTime) skip[day][nextTime] = true;

          td.innerHTML = practicals.map(p => `
            <div style="padding:6px;">
              <b>${p.subject_name} (PR)</b><br>
              ${p.teacher_name}<br>
              <span>Lab: ${p.lab_name || "-"}</span><br>
              ${p.batch ? "Batch " + p.batch : ""}
            </div>
          `).join("");
        }

        // ---------- LECTURE ----------
        else if (lectures.length > 0) {
          td.innerHTML = lectures.map(l => `
            <div style="padding:6px;">
              <b>${l.subject_name}</b><br>
              ${l.teacher_name}<br>
              <span>Room: ${l.room_name || "-"}</span>
            </div>
          `).join("");
        }
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}
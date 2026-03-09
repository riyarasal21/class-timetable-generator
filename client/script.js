const API = "http://localhost:3000/api";

/* ================= LOAD DROPDOWNS ================= */

document.addEventListener("DOMContentLoaded", () => {
  load("/classes", "class_id", "class_id", "class_name");
  load("/subjects", "subject_id", "subject_id", "subject_name");
  load("/teachers", "teacher_id", "teacher_id", "teacher_name");
  load("/rooms", "room_id", "room_id", "room_name");
  load("/labs", "lab_id", "lab_id", "lab_name");
  load("/timeslots", "time_slot_id", "time_slot_id", "time");
});

function load(endpoint, elementId, valueField, textField) {
  fetch(API + endpoint)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById(elementId);
      select.innerHTML = `<option value="">Select</option>`;
      data.forEach(item => {
        select.innerHTML += `
          <option value="${item[valueField]}">
            ${item[textField]}
          </option>`;
      });
    })
    .catch(err => console.error("Dropdown load error:", err));
}

/* ================= ENABLE / DISABLE FIELDS ================= */

document.getElementById("entry_type").addEventListener("change", function () {
  const isLecture = this.value === "LECTURE";
  const isPractical = this.value === "PRACTICAL";

  document.getElementById("room_id").disabled = !isLecture;
  document.getElementById("lab_id").disabled = !isPractical;
  document.getElementById("batch").disabled = !isPractical;
});

/* ================= SAVE TIMETABLE ================= */

document.getElementById("timetableForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const payload = {
    class_id: class_id.value || null,
    day: day.value || null,
    time_slot_id: time_slot_id.value || null,
    subject_id: subject_id.value || null,
    teacher_id: teacher_id.value || null,
    room_id: room_id.value || null,
    lab_id: lab_id.value || null,
    batch: batch.value || null,
    entry_type: entry_type.value || null
  };

  try {
    const res = await fetch(API + "/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    /* ✅ SUCCESS */
    if (res.ok) {
      alert("✅ Timetable entry saved successfully.");
      document.getElementById("timetableForm").reset();
      return;
    }

    /* ❌ BUSINESS RULE ERRORS (CUSTOM MESSAGES FROM BACKEND) */
    if (result?.message) {
      alert("❌ " + result.message);
      return;
    }

    /* ❌ FALLBACK */
    alert("❌ Failed to save timetable. Please check inputs.");

  } catch (err) {
    alert("❌ Server not reachable. Please try again later.");
    console.error("Network error:", err);
  }
});



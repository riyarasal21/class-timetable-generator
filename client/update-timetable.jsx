import React, { useEffect, useState } from "react";
import axios from "axios";

const container = {
  padding: "25px",
  fontFamily: "Arial, sans-serif",
  maxWidth: "900px",
  margin: "auto"
};

const box = {
  border: "1px solid #ccc",
  padding: "15px",
  borderRadius: "8px",
  backgroundColor: "#f8f9fa",
  marginBottom: "15px"
};

const row = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "10px",
  alignItems: "center"
};

const inputStyle = {
  padding: "7px",
  borderRadius: "5px",
  border: "1px solid #aaa",
  minWidth: "180px"
};

const btnPrimary = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  cursor: "pointer"
};

const btnSuccess = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#28a745",
  color: "white",
  cursor: "pointer"
};

const UpdateTimetable = () => {
  const [classes, setClasses] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [labs, setLabs] = useState([]);

  const [classId, setClassId] = useState("");
  const [day, setDay] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");

  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [labId, setLabId] = useState("");
  const [batch, setBatch] = useState("");

  const [showEditBox, setShowEditBox] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/classes").then(res => setClasses(res.data));
    axios.get("http://localhost:3000/api/timeslots").then(res => setTimeslots(res.data));
    axios.get("http://localhost:3000/api/subjects").then(res => setSubjects(res.data));
    axios.get("http://localhost:3000/api/teachers").then(res => setTeachers(res.data));
    axios.get("http://localhost:3000/api/rooms").then(res => setRooms(res.data));
    axios.get("http://localhost:3000/api/labs").then(res => setLabs(res.data));
  }, []);

  const handleLoadDetails = async () => {
    if (!classId || !day || !timeSlotId) {
      setMessage("⚠️ Please select Class, Day and Time first.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/timetable/single?class_id=${classId}&day=${day}&time_slot_id=${timeSlotId}`
      );

      const data = res.data;

      setSubjectId(data.subject_id || "");
      setTeacherId(data.teacher_id || "");
      setRoomId(data.room_id || "");
      setLabId(data.lab_id || "");
      setBatch(data.batch || "");

      setShowEditBox(true);
      setMessage("✅ Data loaded. You can now edit.");
    } 
    catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage("❌ No timetable exists for this slot.");
      } else {
        setMessage("❌ Error loading timetable.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:3000/api/timetable", {
        class_id: classId,
        day: day,
        time_slot_id: timeSlotId,
        subject_id: subjectId || null,
        teacher_id: teacherId || null,
        room_id: roomId || null,
        lab_id: labId || null,
        batch: batch || null
      });

      setMessage("✅ " + res.data.message);
    } 
    catch (error) {
      setMessage("❌ Update failed. Try again.");
    }
  };

  return (
    <div style={container}>
      <h2>📅 Update Timetable</h2>

      <div style={box}>
        <h3>Step 1 — Select Existing Entry</h3>

        <div style={row}>
          <select style={inputStyle} value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.class_id} value={c.class_id}>{c.class_name}</option>
            ))}
          </select>

          <select style={inputStyle} value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>

          <select style={inputStyle} value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value)}>
            <option value="">Select Time Slot</option>
            {timeslots.map(t => (
              <option key={t.time_slot_id} value={t.time_slot_id}>{t.time}</option>
            ))}
          </select>

          <button style={btnPrimary} onClick={handleLoadDetails}>Load Timetable</button>
        </div>
      </div>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      {showEditBox && (
        <div style={box}>
          <h3>Step 2 — Edit Details</h3>

          <div style={row}>
            <select style={inputStyle} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
              ))}
            </select>

            <select style={inputStyle} value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t.teacher_id} value={t.teacher_id}>{t.teacher_name}</option>
              ))}
            </select>

            <select style={inputStyle} value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              <option value="">Select Room (Optional)</option>
              {rooms.map(r => (
                <option key={r.room_id} value={r.room_id}>{r.room_name}</option>
              ))}
            </select>

            <select style={inputStyle} value={labId} onChange={(e) => setLabId(e.target.value)}>
              <option value="">Select Lab (Optional)</option>
              {labs.map(l => (
                <option key={l.lab_id} value={l.lab_id}>{l.lab_name}</option>
              ))}
            </select>

            <select style={inputStyle} value={batch} onChange={(e) => setBatch(e.target.value)}>
              <option value="">Select Batch (Optional)</option>
              <option value="A">Batch A</option>
              <option value="B">Batch B</option>
            </select>
          </div>

          <button style={btnSuccess} onClick={handleUpdate}>Update Timetable</button>
        </div>
      )}
    </div>
  );
};

export default UpdateTimetable;

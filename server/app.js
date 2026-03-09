const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DROPDOWN APIs ================= */

app.get("/api/classes", (req, res) => {
  db.query("SELECT * FROM classes ORDER BY class_id", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/subjects", (req, res) => {
  db.query("SELECT * FROM subjects ORDER BY subject_name", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/teachers", (req, res) => {
  db.query("SELECT * FROM teachers ORDER BY teacher_name", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/rooms", (req, res) => {
  db.query("SELECT * FROM rooms ORDER BY room_name", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/api/labs", (req, res) => {
  db.query("SELECT * FROM labs ORDER BY lab_name", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= TIME SLOTS ================= */

app.get("/api/timeslots", (req, res) => {
  const sql = `
    SELECT 
      time_slot_id,
      CONCAT(
        TIME_FORMAT(start_time,'%H:%i'),
        ' - ',
        TIME_FORMAT(end_time,'%H:%i')
      ) AS time
    FROM time_slots
    ORDER BY slot_order
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ================= ADD TIMETABLE ================= */

app.post("/api/timetable", (req, res) => {
  const {
    class_id,
    day,
    time_slot_id,
    subject_id,
    teacher_id,
    room_id,
    lab_id,
    batch,
    entry_type
  } = req.body;

  // 🔎 Step 1: Check existing entries in same slot
  const checkSql = `
    SELECT * FROM timetable
    WHERE class_id = ?
      AND day = ?
      AND time_slot_id = ?
  `;

  db.query(checkSql, [class_id, day, time_slot_id], (err, existing) => {
    if (err) {
      console.error("CHECK ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }

    /* ================= RULES ================= */

    // 🔴 RULE 1: If adding LECTURE
    if (entry_type === "LECTURE") {
      if (existing.length > 0) {
        return res.status(400).json({
          message: "This class already has an entry in this time slot"
        });
      }
    }

    // 🔴 RULE 2: If adding BREAK
    if (entry_type === "BREAK") {
      if (existing.length > 0) {
        return res.status(400).json({
          message: "Cannot add break. Slot already occupied"
        });
      }
    }

    // 🔴 RULE 3: If adding PRACTICAL
    if (entry_type === "PRACTICAL") {

      // ❌ If lecture or break already exists
      const hasLectureOrBreak = existing.some(
        e => e.entry_type === "LECTURE" || e.entry_type === "BREAK"
      );

      if (hasLectureOrBreak) {
        return res.status(400).json({
          message: "Cannot add practical. Lecture or break already exists"
        });
      }

      // Count existing practicals
      const practicals = existing.filter(
        e => e.entry_type === "PRACTICAL"
      );

      // ❌ More than 2 practicals not allowed
      if (practicals.length >= 2) {
        return res.status(400).json({
          message: "Only 2 practical batches allowed in one slot"
        });
      }

      // ❌ Same batch not allowed
      const sameBatch = practicals.some(
        e => e.batch === batch
      );

      if (sameBatch) {
        return res.status(400).json({
          message: "This batch already has a practical in this slot"
        });
      }
    }



    /* ================= INSERT IF VALID ================= */

    const insertSql = `
      INSERT INTO timetable
      (class_id, day, time_slot_id, subject_id, teacher_id, room_id, lab_id, batch, entry_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        class_id,
        day,
        time_slot_id,
        subject_id,
        teacher_id,
        room_id,
        lab_id,
        batch,
        entry_type
      ],
      (err) => {
        if (err) {
          console.error("INSERT ERROR:", err);
          return res.status(500).json({ message: "Insert failed" });
        }

        res.json({ message: "Timetable added successfully" });
      }
    );
  });
});

/* ================= LOAD TIMETABLE (DELETE PAGE) ================= */

app.get("/api/timetable/:class_id/:day/:time_slot_id", (req, res) => {
  const { class_id, day, time_slot_id } = req.params;

  const sql = `
    SELECT 
      t.timetable_id,
      t.entry_type,
      s.subject_name,
      te.teacher_name,
      r.room_name,
      l.lab_name
    FROM timetable t
    LEFT JOIN subjects s ON t.subject_id = s.subject_id
    LEFT JOIN teachers te ON t.teacher_id = te.teacher_id
    LEFT JOIN rooms r ON t.room_id = r.room_id
    LEFT JOIN labs l ON t.lab_id = l.lab_id
    WHERE t.class_id = ?
      AND t.day = ?
      AND t.time_slot_id = ?
  `;

  db.query(sql, [class_id, day, time_slot_id], (err, result) => {
    if (err) {
      console.error("LOAD ERROR:", err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});

/* ================= VIEW SINGLE TIMETABLE ================= */

app.get("/api/view/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      t.timetable_id,
      c.class_name,
      s.subject_name,
      te.teacher_name,
      r.room_name,
      l.lab_name,
      CONCAT(
        TIME_FORMAT(ts.start_time,'%H:%i'),
        ' - ',
        TIME_FORMAT(ts.end_time,'%H:%i')
      ) AS time_slot
    FROM timetable t
    JOIN classes c ON t.class_id = c.class_id
    JOIN subjects s ON t.subject_id = s.subject_id
    JOIN teachers te ON t.teacher_id = te.teacher_id
    LEFT JOIN rooms r ON t.room_id = r.room_id
    LEFT JOIN labs l ON t.lab_id = l.lab_id
    JOIN time_slots ts ON t.time_slot_id = ts.time_slot_id
    WHERE t.timetable_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("VIEW ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});


/* ================= STUDENT LOGIN ================= */

app.post("/api/student/login", (req, res) => {
  const { roll_no, password } = req.body;

  const sql = "SELECT * FROM students WHERE roll_no = ? AND password = ?";

  db.query(sql, [roll_no, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.json({ message: "Invalid Roll No or Password" });
    }

    res.json({
      student_name: result[0].student_name,
      class_id: result[0].class_id
    });
  });
});


/* ================= UPDATE TIMETABLE ================= */

app.put("/api/timetable/:id", (req, res) => {
  const id = req.params.id;

  const {
    subject_id,
    teacher_id,
    room_id,
    lab_id,
    batch,
    entry_type
  } = req.body;

  const sql = `
    UPDATE timetable
    SET subject_id = ?,
        teacher_id = ?,
        room_id = ?,
        lab_id = ?,
        batch = ?,
        entry_type = ?
    WHERE timetable_id = ?
  `;

  db.query(
    sql,
    [
      subject_id,
      teacher_id,
      room_id,
      lab_id,
      batch,
      entry_type,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("UPDATE ERROR:", err);
        return res.status(500).json({ message: "Update failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No record found" });
      }

      res.json({ message: "Timetable updated successfully" });
    }
  );
});



/* ================= DELETE TIMETABLE ================= */

app.delete("/api/timetable/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM timetable WHERE timetable_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("DELETE ERROR:", err);
        return res.status(500).json({ message: "Delete failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "No record found" });
      }

      res.json({ message: "Timetable deleted successfully" });
    }
  );
});



/* ================= VIEW FULL TIMETABLE ================= */

app.get("/api/timetable/:class_id", (req, res) => {
  const class_id = req.params.class_id;

  const sql = `
    SELECT
      t.day,
      t.entry_type,
      t.batch,
      s.subject_name,
      te.teacher_name,
      r.room_name,
      l.lab_name,
      CONCAT(
        TIME_FORMAT(ts.start_time,'%H:%i'),
        ' - ',
        TIME_FORMAT(ts.end_time,'%H:%i')
      ) AS time
    FROM timetable t
    JOIN time_slots ts ON t.time_slot_id = ts.time_slot_id
    LEFT JOIN subjects s ON t.subject_id = s.subject_id
    LEFT JOIN teachers te ON t.teacher_id = te.teacher_id
    LEFT JOIN rooms r ON t.room_id = r.room_id
    LEFT JOIN labs l ON t.lab_id = l.lab_id
    WHERE t.class_id = ?
    ORDER BY ts.slot_order
  `;

  db.query(sql, [class_id], (err, result) => {
    if (err) {
      console.error("TIMETABLE VIEW ERROR:", err);
      return res.status(500).json([]);
    }
    res.json(result);
  });
});




/* ================= SERVER ================= */

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});

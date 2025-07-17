const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/save", (req, res) => {
  const { name, id, batch, section, dept, courses, finalCGPA, finalGrade } = req.body;

  const content = `
Student Name: ${name}
Student ID: ${id}
Batch: ${batch}
Section: ${section}
Department: ${dept}

Courses:
${courses.map((c, i) => `${i + 1}. ${c.name} - CG: ${c.cg.toFixed(2)}, Grade: ${getLetterGrade(c.cg)}`).join("\n")}

Final CGPA: ${finalCGPA}
Final Grade: ${finalGrade}

Complement: You did great! 🎉 - From Team Swordfish
--------------------------
`;

  const fileName = `students/${id}_${name.replace(/\s+/g, "_")}.txt`;

  if (!fs.existsSync("students")) fs.mkdirSync("students");

  fs.writeFile(fileName, content, err => {
    if (err) return res.status(500).send("Error saving file.");
    res.send("Student data saved successfully.");
  });
});

function getLetterGrade(cg) {
  if (cg >= 4.0) return "A+";
  if (cg >= 3.75) return "A";
  if (cg >= 3.5) return "A-";
  if (cg >= 3.25) return "B+";
  if (cg >= 3.0) return "B";
  if (cg >= 2.75) return "B-";
  if (cg >= 2.5) return "C+";
  if (cg >= 2.25) return "C";
  if (cg >= 2.0) return "D";
  return "F";
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

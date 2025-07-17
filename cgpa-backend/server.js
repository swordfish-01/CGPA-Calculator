const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Utility function: CGPA → Letter Grade
function getLetterGrade(cgpa) {
  if (cgpa >= 4.0) return "A+";
  if (cgpa >= 3.75) return "A";
  if (cgpa >= 3.5) return "A-";
  if (cgpa >= 3.25) return "B+";
  if (cgpa >= 3.0) return "B";
  if (cgpa >= 2.75) return "B-";
  if (cgpa >= 2.5) return "C+";
  if (cgpa >= 2.25) return "C";
  if (cgpa >= 2.0) return "D";
  return "F";
}

// POST route to save student data
app.post("/save", (req, res) => {
  const { name, id, batch, section, dept, courses, finalCGPA, finalGrade } = req.body;

  if (!name || !id || !courses || !finalCGPA || !finalGrade) {
    return res.status(400).send("Missing required fields.");
  }

  // File content
  const content = `
 Student Details
--------------------------
Name     : ${name}
ID       : ${id}
Batch    : ${batch}
Section  : ${section}
Dept     : ${dept}

 Course-wise Results
--------------------------
${courses.map((c, i) => `${i + 1}. ${c.name} - CG: ${c.cg.toFixed(2)} | Grade: ${getLetterGrade(c.cg)}`).join("\n")}

 Final Result
--------------------------
CGPA     : ${finalCGPA}
Grade    : ${finalGrade}

 Compliments from Team Swordfish!
==========================
`;

  // Ensure folder exists
  const folder = "students";
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  // Save as text file
  const filename = `${folder}/${id}_${name.replace(/\s+/g, "_")}.txt`;

  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error(" Error saving file:", err);
      return res.status(500).send("Server error saving data.");
    }

    console.log(` Saved data for ${name} (${id})`);
    res.send("Student data saved successfully.");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

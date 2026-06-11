import ATSScore from "./components/ATSScore";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [atsScore, setAtsScore] = useState(0);
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [strength, setStrength] = useState("");
  const [jobDescription, setJobDescription] = useState("");
const [matchScore, setMatchScore] = useState(0);
const [matchedSkills, setMatchedSkills] = useState([]);

  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }

    try {
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);

        const pdf = await pdfjsLib.getDocument({
          data: typedArray,
        }).promise;

        let extractedText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          const pageText = textContent.items
            .map((item) => item.str)
            .join(" ");

          extractedText += pageText + "\n";
        }

        setResumeText(extractedText);

        const lowerText = extractedText.toLowerCase();

        const skillsList = [
          "react",
          "javascript",
          "html",
          "css",
          "node",
          "express",
          "mongodb",
          "sql",
          "git",
          "github",
          "python",
          "tailwind",
          "bootstrap",
          "api",
          "docker",
          "aws",
          "typescript",
        ];

        const foundSkills = skillsList.filter((skill) =>
          lowerText.includes(skill)
        );

        const notFoundSkills = skillsList.filter(
          (skill) => !lowerText.includes(skill)
        );

        setDetectedSkills(foundSkills);
        setMissingSkills(notFoundSkills);

        let score = Math.min(foundSkills.length * 10, 100);
        setAtsScore(score);
        if (jobDescription.trim()) {
  const jdText = jobDescription.toLowerCase();

  const matched = skillsList.filter(
    (skill) =>
      lowerText.includes(skill) &&
      jdText.includes(skill)
  );

  const jdSkills = skillsList.filter((skill) =>
    jdText.includes(skill)
  );

  const matchPercentage =
    jdSkills.length > 0
      ? Math.round((matched.length / jdSkills.length) * 100)
      : 0;

  setMatchedSkills(matched);
  setMatchScore(matchPercentage);
}
        if (score >= 80) {
  setStrength("Strong 💪");
} else if (score >= 60) {
  setStrength("Good 👍");
} else {
  setStrength("Needs Improvement ⚠");
}
      };

      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      alert("Error reading PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          AI Resume Analyzer
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Upload your resume and get ATS insights
        </p>

        <input
          type="file"
          accept=".pdf"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setResumeText("");
            setAtsScore(0);
            setDetectedSkills([]);
            setMissingSkills([]);
          }}
        />
        <div className="mt-6">
  <label className="font-semibold">
    Paste Job Description
  </label>

  <textarea
    rows="6"
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    className="w-full border p-3 rounded-lg mt-2"
    placeholder="Paste Job Description here..."
  />
</div>

        {file && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-3">
              Resume Details
            </h2>

            <p><strong>Name:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> {file.type}</p>

            <button
              onClick={analyzeResume}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Analyze Resume
            </button>
          </div>
        )}

        {atsScore > 0 && (
          <>
            <ATSScore atsScore={atsScore} />
            <div className="w-full bg-gray-300 rounded-full h-4 mt-3">
              <div
                className="bg-green-600 h-4 rounded-full"
                style={{ width: `${atsScore}%` }}
              ></div>
            </div>
          </>
        )}

        {strength && (
          <div className="mt-6 bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-3">
              Resume Strength: {strength}
            </h2>

            <h3 className="font-semibold mb-2">
              Improvement Suggestions:
            </h3>

            <ul className="list-disc ml-6">
              {missingSkills.slice(0, 5).map((skill, index) => (
                <li key={index}>
                  Consider learning {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
        {matchScore > 0 && (
  <div className="mt-6 bg-purple-100 p-4 rounded-lg">
    <h2 className="text-xl font-bold">
      JD Match Score: {matchScore}%
    </h2>
  </div>
)}

{matchedSkills.length > 0 && (
  <div className="mt-6 bg-green-50 p-4 rounded-lg">
    <h2 className="text-xl font-bold mb-3">
      Matched Skills
    </h2>

    <div className="flex flex-wrap gap-2">
      {matchedSkills.map((skill, index) => (
        <span
          key={index}
          className="bg-green-500 text-white px-3 py-1 rounded-full"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}

        {detectedSkills.length > 0 && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-3">
              Detected Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {detectedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-500 text-white px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {missingSkills.length > 0 && (
          <div className="mt-6 bg-red-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-3">
              Missing Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-red-500 text-white px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {resumeText && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-3">
              Extracted Resume Text
            </h2>

            <div className="max-h-96 overflow-y-auto text-sm whitespace-pre-wrap">
              {resumeText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
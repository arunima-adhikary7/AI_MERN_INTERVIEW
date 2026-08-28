import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { askAi } from '../sevices/openRouter.service.js';
export const analyzeResume = async (req, res) => {
  let filePath = null;

  try {
    // ==========================================
    // CHECK FILE
    // ==========================================

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file required",
      });
    }

    filePath = req.file.path;

    console.log("Uploaded file:", filePath);

    // ==========================================
    // CHECK FILE EXISTS
    // ==========================================

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        message: "Uploaded file was not found",
      });
    }

    // ==========================================
    // READ PDF
    // ==========================================

    const fileBuffer =
      await fs.promises.readFile(filePath);

    const uint8Array =
      new Uint8Array(fileBuffer);

    // ==========================================
    // LOAD PDF
    // ==========================================

    const pdf = await pdfjsLib
      .getDocument({
        data: uint8Array,
      })
      .promise;

    console.log(
      "PDF pages:",
      pdf.numPages
    );

    // ==========================================
    // EXTRACT TEXT
    // ==========================================

    let resumeTxt = "";

    for (
      let pn = 1;
      pn <= pdf.numPages;
      pn++
    ) {
      const page = await pdf.getPage(pn);

      const content =
        await page.getTextContent();

      const pageText =
        content.items
          .map((item) => item.str)
          .join(" ");

      resumeTxt += pageText + "\n";
    }

    resumeTxt = resumeTxt
      .replace(/\s+/g, " ")
      .trim();

    console.log(
      "Resume text extracted:"
    );

    console.log(
      resumeTxt.substring(0, 500)
    );

    // ==========================================
    // CREATE AI MESSAGES
    // ==========================================

    const messages = [
      {
        role: "system",
        content: `
You are an expert resume parser.

Extract structured information from the resume.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT use code fences.
Do NOT add explanations.

Return exactly this structure:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"],
  "education": ["education1", "education2"]
}

Rules:

- role must be a string
- experience must be a string
- projects must be an array of strings
- skills must be an array of strings
- education must be an array of strings
- If information is missing, return an empty string or empty array.
        `,
      },

      {
        role: "user",
        content: resumeTxt,
      },
    ];

    // ==========================================
    // SEND TO AI
    // ==========================================

    console.log(
      "Sending resume to OpenRouter..."
    );

    const aiRes =
      await askAi(messages);

    console.log(
      "AI response:",
      aiRes
    );

    // ==========================================
    // CHECK AI RESPONSE
    // ==========================================

    if (!aiRes) {
      throw new Error(
        "AI returned an empty response"
      );
    }

    // ==========================================
    // CLEAN AI RESPONSE
    // ==========================================

    const cleanedResponse =
      aiRes
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // ==========================================
    // PARSE JSON
    // ==========================================

    let parsed;

    try {
      parsed = JSON.parse(
        cleanedResponse
      );
    } catch (error) {
      console.error(
        "AI returned invalid JSON:"
      );

      console.error(
        cleanedResponse
      );

      throw new Error(
        "AI returned invalid JSON"
      );
    }

    // ==========================================
    // DELETE RESUME FILE
    // ==========================================

    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      await fs.promises.unlink(
        filePath
      );
    }

    // ==========================================
    // SEND RESPONSE TO FRONTEND
    // ==========================================

    return res.status(200).json({
      success: true,

      role:
        parsed.role || "",

      experience:
        parsed.experience || "",

      projects:
        Array.isArray(parsed.projects)
          ? parsed.projects
          : [],

      skills:
        Array.isArray(parsed.skills)
          ? parsed.skills
          : [],

      education:
        Array.isArray(parsed.education)
          ? parsed.education
          : [],
    });

  } catch (error) {

    console.error(
      "Resume analysis error:",
      error
    );

    // ==========================================
    // DELETE FILE IF ERROR
    // ==========================================

    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      try {
        await fs.promises.unlink(
          filePath
        );
      } catch (deleteError) {
        console.error(
          "Failed to delete file:",
          deleteError.message
        );
      }
    }

    return res.status(500).json({
      message:
        error.message ||
        "Resume analysis failed",
    });
  }
};
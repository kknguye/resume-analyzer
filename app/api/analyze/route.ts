import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const resumeFile = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    const resumeText = pdfData.text;
    await parser.destroy();

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
      You are a recruiter at the company described in the job description below.
      A candidate has submitted their resume for this role.
      
      Resume: ${resumeText}
      
      Job Description: ${jobDescription}
      
      Respond ONLY with a valid JSON object in exactly this shape, no extra text:
      {
        "overallFit": "excellent" | "good" | "moderate" | "poor",
        "fitScore": number between 0-100,
        "summary": "2-3 sentence honest recruiter summary",
        "matchingSkills": ["skill1", "skill2"],
        "missingSkills": ["skill1", "skill2"],
        "keyStrengths": ["strength1", "strength2"],
        "potentialConcerns": ["concern1", "concern2"],
        "resumeImprovements": [
          {
            "area": "area name",
            "suggestion": "specific suggestion",
            "priority": "high" | "medium" | "low"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleaned);

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
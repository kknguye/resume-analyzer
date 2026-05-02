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

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const prompt = `
    Today's date is ${today}.
    You are a senior technical recruiter evaluating a candidate for the role described below.
    
    Resume: ${resumeText}
    
    Job Description: ${jobDescription}
    
    Instructions:
    - Be specific and honest — avoid generic feedback
    - Only list skills as "matching" if they are explicitly mentioned in both the resume and job description
    - Only list skills as "missing" if they are explicitly required or strongly preferred in the job description
    - When evaluating dates, compare against today's date (${today}). Do not flag past events as future concerns
    - Base the fit score purely on how well the candidate's experience and skills match the job requirements
    - Keep suggestions in resumeImprovements actionable and specific to this role
    - potentialConcerns should only include genuine red flags, not minor issues
    
    Respond ONLY with a valid JSON object in exactly this shape, no extra text, no markdown:
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
          "suggestion": "specific and actionable suggestion tailored to this role",
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
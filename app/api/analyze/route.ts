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
      
      As a recruiter, provide:
      1. A fit score out of 100
      2. What makes this candidate a strong fit
      3. What gaps or concerns you have
      4. A clear verdict: Should they apply? Yes, No, or Maybe — and why in 2-3 sentences
      
      Be direct and honest, like a real recruiter would be.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ analysis: text });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
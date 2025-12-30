import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // --- Server-side validation ---
    if (
      !data.patientName ||
      !data.phoneNumber ||
      !data.department ||
      !data.ratings
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const feedback = await Feedback.create({
      patientName: data.patientName,
      age: data.age || null,
      gender: data.gender || null,
      phoneNumber: data.phoneNumber,
      department: data.department,
      ratings: data.ratings,
      comments: data.comments || "",
      language: data.language,
      submittedAt: data.submittedAt,
    });

    return NextResponse.json(
      { message: "Feedback saved", id: feedback._id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Mongo Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

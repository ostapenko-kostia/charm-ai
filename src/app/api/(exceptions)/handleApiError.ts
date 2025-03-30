import { ApiError } from "./apiError";
import { NextResponse } from "next/server";

export const handleApiError = (err: unknown) => {
  if (err instanceof ApiError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }

  console.error("Unexpected error:", err);
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
};

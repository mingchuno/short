import { ShortenRespone } from "@/types/shorten";
import { notFound, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

// TODO: impl it to real db
async function getLongUrlFromId(id: string): Promise<ShortenRespone> {
  return {
    longUrl: "https://google.com",
    link: "https://s.mcor.dev/NCNUq8QtX",
    id: "NCNUq8QtX",
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get id doc from DB
  // Redirect to link
  // How to handle notfound?
  const { id } = params;
  console.log(id);
  try {
    const res = await getLongUrlFromId(id);
    return NextResponse.redirect(res.longUrl);
  } catch (error) {
    console.error(error);
    redirect("/404");
  }
}

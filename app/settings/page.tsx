import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }
  return <div>Settings</div>;
}

import React, { useState } from "react";
import PreferencesForm from "../components/preferenceForm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const Preferences = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/prefrences");
  }
  return (
    <div>
      <PreferencesForm></PreferencesForm>
    </div>
  );
};

export default Preferences;

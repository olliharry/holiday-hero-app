import React, { useState } from "react";
import PreferencesForm from "../components/preferenceForm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PreferencesList from "../components/preferencesList";
import { GetAllPreferences } from "../actions/actions";

const Preferences = async () => {
  const session = await auth();
  const user = session?.user;
  const preferences = await GetAllPreferences();
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/prefrences");
  }
  return (
    <div>
      <PreferencesForm></PreferencesForm>
      <PreferencesList preference={preferences}></PreferencesList>
    </div>
  );
};

export default Preferences;

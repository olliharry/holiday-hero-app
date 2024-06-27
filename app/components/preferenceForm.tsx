"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { CreatePreference } from "../actions/actions";
import SubmitButtonMainForm from "./submitButtonMainForm";
import AlertWarning from "./alertWarning";
import { useFormState } from "react-dom";
import SelectMultiple from "./selectMultiple";

const PreferencesForm: React.FC = () => {
  const [preferenceName, setPreferenceName] = useState<string>("");
  const [error, action] = useFormState(CreatePreference, null);

  return (
    <div
      className="max-w-lg mx-auto my-8 p-4 bg-primary shadow-2xl rounded-md"
      data-theme="cupcake"
    >
      {error && <AlertWarning warning={error}></AlertWarning>}
      <h2 className="text-2xl font-bold mb-4">Create Preferences</h2>
      <form className="space-y-4" action={action}>
        <div>
          <label className="block">
            Preference Name:
            <input
              required
              placeholder="Italy Summer 2025"
              name="preferenceName"
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
              value={preferenceName}
              onChange={(e) => setPreferenceName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <p>Add a minimum of 4 Activites and 4 Restuarants. </p>
          <SelectMultiple></SelectMultiple>
        </div>

        <SubmitButtonMainForm title="Create Preference"></SubmitButtonMainForm>
      </form>
    </div>
  );
};

export default PreferencesForm;

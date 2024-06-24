"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { CreatePreference } from "../actions/actions";
import SubmitButtonMainForm from "./submitButtonMainForm";
import AlertWarning from "./alertWarning";
import { useFormState } from "react-dom";
import SelectMultiple from "./selectMultiple";

const PreferencesForm: React.FC = () => {
  const [restaurants, setRestaurants] = useState<string[]>([""]);
  const [activities, setActivities] = useState<string[]>([""]);
  const [preferenceName, setPreferenceName] = useState<string>("");
  const [error, action] = useFormState(CreatePreference, null);

  const handleAddRestaurant = () => {
    setRestaurants([...restaurants, ""]);
  };

  const handleAddActivity = () => {
    setActivities([...activities, ""]);
  };

  const handleRemoveRestaurant = (index: number) => {
    const updatedRestaurants = [...restaurants];
    updatedRestaurants.splice(index, 1);
    setRestaurants(updatedRestaurants);
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1);
    setActivities(updatedActivities);
  };

  const handleRestaurantChange = (index: number, value: string) => {
    const updatedRestaurants = [...restaurants];
    updatedRestaurants[index] = value;
    setRestaurants(updatedRestaurants);
  };

  const handleActivityChange = (index: number, value: string) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = value;
    setActivities(updatedActivities);
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-4 bg-primary shadow-md rounded-md">
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
        
        <SelectMultiple></SelectMultiple>
        
        <SubmitButtonMainForm title="Create Preference"></SubmitButtonMainForm>
      </form>
    </div>
  );
};

export default PreferencesForm;

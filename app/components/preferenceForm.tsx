"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { CreatePreference } from "../actions/actions";

const PreferencesForm: React.FC = () => {
  const [restaurants, setRestaurants] = useState<string[]>([""]);
  const [activities, setActivities] = useState<string[]>([""]);
  const [preferenceName, setPreferenceName] = useState<string>("");

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
      <h2 className="text-2xl font-bold mb-4">Add Preferences</h2>
      <form className="space-y-4" action={CreatePreference}>
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
          <label className="block">
            Restaurants:
            {restaurants.map((restaurant, index) => (
              <div key={index} className="flex items-center space-x-2 pb-1">
                <input
                  required
                  placeholder="eg. Pizza, Burgers, breakfast, buffet, expensive"
                  name="restaurants"
                  type="text"
                  className="flex-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
                  value={restaurant}
                  onChange={(e) =>
                    handleRestaurantChange(index, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  onClick={() => handleRemoveRestaurant(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 inline-block px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              onClick={handleAddRestaurant}
            >
              Add Restaurant
            </button>
          </label>
        </div>
        <div>
          <label className="block">
            Activities:
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-2 pb-1">
                <input
                  required
                  placeholder="Swimming, Hiking, Museums, indoors, "
                  name="activities"
                  type="text"
                  className="flex-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 outline-none"
                  value={activity}
                  onChange={(e) => handleActivityChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  onClick={() => handleRemoveActivity(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 inline-block px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              onClick={handleAddActivity}
            >
              Add Activity
            </button>
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200 focus:ring-opacity-50"
        >
          Submit Preferences
        </button>
      </form>
    </div>
  );
};

export default PreferencesForm;

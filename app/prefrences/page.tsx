"use client";
import React from "react";
import { useState } from "react";
import { auth } from "@/auth";
import prisma from "../lib/prisma";

interface PreferencesProps {}

interface Preference {
  restaurants: string[];
  activities: string[];
}

const Preferences: React.FC<PreferencesProps> = () => {
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [restaurantInput, setRestaurantInput] = useState<string>("");
  const [activityInput, setActivityInput] = useState<string>("");

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantInput(e.target.value);
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityInput(e.target.value);
  };

  const handleAddRestaurant = () => {
    setRestaurants([...restaurants, restaurantInput]);
    setRestaurantInput("");
  };

  const handleAddActivity = () => {
    setActivities([...activities, activityInput]);
    setActivityInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preferences: Preference = {
      restaurants,
      activities,
    };

    console.log("Submitted Preferences:", preferences);
  };

  return (
    <div>
      <h2>Add Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Restaurants:
            <input
              type="text"
              value={restaurantInput}
              onChange={handleRestaurantChange}
            />
            <button type="button" onClick={handleAddRestaurant}>
              Add Restaurant
            </button>
          </label>
          <ul>
            {restaurants.map((restaurant, index) => (
              <li key={index}>{restaurant}</li>
            ))}
          </ul>
        </div>
        <div>
          <label>
            Activities:
            <input
              type="text"
              value={activityInput}
              onChange={handleActivityChange}
            />
            <button type="button" onClick={handleAddActivity}>
              Add Activity
            </button>
          </label>
          <ul>
            {activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
        <button type="submit">Submit Preferences</button>
      </form>
    </div>
  );
};

export default Preferences;

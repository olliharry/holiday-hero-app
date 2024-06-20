"use client";
import { GoogleMap } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import AutocompleteInput from "./AutoCompleteInput";
import getPlace from "../actions/placesActions";

interface MainFormProps {
  preferenceNames: string[];
}

const MainForm: React.FC<MainFormProps> = ({ preferenceNames }) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(20);
  const [days, setDays] = useState(1);

  const handleRadiusSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };
  const handleDaysSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(Number(e.target.value));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-primary rounded-md shadow-md">
      <h2 className="text-2xl mb-4 font-bold text-gray-800">
        Create Itinerary
      </h2>
      <form action={getPlace} className="space-y-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location:
          </label>
          <AutocompleteInput value={location} onChange={setLocation} />
        </div>
        <select
          name="preferenceName"
          required
          className="select select-bordered w-full max-w-xs"
        >
          <option value="" disabled selected>
            select your Preference
          </option>
          {preferenceNames.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div>
          {days > 1 && <p>{days} Days</p>}
          {days == 1 && <p>{days} Day</p>}
          <input
            name="days"
            type="range"
            min={1}
            max={7}
            value={days}
            className="range [--range-shdw:black]"
            onChange={handleDaysSliderChange}
          />
        </div>
        <div>
          <p>{radius} Km</p>
          <input
            name="radius"
            type="range"
            min={3}
            max={100}
            value={radius}
            className="range [--range-shdw:black]"
            onChange={handleRadiusSliderChange}
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Itinerary
        </button>
      </form>
    </div>
  );
};

export default MainForm;

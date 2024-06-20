"use client";
import { GoogleMap } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import AutocompleteInput from "./AutoCompleteInput";

interface MainFormProps {
  preferenceNames: string[];
}

const MainForm: React.FC<MainFormProps> = ({ preferenceNames }) => {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [radius, setRadius] = useState(20);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted:", { location, startDate, endDate });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-primary rounded-md shadow-md">
      <h2 className="text-2xl mb-4 font-bold text-gray-800">
        Create Itinerary
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location:
          </label>
          <AutocompleteInput value={location} onChange={setLocation} />
        </div>
        <select required className="select select-bordered w-full max-w-xs">
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
          <p>{radius} Miles</p>
          <input
            type="range"
            min={5}
            max={100}
            value={radius}
            className="range [--range-shdw:black]"
            onChange={handleSliderChange}
          />
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MainForm;

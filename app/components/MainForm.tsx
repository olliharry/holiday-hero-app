"use client";
import { GoogleMap } from "@react-google-maps/api";
import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import AutocompleteInput from "./AutoCompleteInput";
import getPlace from "../actions/placesActions";
import { useFormState, useFormStatus } from "react-dom";
import AlertWarning from "./alertWarning";

import Link from "next/link";
import SubmitButtonMainForm from "./submitButtonMainForm";

interface MainFormProps {
  preferenceNames: string[];
}

const MainForm: React.FC<MainFormProps> = ({ preferenceNames }) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(20);
  const [days, setDays] = useState(1);
  const [error, action] = useFormState(getPlace, null);

  const handleRadiusSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };
  const handleDaysSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(Number(e.target.value));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-primary rounded-md shadow-md">
      {error && <AlertWarning warning={error}></AlertWarning>}
      <h2 className="text-2xl mb-4 font-bold text-gray-800">
        Create Itinerary
      </h2>
      <form action={action} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Itinerary name:
          </label>
          <input
            name="itineraryName"
            type="text"
            placeholder="Itinerary name"
            className="input m-0"
            required
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location:
          </label>
          <AutocompleteInput value={location} onChange={setLocation} />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Preference:
          </label>

          <div className="flex">
            <select
              name="preferenceName"
              required
              className="select select-bordered w-full max-w-xs"
              defaultValue="Select your Prefernce"
            >
              {preferenceNames.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <Link href="/prefrences" className="btn btn-square btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
          </div>
        </div>
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
        <SubmitButtonMainForm title="Create Itinerary"></SubmitButtonMainForm>
      </form>
    </div>
  );
};

export default MainForm;

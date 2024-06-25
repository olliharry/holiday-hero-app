"use client";
import React from "react";
import { useState, useEffect } from "react";
import { DeletePreference } from "../actions/actions";
import { useTransition } from "react";

interface props {
  preference:
    | {
        id: string;
        userId: string;
        preferenceName: string;
        restaurants: string[];
        activities: string[];
      }[]
    | undefined;
}
const PreferencesList: React.FC<props> = ({ preference }) => {
  const [userHasPreferences, setUserHasPreferences] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (preference && preference.length > 0) {
      setUserHasPreferences(true);
    } else {
      setUserHasPreferences(false);
    }
  }, [preference]);
  /*async () => {
    DeletePreference(p.id);
  };*/

  return (
    <div>
      {userHasPreferences && (
        <div
          className="max-w-lg mx-auto my-8 p-4 bg-primary shadow-2xl rounded-md flex flex-col items-center"
          data-theme="cupcake"
        >
          {preference &&
            preference?.map((p, index) => (
              <div key={index} className="card bg-base-100 w-96 shadow-xl mb-4">
                <div className="card-body">
                  <div className="flex justify-evenly">
                    <h2 className="card-title">{p.preferenceName}</h2>
                    {!isPending && (
                      <button
                        onClick={async () => {
                          startTransition(() => {
                            DeletePreference(p.id);
                          });
                        }}
                        className="btn btn-square btn-outline btn-error"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                    {isPending && (
                      <span className="loading loading-spinner loading-xs"></span>
                    )}
                  </div>
                  <p className="text-xl">Activities:</p>
                  <p>{p.activities.join(",  ")}</p>
                  <p className="text-xl">Restaurants:</p>
                  <p>{p.restaurants.join(",  ")}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PreferencesList;

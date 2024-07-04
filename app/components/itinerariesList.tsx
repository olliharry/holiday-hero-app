"use client";
import React from "react";
import { useState, useTransition, useEffect } from "react";
import { DeleteItinerary } from "../actions/actions";

interface Day {
  id: string;
  activities: string;
  activityAddress: string;
  restaurants: string;
  restaurantAddress: string;
  itineraryId: string | null;
}

interface Itinerary {
  id: string;
  name: string;
  userId: string | null;
  days: Day[];
}

interface props {
  itineraries: Itinerary[];
}

const ItinerariesList: React.FC<props> = ({ itineraries }) => {
  const [userHasItineraries, setUserHasItineraries] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (itineraries && itineraries.length > 0) {
      setUserHasItineraries(true);
    } else {
      setUserHasItineraries(false);
    }
  }, [itineraries]);

  return (
    <div>
      {userHasItineraries && (
        <div
          className="max-w-lg mx-auto my-8 p-4 bg-primary shadow-2xl rounded-md flex flex-col items-center"
          data-theme="cupcake"
        >
          {itineraries &&
            itineraries?.map((i, index) => (
              <div key={index} className="card bg-base-100 w-96 shadow-xl mb-4">
                <div className="card-body">
                  <div className="flex justify-evenly">
                    <h2 className="card-title">{i.name}</h2>
                    {!isPending && (
                      <button
                        onClick={async () => {
                          startTransition(() => {
                            DeleteItinerary(i.id);
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
                  {i.days.map((d, indexDays) => (
                    <div key={indexDays}>
                      <p className="text-2xl">Day {indexDays + 1}</p>
                      <p className="text-xl">Activity: {d.activities}</p>
                      <a
                        className="text-xs text-blue-600 underline"
                        href={d.activityAddress}
                      >
                        {d.activityAddress}
                      </a>
                      <p className="text-xl">Restaurant: {d.restaurants}</p>

                      <a
                        className="text-xs text-blue-600 underline"
                        href={d.restaurantAddress}
                      >
                        {d.restaurantAddress}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ItinerariesList;

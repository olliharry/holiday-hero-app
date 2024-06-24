import React, { useState, ChangeEvent } from "react";
import { activities, restaurants } from "../utils/preferenceOptions";

export default function SelectMultiple() {
  const activitiesOptions = activities;

  const restaurantOptions = restaurants;
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);

  const handleActivityCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const activity = event.target.value;
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(
        selectedActivities.filter((item) => item !== activity)
      );
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleRestaurantCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const restaurant = event.target.value;
    if (selectedRestaurants.includes(restaurant)) {
      setSelectedRestaurants(
        selectedRestaurants.filter((item) => item !== restaurant)
      );
    } else {
      setSelectedRestaurants([...selectedRestaurants, restaurant]);
    }
  };

  return (
    <div>
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">
          Choose Activities
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-96 p-2 shadow max-h-96 overflow-y-auto"
        >
          {activitiesOptions.map((activity, index) => (
            <div key={index} className="form-control flex-row my-2">
              <input
                name="activities"
                type="checkbox"
                id={activity}
                value={activity}
                checked={selectedActivities.includes(activity)}
                onChange={handleActivityCheckboxChange}
                className="checkbox mr-2"
              />
              <label htmlFor={activity} className="label-text">
                {activity}
              </label>
            </div>
          ))}
        </ul>
      </div>

      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">
          Choose Restaurants
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-96 p-2 shadow max-h-96 overflow-y-auto"
        >
          {restaurantOptions.map((restaurant, index) => (
            <div key={index} className="form-control flex-row my-2">
              <input
                name="restaurants"
                type="checkbox"
                id={restaurant}
                value={restaurant}
                checked={selectedRestaurants.includes(restaurant)}
                onChange={handleRestaurantCheckboxChange}
                className="checkbox mr-2"
              />
              <label htmlFor={restaurant} className="label-text">
                {restaurant}
              </label>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

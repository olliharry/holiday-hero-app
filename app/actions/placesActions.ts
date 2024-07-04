"use server"
import axios, { Axios, AxiosResponse } from "axios";
import prisma from "../lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

interface Preference{
    activities: string[],
    restaurants: string [],
}

export default async function getPlace(previousState: any, formData: FormData) {
    const apiKey = process.env.NEXT_PUBLIC_NEXT_GOOGLE_MAPS_API_KEY;
    const preferenceName = formData.get("preferenceName") as string;
    const location = formData.get("location") as string;
    const itineraryName = formData.get("itineraryName") as string;
    const radius = parseInt(`${formData.get("radius")}000`);
    
    const days = parseInt(formData.get("days") as string);
    let itinerary;
    let actIteration = 0
    let restIteration = 0;
    let actNext = 0;
    let restNext = 0;

    if (await doesItineraryExist(itineraryName)) {
      return 'Itinerary name taken!';
    }
   
    const loc = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`);
    const lat = loc.data.results[0].geometry.location.lat;
    const long = loc.data.results[0].geometry.location.lng;

  
    const preference = await getPreference(preferenceName);
    if (!preference?.activities || !preference.restaurants) return;
  
    const createRequestData = (type:string, lat:number, long:number, radius:number) => ({
        includedPrimaryTypes: [type],
        maxResultCount: 5,
        locationRestriction: {
        circle: {
            center: {
            latitude: lat,
            longitude: long
            },
            radius: radius
        }
        }
    });
    
    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.googleMapsUri'
    };
    
    const activityRequests = preference.activities.map(activity => 
        axios.post('https://places.googleapis.com/v1/places:searchNearby', createRequestData(activity, lat, long, radius), { headers })
    );
    
    const restaurantRequests = preference.restaurants.map(restaurant => 
        axios.post('https://places.googleapis.com/v1/places:searchNearby', createRequestData(restaurant, lat, long, radius), { headers })
    );
    
    const [activityResponses, restaurantResponses] = await Promise.all([
        Promise.all(activityRequests),
        Promise.all(restaurantRequests)
    ]);
    console.log(activityResponses[0].data);
          
    if(activityResponses[0].data.places==undefined||restaurantResponses[0].data.places==undefined){
        return 'No places found. Increase the radius.'
    }else{
        itinerary = await createItinerary(itineraryName);
    }
    
    
    try{
        for (let i = 0; i < days; i++) {
            if(activityResponses.length==i){
                actIteration = 0;
                actNext++;
            }
            if(restaurantResponses.length==i){
                restIteration = 0;
                restNext++;
            }
            if(activityResponses[actIteration].data.places[actNext] == undefined || restaurantResponses[restIteration].data.places[restNext] == undefined){
                return 'Itinerary created with less days due to lack of results! Increase the search radius!'
            }
            await prisma.day.create({
                data:{
                    itineraryId: itinerary.id,
                    activities: activityResponses[actIteration].data.places[actNext].displayName.text,
                    activityAddress: activityResponses[actIteration].data.places[actNext].googleMapsUri,
                    restaurants: restaurantResponses[restIteration].data.places[restNext].displayName.text,
                    restaurantAddress: restaurantResponses[restIteration].data.places[restNext].googleMapsUri,
                }
            })
            actIteration++;
            restIteration++;
        }
    }catch(error){
        return 'Itinerary created with less days due to lack of results! Increase the search radius!';
    } 
    console.log("DONE!!")
    return 'Successfully Created Itinerary!';
  }



export async function doesItineraryExist(name: string) {
    const user = await getUser();
    const itinerary = await prisma.itinerary.findFirst({
        where:{
            name: name,
            userId: user?.id
        }
    })
    if(itinerary){
        return true;
    }
    else{
        return false;
    }
    
}

async function createItinerary(itineraryName:string) {
    const user = await getUser();
    const itinerary = await prisma.itinerary.create({
        data:{
            name: itineraryName,
            userId: user?.id,
        }
    })
    return itinerary;
}

async function getPreference(preferenceName:string): Promise<Preference | undefined> {
    const user = await getUser();
    const preference = await prisma.preference.findFirst({
        where:{
            preferenceName: preferenceName,
            userId: user?.id,
        },
    })
    let p: Preference = {
        activities: [],
        restaurants: [],
    };
    if(preference?.activities&&preference?.restaurants)
    {
        p.activities = preference?.activities;
        p.restaurants = preference?.restaurants;
        return p;
    } 
    else{
        return undefined;
    }   
}

async function getUser() {
    const session = await auth();
    if(!session?.user?.email){
        return;
    }
    const user = await prisma.user.findFirst({
        where:{email: session?.user?.email},
    })
    return user;
}

export async function getGoogleApiKey() {
    return(process.env.NEXT_GOOGLE_MAPS_API_KEY || "undefined key");
}


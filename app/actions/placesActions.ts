"use server"
import axios, { Axios, AxiosResponse } from "axios";
import prisma from "../lib/prisma";
import { auth } from "@/auth";



interface Preference{
    activities: string[],
    restaurants: string [],
}

export default async function getPlace(previousState: any, formData: FormData) {
    const apiKey = process.env.NEXT_PUBLIC_NEXT_GOOGLE_MAPS_API_KEY;
    const preferenceName = formData.get("preferenceName") as string;
    const location = formData.get("location") as string;
    const itineraryName = formData.get("itineraryName") as string;
    const radius = `${formData.get("radius")}000`;
    const days = parseInt(formData.get("days") as string);

    let sortedActivites = [];
    let sortedRestuarants = [];
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
  
    // Helper function to create API request promises
    const createApiRequests = (items: string[], type: string) => {
      return items.map(item => axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${long}&query=${item} ${type === 'restaurants' ? 'food' : ''}&radius=${radius}&key=${apiKey}`
      ));
    };
  
    // Concurrent API calls for activities and restaurant
    const [activityResponses, restaurantResponses] = await Promise.all([
      Promise.all(createApiRequests(preference.activities, 'activities')),
      Promise.all(createApiRequests(preference.restaurants, 'restaurants'))
    ]);
  
    // Process responses
    sortedActivites = activityResponses.map(response => response.data.results.sort((a: any, b: any) => b.user_ratings_total - a.user_ratings_total));
    sortedRestuarants = restaurantResponses.map(response => response.data.results.sort((a: any, b: any) => b.user_ratings_total - a.user_ratings_total));
  
    const itinerary = await createItinerary(itineraryName);
  
    for (let i = 0; i < days; i++) {
        actIteration++;
        restIteration++;
        if(sortedActivites.length-1==i){
            actIteration = 0;
            actNext++;
        }
        if(sortedRestuarants.length-1==i){
            restIteration = 0;
            restNext++;
        }
        await prisma.day.create({
            data:{
                itineraryId: itinerary.id,
                activities: sortedActivites[actIteration][actNext].name,
                activityAddress: sortedActivites[actIteration][actNext].formatted_address,
                restaurants: sortedRestuarants[restIteration][restNext].name,
                restaurantAddress: sortedRestuarants[restIteration][restNext].formatted_address,
            }
        })
    }
      
    console.log("DONE!!")
    //revalidatePath("/");
    return 'Successfully Created Itinerary!';
  }

/*export async function getPlaceold(previousState:any, formData: FormData){
    const apiKey = process.env.NEXT_GOOGLE_MAPS_API_KEY;
    const preferenceName = formData.get("preferenceName") as string;
    const location = formData.get("location") as string;
    const itineraryName = formData.get("itineraryName") as string;
    const radius = `${formData.get("radius")}000`; 
    const days = parseInt(formData.get("days") as string);
    
    let responseRestuarants = [];
    let responseActivities = [];
    let sortedActivites = [];
    let sortedRestuarants = [];
    let actIteration = 0
    let restIteration = 0;
    let actNext = 0;
    let restNext = 0;

    if(await doesItineraryExist(itineraryName)){
        return 'Itinerary name taken!';
    }

    const loc = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`)
    const lat = loc.data.results[0].geometry.location.lat;
    const long = loc.data.results[0].geometry.location.lng;
    

    const preference = await getPreference(preferenceName);
    if(preference?.activities == undefined || preference.restaurants == undefined) return;
    

    for(let i = 0; i < preference?.activities.length;i++){
        responseActivities.push(await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat}%2C${long}&query=${preference?.activities[i]}&radius=100000&key=${apiKey}`
        ))
        sortedActivites.push(responseActivities[i].data.results.sort((a:any, b:any) => b.user_ratings_total - a.user_ratings_total))
    }
    for(let i = 0; i < preference?.restaurants.length;i++){
        responseRestuarants.push(await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat}%2C${long}&query=${preference?.restaurants[i]} food&radius=${radius}&key=${apiKey}`
        ))
        sortedRestuarants.push(responseRestuarants[i].data.results.sort((a:any, b:any) => b.user_ratings_total - a.user_ratings_total))
    }
    
    const itinerary = await createItinerary(itineraryName);

    for (let i = 0; i < days; i++) {
        actIteration++;
        restIteration++;
        if(sortedActivites.length-1==i){
            actIteration = 0;
            actNext++;
        }
        if(sortedRestuarants.length-1==i){
            restIteration = 0;
            restNext++;
        }
        await prisma.day.create({
            data:{
                itineraryId: itinerary.id,
                activities: sortedActivites[actIteration][actNext].name,
                activityAddress: sortedActivites[actIteration][actNext].formatted_address,
                restaurants: sortedRestuarants[restIteration][restNext].name,
                restaurantAddress: sortedRestuarants[restIteration][restNext].formatted_address,
            }
        })
    }
    revalidatePath("/");
    return 'Successfully Created Itinerary!';
}*/



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

/*for(let i = 0; i < preference?.activities.length;i++){
        responseActivities.push(await axios.get(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${preference?.activities[i]}&inputtype=textquery&locationbias=circle%3A${radius}%${lat}%2C${long}&fields=formatted_address%2Cname%2Cuser_ratings_total&key=${apiKey}`
        ))
        sortedActivites.push(responseActivities[i].data.results.sort((a:any, b:any) => b.user_ratings_total - a.user_ratings_total))
    }
    for(let i = 0; i < preference?.restaurants.length;i++){
        responseRestuarants.push(await axios.get(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${preference?.restaurants[i]}&inputtype=textquery&locationbias=circle%3A${radius}%${lat}%2C${long}&fields=formatted_address%2Cname%2Cuser_ratings_total&key=${apiKey}`
        ))
        sortedRestuarants.push(responseRestuarants[i].data.results.sort((a:any, b:any) => b.user_ratings_total - a.user_ratings_total))
    }*/
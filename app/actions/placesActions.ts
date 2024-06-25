"use server"
import axios, { Axios, AxiosResponse } from "axios";
import prisma from "../lib/prisma";
import { auth } from "@/auth";

interface Preference{
    activities: string[],
    restaurants: string [],
}
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&amp;key=YOUR_API_KEY
export default async function getPlace(previousState:any, formData: FormData){
    const apiKey = process.env.NEXT_GOOGLE_MAPS_API_KEY;
    const preferenceName = formData.get("preferenceName") as string;
    const location = formData.get("location") as string;
    const itineraryName = formData.get("itineraryName") as string;
    const radius = `${formData.get("radius")}000`; 
    const days = parseInt(formData.get("days") as string);
    
    let responseRestuarants = [];
    let responseActivities = [];

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
    }
    for(let i = 0; i < preference?.restaurants.length;i++){
        responseRestuarants.push(await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat}%2C${long}&query=${preference?.restaurants[i]}&radius=${radius}&key=${apiKey}`
        ))
    }
    
    const itinerary = await createItinerary(itineraryName);

    for (let i = 0; i < days; i++) {
        await prisma.day.create({
            data:{
                itineraryId: itinerary.id,
                activities: responseActivities[i].data.results[0].name,
                restaurants: responseRestuarants[i].data.results[0].name
            }
        })
    }
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
"use server"
import axios, { Axios, AxiosResponse } from "axios";
import prisma from "../lib/prisma";
import { auth } from "@/auth";

interface Preference{
    activities: string[],
    restaurants: string [],
}

export default async function getPlace(formData: FormData){
    const apiKey = process.env.NEXT_GOOGLE_MAPS_API_KEY;
    const preferenceName = formData.get("preferenceName") as string;
    const location = formData.get("location") as string;
    const itineraryName = formData.get("itineraryName") as string;
    const radius = `${formData.get("radius")}000`; 
    const days = parseInt(formData.get("days") as string);
    
    let responseRestuarants = [];
    let responseActivities = [];

    const preference = await getPreference(preferenceName);
    if(preference?.activities == undefined || preference.restaurants == undefined) return;
    

    for(let i = 0; i < preference?.activities.length;i++){
        responseActivities.push(await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${preference?.activities[i]}&location=${location}&radius=${radius}&key=${apiKey}`
        ))
    }
    for(let i = 0; i < preference?.restaurants.length;i++){
        responseRestuarants.push(await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${preference?.restaurants[i]}&location=${location}&radius=${radius}&key=${apiKey}`
        ))
    }
    //ADD CHECK FOR ITINERARYNAME ALREADY IN USE!!
    //create new itinerary for current user
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
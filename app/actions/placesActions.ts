"use server"
import axios from "axios";
import prisma from "../lib/prisma";
import { auth } from "@/auth";
import { platform } from "os";

interface Preference{
    activities: string[],
    restaurants: string [],
}

export default async function getPlace(formData: FormData){
    const apiKey = process.env.NEXT_GOOGLE_MAPS_API_KEY;
    const preferenceName = formData.get("preferenceName") as string;
    const location = formData.get("location") as string;
    const radius = `${formData.get("radius")}000`; 
    const days = formData.get("days") as string;
    
    
    /*const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${preferenceName}&location=${location}&radius=${radius}&key=${apiKey}`
    );*/

    
    const preference = await getPreference(preferenceName);
    console.log(preference?.activities , preference?.restaurants);
    /*console.log(response.data.results[0].name);*/

}

async function getPreference(preferenceName:string): Promise<Preference | undefined> {
    const session = await auth();
    if(!session?.user?.email){
        return;
    }
    const user = await prisma.user.findFirst({
        where:{email: session?.user?.email},
    })
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
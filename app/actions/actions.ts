"use server"
import prisma from "../lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache";

export async function CreatePreference(previousState:any,formData: FormData){
    const session = await auth();
    if(!session?.user?.email){
        return 'Error!';
    }  
    if((formData.getAll("activities") as string[]).length < 4 || (formData.getAll("restaurants") as string[]).length < 4){
        return 'Please enter at least 4 Restaurants and 4 Activites!';
    }
    
    if(await PreferenceNameTaken(session?.user?.email, formData.get("preferenceName") as string)){
        return 'Preference Name Already In Use!'
    }
    const currentUser = await prisma.user.findFirst({
        where:{email: session?.user?.email},
    })
    if(!currentUser){
        return 'Error!';
    }
    const newPreference = await prisma.preference.create({
        data:{
            userId: currentUser?.id,
            preferenceName: formData.get("preferenceName") as string,
            activities: formData.getAll("activities") as string[],
            restaurants: formData.getAll("restaurants") as string[],
        },
    })
    revalidatePath("/prefrences");
    return 'Successfully Added Preference!'
}

export async function DeletePreference(preferenceId:string){
    const user = await GetUser();
    const deletePreference = await prisma.preference.delete({
        where:{
            id: preferenceId,
            userId: user?.id,
        }
    })
    revalidatePath("/prefrences");
}

export async function DeleteItinerary(itineraryId:string){
    const user = await GetUser();
    await prisma.day.deleteMany({
        where: {
          itineraryId: itineraryId,
        },
      });
    await prisma.itinerary.delete({
        where:{
            id: itineraryId,
            userId: user?.id,
        }
    })
    revalidatePath("/");
}

export async function GetAllPreferencesNames() {
    const session = await auth();
    if(!session?.user?.email){
        return;
    }
    const currentUser = await prisma.user.findFirst({
        where:{email: session?.user?.email},
    })
    const currentUserPreferences = await prisma.preference.findMany({
        where:{userId: currentUser?.id},
    })
    const preferenceNames = currentUserPreferences.map(preference => preference.preferenceName);
    return preferenceNames;
}

export async function GetAllItineraries() {
    const currentUser = await GetUser();
    const currentUserItineraries = await prisma.itinerary.findMany({
        where:{userId: currentUser?.id},
        include:{days: true},
    })
    return currentUserItineraries;
}

export async function GetAllPreferences() {
    /*const session = await auth();
    if(!session?.user?.email){
        return;
    }
    const currentUser = await prisma.user.findFirst({
        where:{email: session?.user?.email},
    })*/
   const currentUser = await GetUser();
    const currentUserPreferences = await prisma.preference.findMany({
        where:{userId: currentUser?.id},
    })
    return currentUserPreferences;
}

const PreferenceNameTaken = async(userEmail: string, newPreferenceName:string) => {
    const currentUser = await prisma.user.findFirst({
        where:{email: userEmail},
        include:{preferences : true},
    })
    if(!currentUser?.preferences){
        //user has no prefrences
        return false;
    }
    for (let i = 0; i < currentUser?.preferences.length; i++) {
        if(currentUser.preferences[i].preferenceName == newPreferenceName){
            return true;
        }
      }
    return false;
}

async function GetUser() {
    const session = await auth();
    if(!session?.user?.email){
        return;
    }
    const user = await prisma.user.findFirst({
        where:{email: session?.user?.email},
    })
    return user;
}
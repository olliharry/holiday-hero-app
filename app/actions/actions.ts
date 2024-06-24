"use server"
import prisma from "../lib/prisma"
import { auth } from "@/auth"

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
    return 'Successfully Added Preference!'
}

export async function GetAllPreferences() {
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
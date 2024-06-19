"use server"
import prisma from "../lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation";

export async function CreatePreference(formData: FormData){
    const session = await auth();
    if(!session?.user?.email){
        alert("Not logged in!")
        redirect("/home");
    }  

    if(await PreferenceNameTaken(session?.user?.email, formData.get("preferenceName") as string)){
        alert("Preference name already taken")
        redirect("/home");
    }
    
    const currentUser = await prisma.user.findFirst({
        where:{email: session?.user?.email},
    })

    if(!currentUser){
        redirect("/home");
    }

    const newPreference = await prisma.preference.create({
        data:{
            userId: currentUser?.id,
            preferenceName: formData.get("preferenceName") as string,
            activities: formData.getAll("activities") as string[],
            restaurants: formData.getAll("restaurants") as string[],
        },
    })
    redirect("/");
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
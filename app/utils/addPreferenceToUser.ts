import prisma from "../lib/prisma";

const addPreferenceToUser = async (userId: string, restaurants: string[], activities: string[], newPreferenceName: string) => {
    if(await preferenceNameTaken(userId, newPreferenceName)){
        //Preference name already taken!
        return;
    }
};

const preferenceNameTaken = async(userId: string, newPreferenceName:string) => {
    const currentUser = await prisma.user.findFirst({
        where:{id: userId},
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



export default addPreferenceToUser;
"use server"
import axios from "axios";

export default async function getPlace(formData: FormData){
    const apiKey = process.env.NEXT_GOOGLE_MAPS_API_KEY;
    const preference = formData.get("preferenceName") as string;
    const location = formData.get("location") as string;
    const radius = `${formData.get("radius")}000`; 
    const days = formData.get("days") as string;
    
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${preference}&location=${location}&radius=${radius}&key=${apiKey}`
    );
    
    console.log(response.data.results[0].name);

}
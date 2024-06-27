import prisma from "./lib/prisma";
import MainForm from "./components/MainForm";
import ItinerariesList from "./components/itinerariesList";
import { GetAllPreferencesNames, GetAllItineraries } from "./actions/actions";
import { auth } from "@/auth";
import { itxClientDenyList } from "@prisma/client/runtime/library";

export default async function Home() {
  const session = await auth();
  var preferenceNames = await GetAllPreferencesNames();
  if (!preferenceNames) preferenceNames = [];
  let itineraries = await GetAllItineraries();
  itineraries = itineraries.reverse();

  return (
    <main className="flex flex-col items-center">
      <MainForm preferenceNames={preferenceNames}></MainForm>
      {session?.user && (
        <ItinerariesList itineraries={itineraries}></ItinerariesList>
      )}
    </main>
  );
}
//?callbackUrl=https%3A%2F%2Fholiday-hero-app.vercel.app%2F
//?callbackUrl=https%3A%2F%2Fholiday-hero-app.vercel.app%2F

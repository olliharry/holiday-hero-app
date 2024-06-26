import prisma from "./lib/prisma";
import MainForm from "./components/MainForm";
import ItinerariesList from "./components/itinerariesList";
import { GetAllPreferencesNames, GetAllItineraries } from "./actions/actions";

export default async function Home() {
  var preferenceNames = await GetAllPreferencesNames();
  if (!preferenceNames) preferenceNames = [];
  const itineraries = await GetAllItineraries();

  return (
    <main className="flex flex-col items-center">
      <MainForm preferenceNames={preferenceNames}></MainForm>
      <ItinerariesList itineraries={itineraries}></ItinerariesList>
    </main>
  );
}

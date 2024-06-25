import prisma from "./lib/prisma";
import MainForm from "./components/MainForm";
import { GetAllPreferencesNames } from "./actions/actions";

export default async function Home() {
  var preferenceNames = await GetAllPreferencesNames();
  if (!preferenceNames) preferenceNames = [];

  return (
    <main className="flex flex-col items-center">
      <MainForm preferenceNames={preferenceNames}></MainForm>
    </main>
  );
}

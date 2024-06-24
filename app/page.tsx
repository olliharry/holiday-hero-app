import prisma from "./lib/prisma";
import MainForm from "./components/MainForm";
import { GetAllPreferences } from "./actions/actions";

export default async function Home() {
  var preferenceNames = await GetAllPreferences();
  if (!preferenceNames) preferenceNames = [];

  return (
    <main className="flex flex-col items-center">
      <MainForm preferenceNames={preferenceNames}></MainForm>
    </main>
  );
}

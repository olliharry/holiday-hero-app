import prisma from "./lib/prisma";
import MainForm from "./components/MainForm";

export default async function Home() {
  return (
    <main className="flex flex-col items-center ">
      <MainForm></MainForm>
    </main>
  );
}

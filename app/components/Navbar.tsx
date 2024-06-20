import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="flex justify-between items-center w-full h-24 bg-primary font-extrabold text-2xl">
      <div>
        <Link href="/" className="buttonNavbar">
          HolidayHero
        </Link>
      </div>
      <div>
        <Link href="/prefrences" className="buttonNavbar">
          My Prefrences
        </Link>
        <Link href="/itineraries" className="buttonNavbar">
          My Itineraries
        </Link>
        <Link href="/help" className="buttonNavbar">
          help
        </Link>
      </div>
      {!session && (
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
        >
          <button className="buttonNavbar">Sign In </button>
        </form>
      )}
      {session && <UserMenu></UserMenu>}
    </div>
  );
}

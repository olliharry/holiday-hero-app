import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="navbar bg-base-300 shadow-xl" data-theme="cupcake">
      <div className="flex-1">
        <Link href="/" className="btn text-xl">
          Holiday Hero
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {!session && (
            <form
              action={async () => {
                "use server";
                await signIn();
              }}
            >
              <button className="btn">Sign In </button>
            </form>
          )}
          {session && (
            <Link href="/prefrences" className="btn">
              My Prefrences
            </Link>
          )}
          {session && <UserMenu></UserMenu>}
        </ul>
      </div>
    </div>
  );
}

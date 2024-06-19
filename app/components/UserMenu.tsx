import React from "react";
import Image from "next/image";
import { signOut, auth } from "@/auth";
import Link from "next/link";

export default async function UserMenu() {
  const session = await auth();
  

  return (
    <div className="flex items-center space-x-4">
      <p>{session?.user?.name}</p>

      {session?.user?.image && (
        <Image
          src={session?.user?.image}
          alt={"profile Picture"}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <div>
        <Link href="/settings" className="buttonNavbar">
          Account Settings
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="buttonNavbar">Sign Out</button>
        </form>
      </div>
    </div>
  );
}



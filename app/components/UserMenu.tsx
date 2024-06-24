import React from "react";
import Image from "next/image";
import { signOut, auth } from "@/auth";
import Link from "next/link";

export default async function UserMenu() {
  const session = await auth();

  return (
    <div className="flex items-center space-x-4">
      <p className="ml-4">{session?.user?.name}</p>

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
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="btn">Sign Out</button>
        </form>
      </div>
    </div>
  );
}

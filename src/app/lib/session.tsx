// src/app/lib/auth.js
'use server';

import { cookies } from "next/headers";


export async function getSession() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken");
  
  
  if (!authToken) {
    return null;
  }
  
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/session`, {
    headers: {
      Cookie: `authToken=${authToken.value}`,
    },
    cache: "no-store",
  });

  if (response.ok) {
    const session = await response.json();
    
    return session;
  }
  
  return null;
}

export async function deleteSession() {
  const cookieStore =await cookies();
  cookieStore.delete("authToken");
}
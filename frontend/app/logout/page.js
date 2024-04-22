"use client";
import React, { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);

  return redirect("/");
};

export default Logout;

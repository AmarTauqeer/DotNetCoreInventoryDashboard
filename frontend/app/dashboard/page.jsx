'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const [user, setUser] = useState([]);
  const router = useRouter();
  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("userInfo"));

    if (user!=null && user.accessToken) {
      setUser(user);
    }else{
      router.push("/")
    }
  }, []);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
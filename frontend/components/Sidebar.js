"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { VscListSelection } from "react-icons/vsc";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import LoginIcon from "../public/login.png";
import LoginOutIcon from "../public/signout.png";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter, redirect } from "next/navigation";

const Sidebar = () => {
  const [isOpen, SetIsOpen] = useState(true);
  const [user, setUser] = useState([]);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
  };

  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <div>
      <>
        <div className="flex justify-end" onClick={() => SetIsOpen(!isOpen)}>
          {!isOpen ? (
            <button
              className=" bg-white font-bold absolute mt-4 mr-0 border rounded-xl"
              onClick={() => SetIsOpen(!isOpen)}
            >
              <IoIosArrowForward size={20} />
            </button>
          ) : (
            <button
              className=" bg-white font-bold absolute mt-6 mr-0 border rounded-xl"
              onClick={() => SetIsOpen(!isOpen)}
            >
              <IoIosArrowBack size={20} />
            </button>
          )}
        </div>
        <aside
          className={
            isOpen
              ? "flex w-[18rem] h-[100vh] bg-cyan-400 p-1 transition-all 0.3s ease-linear"
              : "flex w-[5rem] h-[100vh] bg-cyan-400 p-1 transition-all 0.3s ease-linear"
          }
        >
          <div className="m-4 w-[16rem]">
            <div className="font-semibold mb-4 text-white">
              {isOpen && <h1 className="uppercase">Dashboard</h1>}
            </div>
            <ul className="list-none">
              {user && user.accessToken ? (
                <>
                  <li>
                    <Link
                      href="/"
                      className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Dashboard
                        </span>
                        <div className="mr-2">
                          <MdDashboard size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Dashboard</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/department"
                      className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Department
                        </span>
                        <div className="mr-2">
                          <VscListSelection size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Department</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/employee"
                      className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Employee
                        </span>
                        <div className="mr-2">
                          <VscListSelection size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Employee</span>}
                    </Link>
                  </li>
                  <li>
                    <a
                      onClick={() => handleLogout()}
                      href="/logout"
                      className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Logout
                        </span>
                        <div className="mr-2">
                          <Image
                            src={LoginOutIcon}
                            width={20}
                            height={20}
                            alt="login"
                          />
                        </div>
                      </div>
                      {isOpen && <span>Logout</span>}
                    </a>
                    {/* <div
                      className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
                      onClick={handleLogout}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                          onClick={() => handleLogout}
                        >
                          Logout
                        </span>
                        <div className="mr-2">
                          <Image
                            src={LoginOutIcon}
                            width={20}
                            height={20}
                            alt="logout"
                            onClick={handleLogout}
                          />
                        </div>

                        {isOpen && (
                          <span >Logout</span>
                        )}
                      </div>
                    </div> */}
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/"
                      className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Login
                        </span>
                        <div className="mr-2">
                          <Image
                            src={LoginIcon}
                            width={20}
                            height={20}
                            alt="login"
                          />
                        </div>
                      </div>
                      {isOpen && <span>Login</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Register
                        </span>
                        <div className="mr-2">
                          <BsPersonCircle size={20} color="green" />
                        </div>
                      </div>
                      {isOpen && <span>Register</span>}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </aside>
      </>
    </div>
  );
};

export default Sidebar;

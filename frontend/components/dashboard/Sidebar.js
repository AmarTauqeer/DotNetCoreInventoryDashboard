"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { VscListSelection } from "react-icons/vsc";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import LoginIcon from "../../public/login.png";
import LoginOutIcon from "../../public/signout.png";
import { FcDepartment } from "react-icons/fc";
import { FiUsers } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa6";
import { PiUsersThree } from "react-icons/pi";
import { LiaUsersSolid } from "react-icons/lia";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const [isOpen, SetIsOpen] = useState(true);
  const [user, setUser] = useState([]);
  const [navState, setNavState] = useState("/");
  const router = useRouter();
  const pathName=usePathname();
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
              ? "flex w-[18rem] h-[100vh] bg-white-800 border p-1 transition-all 0.3s ease-linear"
              : "flex w-[5rem] h-[100vh] bg-white-800 border p-1 transition-all 0.3s ease-linear"
          }
        >
          <div className="m-4 w-[16rem]">
            <div className="font-semibold mb-4 ">
              {isOpen && <h1 className="uppercase">Gondal Industries Inventory Dashboard</h1>}
            </div>
            {/* <div>{user && <span>{user.name}</span>}</div> */}
            <ul className="list-none">
              {user && user.accessToken ? (
                <>
                {/* {console.log(pathName)} */}
                <hr />
                  <li>
                    <Link
                      href="/"
                      className={`${pathName=="/dashboard"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm  rounded-md absolute left-1/2 
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
                      href="/dashboard/category"
                      className={`${pathName=="/dashboard/category"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Category
                        </span>
                        <div className="mr-2">
                          <BiCategory size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Category</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/product"
                      className={`${pathName=="/dashboard/product"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Product
                        </span>
                        <div className="mr-2">
                          <FaProductHunt size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Product</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/customer"
                      className={`${pathName=="/dashboard/customer"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Customer
                        </span>
                        <div className="mr-2">
                          <PiUsersThree size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Customer</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/supplier"
                      className={`${pathName=="/dashboard/supplier"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Supplier
                        </span>
                        <div className="mr-2">
                          <LiaUsersSolid size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Supplier</span>}
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link
                      href="/dashboard/purchase/purchaseMaster"
                      className={`${pathName=="/dashboard/purchase/purchaseMaster"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Purchase Invoice
                        </span>
                        <div className="mr-2">
                          <LiaFileInvoiceDollarSolid size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Purchase Invoice</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/sale"
                      className={`${pathName=="/dashboard/sale"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Sale Invoice
                        </span>
                        <div className="mr-2">
                          <FaFileInvoiceDollar size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Sale Invoice</span>}
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link
                      href="/dashboard/department"
                      className={`${pathName=="/dashboard/department"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Department
                        </span>
                        <div className="mr-2">
                          <FcDepartment size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Department</span>}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/employee"
                      className={`${pathName=="/dashboard/employee"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
                        >
                          Employee
                        </span>
                        <div className="mr-2">
                          <FiUsers size={20} />
                        </div>
                      </div>
                      {isOpen && <span>Employee</span>}
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <a
                      onClick={() => handleLogout()}
                      href="/logout"
                      className={`${pathName=="/dashboard/logout"?"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md bg-black text-white":"flex items-center text-sm decoration-0 py-2 px-2 mb-1 rounded-md"}`}
                    >
                      <div className="group flex relative">
                        <span
                          className="group-hover:opacity-100 transition-opacity bg-[#F4F5FA] px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
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
                  <hr />
                </>
              ) : (
                ""
    //             <>
    //               <li>
    //                 <Link
    //                   href="/"
    //                   className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
    //                 >
    //                   <div className="group flex relative">
    //                     <span
    //                       className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    // -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
    //                     >
    //                       Login
    //                     </span>
    //                     <div className="mr-2">
    //                       <Image
    //                         src={LoginIcon}
    //                         width={20}
    //                         height={20}
    //                         alt="login"
    //                       />
    //                     </div>
    //                   </div>
    //                   {isOpen && <span>Login</span>}
    //                 </Link>
    //               </li>
    //               <li>
    //                 <Link
    //                   href="/"
    //                   className="flex items-center text-sm decoration-0 py-2 px-2 bg-[#f3f4f6] mb-1 rounded-md hover:bg-cyan-600 hover:text-cyan-200"
    //                 >
    //                   <div className="group flex relative">
    //                     <span
    //                       className="group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
    // -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto"
    //                     >
    //                       Register
    //                     </span>
    //                     <div className="mr-2">
    //                       <BsPersonCircle size={20} color="green" />
    //                     </div>
    //                   </div>
    //                   {isOpen && <span>Register</span>}
    //                 </Link>
    //               </li>
    //             </>
              )}
            </ul>
          </div>
        </aside>
      </>
    </div>
  );
};

export default Sidebar;

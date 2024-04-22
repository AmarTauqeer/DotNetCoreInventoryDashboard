"use client";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
import DataTable from "react-data-table-component";
import GeneratePDF from "@/components/GeneratePDF";
import CustomStyles from "@/components/CustomStyles";
import Loading from "./loading";
import { redirect, useRouter } from "next/navigation";

const EmployeeList = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const [filterEmployee, setFilterEmployee] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  const handleEdit = (id) => {
    router.push(`/employee/${id}`);
  };
  const handleAdd = () => {
    router.push(`/employee/0`);
  };

  const columns = [
    {
      name: "ID#",
      selector: (row) => row.employeeId,
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.employeeName,
      sortable: true,
      width: "300px",
    },
    {
      name: "Department",
      selector: (row) => {
        if (employeeData !== undefined) {
          if (departmentData !== undefined && departmentData.length > 0) {
            const filter = departmentData.filter(
              (x) => x.departmentId === row.departmentId
            );
            return filter[0].departmentName;
          }
        }
      },
      sortable: true,
      width: "300px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "300px",
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
      width: "300px",
    },
    {
      name: "ACTIONS",
      selector: (row) => (
        <div className="flex items-center justify-center">
          <div className="d-flex flex-row align-items-center">
            <div>
              <FiEdit
                className="m-1 text-cyan-500"
                onClick={() => handleEdit(row.employeeId)}
                size={20}
              />
            </div>
          </div>
          <div className="d-flex flex-row align-items-center">
            <div>
              <RiDeleteBinLine
                size={22}
                className="m-1 text-rose-700"
                onClick={() => handleDelete(row.employeeId)}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleChange = (e) => {
    const filtered = employeeData.filter((x) => {
      return x.employeeName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    // console.log(filtered)
    setFilterEmployee(filtered);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${url}/api/employee/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const status = await response.status;

    if (status == 204) {
      getEmployee(accessToken);
      toast.success("Record is deleted successfully.");
    }
  };

  const getEmployee = async (token) => {
    const response = await fetch(`${url}/api/employee`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setEmployeeData(res);
      setIsLoading(false);
    }
  };
  const getDepartment = async (token) => {
    const response = await fetch(`${url}/api/department`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();

    if (res) {
      setDepartmentData(res);
      setIsLoading(false);
    }
  };

  const checkExpiration = () => {
    let tokenTime = new Date(localStorage.getItem("tokenTime"));
    const now = new Date();
    const elapsedTime = new Date(now - tokenTime);
    // console.log(elapsedTime);
    const mint = elapsedTime.getMinutes();
    const seconds = elapsedTime.getSeconds();
    const totalElapsedSeconds = parseInt(mint * 60 + seconds);
    // console.log(totalElapsedSeconds);
    if (totalElapsedSeconds > 3600) {
      localStorage.removeItem("tokenTime");
      localStorage.removeItem("userInfo");
      setExpire(!expire);
    }
  };
  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getEmployee(user.accessToken);
      getDepartment(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
    {expire && redirect("/")}
      <div className="flex flex-col items-center justify-center">
        <h3 className="uppercase text-center font-semibold text-2xl mb-6 mt-6">
          Employee List
        </h3>
        <div
          className="flex items-center bg-white border rounded-xl w-80 md:w-[600px] lg:w-[600px]  
  m-2 md:m-0 lg:m-0"
        >
          <input
            type="text"
            className="py-2 rounded-lg px-2 w-full outline-none"
            placeholder="Enter employee name to search"
            // value={search}
            onChange={handleChange}
          />
          {/* <span className="mr-2">
            <FiSearch size={25} />
          </span> */}
        </div>

        <div className="container m-5">
          <span
            className="flex items-center text-semibold"
          >
            <div className="text-green-700">
              <IoIosAddCircleOutline size={30} onClick={() => handleAdd()} />
            </div>
            <h4 className="ml-2" onClick={() => handleAdd()}>
              Add Employee
            </h4>
          </span>
        </div>
        <div className="container">
          <div className="flex mb-2">
            <GeneratePDF data={employeeData} id="employee" />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {employeeData.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={
                    filterEmployee.length >= 1 ? filterEmployee : employeeData
                  }
                  pagination
                  customStyles={CustomStyles}
                  dense
                  fixedHeader
                  fixedHeaderScrollHeight="400px"
                  theme="solarized"
                  progressPending={isLoading}
                />
              ) : (
                "There are no records to display"
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeList;

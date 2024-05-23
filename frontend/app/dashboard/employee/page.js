"use client";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import DataTable from "react-data-table-component";
import GeneratePDF from "@/components/GeneratePDF";
import CustomStyles from "@/components/CustomStyles";
import Loading from "./loading";
import { redirect, useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const EmployeeList = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const [filterEmployee, setFilterEmployee] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleteSelected, setDeleteSelected] = useState(false);

  const handleEdit = (id) => {
    router.push(`/dashboard/employee/${id}`);
  };
  const handleAdd = () => {
    router.push(`/dashboard/employee/0`);
  };

  const columns = [
    {
      name: "Avtar",
      selector: (row) => {
        const nameParts = row.employeeName.split(" ");
        const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
        const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";
        const nameInitial = nameParts[2]? nameParts[2][0]:"";
        const initialsAll =firstNameInitial+lastNameInitial+nameInitial;
        // setInitials(firstNameInitial+lastNameInitial+nameInitial);
        return <div className="flex rounded-full py-2 px-2 bg-sky-700 text-white text-sm">{initialsAll}</div>
      },
      sortable: true,
      width: "10%",
    },
    {
      name: "NAME",
      selector: (row) => <div className="font-bold">{row.employeeName}</div>,
      sortable: true,
      width: "20%",
    },
    {
      name: "DEPARTMENT",
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
      width: "15%",
    },
    {
      name: "EMAIL",
      selector: (row) => row.email,
      sortable: true,
      width: "20%",
    },
    {
      name: "CITY",
      selector: (row) => row.city,
      sortable: true,
      width: "10%",
    },
    {
      name: "ACTIONS",
      
      selector: (row) => (
        <div className="flex items-center justify-center">
          <div className="d-flex flex-row align-items-center cursor-pointer">
            <div>
              <MdModeEdit
                className="m-1 text-yellow-500"
                onClick={() => handleEdit(row.employeeId)}
                size={22}
              />
            </div>
          </div>
          <div className="d-flex flex-row align-items-center cursor-pointer">
            <div>
              <MdDeleteForever
                size={22}
                className="m-1 text-red-700"
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

  const handleChangeRowsChange = (rows) => {
    let idArr = [];
    rows.selectedRows.forEach((element) => {
      idArr.push(element.employeeId);
    });
    // console.log(idArr.length);

    if (idArr.length > 0) {
      setDeleteSelected(true);
    } else {
      setDeleteSelected(false);
    }
    setSelected(idArr);
  };

  const handleDeleteSelected = () => {
    console.log("est");
    for (let i = 0; i < selected.length; i++) {
      const element = selected[i];
      if (element) {
        handleDelete(element);
      }
    }
    setSelected([])
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
      <div className="container">
        <h3 className="font-semibold text-2xl mb-6 mt-6">Employee List</h3>
        <div className="flex mb-2 justify-between">
          <div
            className="flex items-center bg-white w-80 md:w-[600px] lg:w-[600px]  
m-2 md:m-0 lg:m-0"
          >
            <input
              type="text"
              className="lg:py-2 md:py-2 py-1 border rounded-lg px-2 w-full outline-none text-md"
              placeholder="Search here."
              // value={search}
              onChange={handleChange}
            />
            {/* <span>
              <FiSearch size={30} />
            </span> */}
          </div>
          <div className="flex items-center justify-between">
            <div className="py-4 px-4">
              <span className="text-semibold">
                <div className="text-green-700 cursor-pointer">
                  <IoIosAddCircleOutline
                    size={30}
                    onClick={() => handleAdd()}
                  />
                </div>
                {/* <h4 onClick={() => handleAdd()}>
                Add Department
              </h4> */}
              </span>
            </div>
            <div className="py-4">
              <GeneratePDF data={employeeData} id="employee" />
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
           {selected.length > 0 && (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleDeleteSelected()}
                >
                  <div className="text-red-700">Delete Selected</div>
                  <div>
                    <MdDeleteForever size={28} className="m-1 text-red-700" />
                  </div>
                </div>
              )}
            {employeeData.length > 0 ? (
              <div className="border">
                <DataTable
                  columns={columns}
                  data={
                    filterEmployee.length >= 1
                      ? filterEmployee
                      : employeeData
                  }
                  selectableRows
                  onSelectedRowsChange={handleChangeRowsChange}
                  pagination
                  customStyles={CustomStyles}
                  // highlightOnHover
                  dense
                  // fixedHeader={!showModal && fixedHeader}
                  fixedHeaderScrollHeight="400px"
                  theme="solarized"
                  progressPending={isLoading}
                />
              </div>
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

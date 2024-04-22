"use client";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import Loading from "../loading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

import DateTimePicker from "react-datetime-picker";

const AddEditEmployee = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const { id } = useParams() || 0;
  const [value, setValues] = useState(new Date());
  const [valueDOB, setValuesDOB] = useState(new Date());
  const [employeeData, setEmployeeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      employeeName: "",
      email: "",
      departmentId: 1,
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      country: "",
    },
  });

  const handleCancel = () => {
    router.push(`/employee`);
  };

  const onSubmit = async (data) => {
    const postData = {
      employeeName: data.employeeName,
      departmentId: data.departmentId,
      phone: data.phone,
      email: data.email,
      address: data.address,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      createAt: value,
      dob: valueDOB,
    };
    // console.log(postData);

    var response = [];

    if (id != 0) {
      response = await fetch(`${url}/api/employee/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    } else {
      response = await fetch(`${url}/api/employee/${postData.departmentId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    }

    const res = await response.json();

    if (res) {
      if (id != 0) {
        toast.success("Record has been updated successfully.");
      } else {
        toast.success("Record has been inserted successfully.");
      }
      router.push("/employee");
      return true;
    } else {
      toast.error("There are some errors to insert/update the record.");
      return false;
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
      if (id != 0) {
        const getEmployee = async (id) => {
          const response = await fetch(`${url}/api/employee/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          const res = await response.json();
          if (res) {
            setEmployeeData(res);
            setValue("departmentId", res.departmentId);
            setValue("employeeName", res.employeeName);
            setValue("email", res.email);
            setValue("phone", res.phone);
            setValue("address", res.address);
            setValue("postalCode", res.postalCode);
            setValue("city", res.city);
            setValue("country", res.country);
            setIsLoading(false);

            setValues(res.createAt);
            setValuesDOB(res.dob);
          }
        };

        getEmployee(id);
      } else {
        setIsLoading(false);
      }
      getDepartment(user.accessToken);
    } else {
      redirect("/");
    }
  }, [id]);

  return (
    <>
    {expire && redirect("/")}
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <IoArrowBackCircleOutline
              size={40}
              onClick={handleCancel}
              color="#0ea5e9"
            />
          </div>

          <div className="grid grid-cols-1  mb-2">
            <h1 className="font-bold text-med flex justify-center items-center mt-5 mb-10 lg:text-2xl">
              Employee Information
            </h1>
          </div>
          <div className="grid max-w-[1200px] lg:grid-cols-4 lg:ml-[20%] lg:mr-[20%] sm:grid-cols-1  max-auto">
            <div className="flex items-center">
              <span className="font-semibold py-2">Date</span>
            </div>
            <div className="flex items-center">
              <DateTimePicker
                onChange={setValues}
                value={value}
                className="outline-none py-1 bg-white"
              />
            </div>
            <div className="flex items-center">
              <span className="font-semibold py-2">DOB</span>
            </div>
            <div className="flex items-center">
              <DateTimePicker
                onChange={setValuesDOB}
                value={valueDOB}
                className="outline-none py-1 bg-white"
              />
            </div>
            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">Employee Name</span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="employeeName"
                className={
                  errors.employeeName?.type === "required"
                    ? "py-2 px-1 outline-none border border-rose-500 w-[240px] mt-2"
                    : "py-2 px-1 outline-none border w-[240px] mt-2"
                }
                placeholder="enter employee name"
                {...register("employeeName", {
                  required: true,
                })}
              />
            </div>

            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">Department</span>
            </div>
            <div className="flex items-center">
              <select
                className={
                  errors.departmentId?.type == "required"
                    ? "px-1 py-3 outline-none border border-rose-500 bg-white w-[240px] mt-2"
                    : "px-1 py-3 outline-none border bg-white w-[240px] mt-2"
                }
                {...register("departmentId", {
                  required: "Department is required.",
                })}
              >
                {departmentData !== undefined &&
                  departmentData.map((x) => {
                    return (
                      <>
                        <option value={x.departmentId} key={x.departmentId}>
                          {x.departmentName}
                        </option>
                      </>
                    );
                  })}
              </select>
            </div>

            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">Email</span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="email"
                className={
                  errors.email?.type === "required"
                    ? "px-1 py-2 outline-none border w-[240px] mt-2 border-rose-400"
                    : "px-1 py-2 outline-none border w-[240px] mt-2"
                }
                placeholder="enter email"
                {...register("email", {
                  required: true,
                })}
              />
            </div>
            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">Phone</span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="phone"
                className="px-1 py-2 outline-none border w-[240px] mt-2"
                placeholder="enter phone"
                {...register("phone", {
                  required: false,
                })}
              />
            </div>
            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">Address</span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="address"
                className={
                  errors.address?.type === "required"
                    ? "px-1 py-2 outline-none border border-rose-500 w-[240px] mt-2"
                    : "px-1 py-2 outline-none border  w-[240px] mt-2"
                }
                placeholder="enter employee address"
                {...register("address", {
                  required: true,
                })}
              />
            </div>
            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">Postal Code</span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="postalCode"
                className="px-1 py-2 outline-none border w-[240px] mt-2"
                placeholder="enter postal code"
                {...register("postalCode", {
                  required: true,
                })}
              />
            </div>
            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">City</span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="city"
                className="px-1 py-2 outline-none border w-[240px] mt-2"
                placeholder="enter employee city"
                {...register("city", {
                  required: false,
                })}
              />
            </div>
            <div className="flex items-center mt-2">
              <span className="font-semibold py-2">Country</span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                autoComplete="country"
                className="px-1 py-2 outline-none border w-[240px] mt-2"
                placeholder="enter employee country"
                {...register("country", {
                  required: false,
                })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mt-5">
            <div className="lg:flex lg:justify-center lg:items-start">
              <button
                onClick={handleSubmit(onSubmit)}
                type="button"
                className="rounded-md bg-cyan-600 px-3 py-3 text-sm font-semibold 
              text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 
              focus-visible:outline-offset-2 focus-visible:outline-cyan-600 lg:w-[900px] w-[240px]"
              >
                Save
              </button>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-6 md:gap-2 lg:grid-cols-6 lg:gap-2 mb-2">
               
                
                {errors && errors.employeeName?.type === "required" && (
                  <div className="text-rose-400">
                    {errors.employeeName?.type === "required" &&
                      "Employee name is required."}
                  </div>
                )}
               
                <div className="ml-2 md:ml-0">
                  
                </div>
                {errors && errors.departmentId?.type === "required" && (
                  <div className="text-rose-400">
                    {errors.departmentId?.message}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 md:gap-2 lg:grid-cols-6 lg:gap-2 mb-2">

                {errors && errors.email?.type === "required" && (
                  <div className="text-rose-400">
                    {errors.email?.type === "required" && "Email is required."}
                  </div>
                )}

              
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 md:gap-2 lg:grid-cols-6 lg:gap-2 mb-2">


                {errors && errors.address?.type === "required" && (
                  <div className="text-rose-400">
                    {errors.address?.type === "required" &&
                      "Address is required."}
                  </div>
                )}

               
                {errors && errors.postalCode?.type === "required" && (
                  <div className="text-rose-400">
                    {errors.postalCode?.type === "required" &&
                      "Postal code is required."}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 md:gap-2 lg:grid-cols-6 lg:gap-2 mb-2">
               
                </div>
                <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
                  Country
                </span>
                <div className="flex items-center">
                  <input
                    type="text"
                    autoComplete="country"
                    className="px-2 py-2 ml-2 md:ml-0 outline-none border w-60 md:w-[500px]"
                    placeholder="enter country name"
                    {...register("country", {
                      required: false,
                    })}
                  />
                </div>
              </div>

              
              </div> */}
        </form>
      )}
    </>
  );
};

export default AddEditEmployee;

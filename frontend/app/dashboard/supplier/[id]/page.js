"use client";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import Loading from "../loading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

import DateTimePicker from "react-datetime-picker";

const AddEditSupplier = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const { id } = useParams() || 0;
  const [value, setValues] = useState(new Date());
  const [valueDOB, setValuesDOB] = useState(new Date());
  const [supplierData, setSupplierData] = useState([]);
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
      name: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      country: "",
    },
  });

  const handleCancel = () => {
    router.push(`/dashboard/supplier`);
  };

  const onSubmit = async (data) => {
    const postData = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      createAt: value,
    };
    // console.log(postData);

    var response = [];

    if (id != 0) {
      response = await fetch(`${url}/api/supplier/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    } else {
      response = await fetch(`${url}/api/supplier`, {
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
      router.push("/dashboard/supplier");
      return true;
    } else {
      toast.error("There are some errors to insert/update the record.");
      return false;
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
        const getSupplier = async (id) => {
          const response = await fetch(`${url}/api/supplier/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          const res = await response.json();
          if (res) {
            setSupplierData(res);
            setValue("name", res.name);
            setValue("email", res.email);
            setValue("phone", res.phone);
            setValue("address", res.address);
            setValue("postalCode", res.postalCode);
            setValue("city", res.city);
            setValue("country", res.country);
            setIsLoading(false);

            setValues(res.createAt);
          }
        };

        getSupplier(id);
      } else {
        setIsLoading(false);
      }
      
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
        
        <div className="flex w-full">
          <div className="mb-8">
            <IoArrowBackCircleOutline
              size={40}
              onClick={handleCancel}
              color="#0ea5e9"
            />
          </div>
          <br />
          <form
            className="flex flex-col mt-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="font-semibold text-md flex items-center mt-5 mb-5 md:text-2xl">
              Supplier Information
            </h1>
            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Date
            </span>
            <div className=" py-2">
              <DateTimePicker
                onChange={setValues}
                value={value}
                className="outline-none bg-white"
              />
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Supplier Name
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="name"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
                placeholder="Supplier name"
                {...register("name", {
                  required: true,
                })}
              />
            </div>
            <div className="text-rose-400">
              {errors.name?.type === "required" &&
                "Supplier name is required."}
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Email
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="email"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
                placeholder="email"
                {...register("email", {
                  required: true,
                })}
              />
            </div>
            <div className="text-rose-400">
              {errors.email?.type === "required" && "Email is required."}
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Phone
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="phone"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
                placeholder="phone"
                {...register("phone", {
                  required: false,
                })}
              />
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Address
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="address"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
                placeholder="Address"
                {...register("address", {
                  required: false,
                })}
              />
            </div>

            {/* <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Postal Code
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="postalCode"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
                placeholder="postalCode"
                {...register("postalCode", {
                  required: false,
                })}
              />
            </div> */}

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              City
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="city"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
                placeholder="city"
                {...register("city", {
                  required: false,
                })}
              />
            </div>
            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Country
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="phone"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
                placeholder="country"
                {...register("country", {
                  required: false,
                })}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-4">
              <button
                onClick={handleSubmit(onSubmit)}
                type="button"
                className="rounded-md bg-cyan-600 px-3 py-4 text-lg font-semibold 
        text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-cyan-600  mb-4 w-full"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddEditSupplier;

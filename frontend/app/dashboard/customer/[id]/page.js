"use client";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import Loading from "../loading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

import DateTimePicker from "react-datetime-picker";

const AddEditCustomer = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const { id } = useParams() || 0;
  const [value, setValues] = useState(new Date());
  const [customerData, setCustomerData] = useState([]);
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
    router.push(`/dashboard/customer`);
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
      response = await fetch(`${url}/api/customer/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    } else {
      response = await fetch(`${url}/api/customer`, {
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
      router.push("/dashboard/customer");
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
        const getCustomer = async (id) => {
          const response = await fetch(`${url}/api/customer/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          const res = await response.json();
          if (res) {
            setCustomerData(res);
            setValue("name", res.name);
            setValue("email", res.email);
            setValue("phone", res.phone);
            setValue("address", res.address);
            // setValue("postalCode", res.postalCode);
            setValue("city", res.city);
            setValue("country", res.country);
            setIsLoading(false);

            setValues(res.createAt);
          }
        };

        getCustomer(id);
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
        <>
          <div className="mb-2">
            <IoArrowBackCircleOutline
              size={30}
              onClick={handleCancel}
              color="#0ea5e9"
            />
          </div>
          <div className="flex justify-center">
            <h1 className="font-semibold text-md flex items-center mt-5 mb-5 md:text-2xl">
              Customer Information
            </h1>
          </div>

          <form
            className="flex justify-center mt-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-center">
              <span className="col-span-1 font-semibold md:px-0 md:my-0">
                Date
              </span>
              <div className="col-span-4 py-1 md:py-2 lg:py-2">
                <div className="text-md">
                  <DateTimePicker onChange={setValues} value={value} />
                </div>
              </div>
              <span className="col-span-1 font-semibold">Customer Name</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="name"
                  className={errors.name?.type=="required"?"px-2 py-2  outline-none border border-rose-400 w-full":"px-2 py-2  outline-none border w-full"}
                  placeholder="customer name"
                  {...register("name", {
                    required: true,
                  })}
                />
              </div>
              <span className="col-span-1 font-semibold">Email</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="email"
                  className={errors.email?.type=="required"?"px-2 py-2  outline-none border border-rose-400 w-full":"px-2 py-2  outline-none border w-full"}
                  placeholder="email"
                  {...register("email", {
                    required: true,
                  })}
                />
              </div>
              <span className="col-span-1 font-semibold">Phone</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="phone"
                  className="px-2 py-2  outline-none border w-full"
                  placeholder="phone"
                  {...register("phone", {
                    required: false,
                  })}
                />
              </div>

              <span className="col-span-1 font-semibold">Address</span>
              <div className="col-span-4 md:col-span-9">
                <input
                  type="text"
                  autoComplete="address"
                  className="px-2 py-2  outline-none border w-full"
                  placeholder="address"
                  {...register("address", {
                    required: false,
                  })}
                />
              </div>
              <span className="col-span-1 font-semibold">City</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="city"
                  className="px-2 py-2  outline-none border w-full"
                  placeholder="city"
                  {...register("city", {
                    required: false,
                  })}
                />
              </div>
              <span className="col-span-1 font-semibold">Country</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="country"
                  className="px-2 py-2  outline-none border w-full"
                  placeholder="country"
                  {...register("country", {
                    required: false,
                  })}
                />
              </div>
              <span className="col-span-1 font-semibold">&nbsp;</span>
              <div className="col-span-2 flex items-center justify-end gap-x-4">
                <button
                  onClick={handleSubmit(onSubmit)}
                  type="button"
                  className="rounded-md bg-cyan-600 px-3 py-2 text-md font-semibold 
        text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-cyan-600  mb-4 w-full"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="rounded-md bg-blue-600 px-3 py-2 text-md font-semibold 
        text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-blue-600  mb-4 w-full"
                >
                  Cancel
                </button>
              </div>
            </div>

          </form>
        </>
        
        // <div className="flex w-full">
        //   <div className="mb-8">
        //     <IoArrowBackCircleOutline
        //       size={40}
        //       onClick={handleCancel}
        //       color="#0ea5e9"
        //     />
        //   </div>
        //   <br />
        //   <form
        //     className="flex flex-col mt-10"
        //     onSubmit={handleSubmit(onSubmit)}
        //   >
        //     <h1 className="font-semibold text-md flex items-center mt-5 mb-5 md:text-2xl">
        //       Customer Information
        //     </h1>
        //     <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
        //       Date
        //     </span>
        //     <div className=" py-2">
        //       <DateTimePicker
        //         onChange={setValues}
        //         value={value}
        //         className="outline-none bg-white"
        //       />
        //     </div>

        //     <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
        //       Customer Name
        //     </span>
        //     <div className="flex items-center py-3">
        //       <input
        //         type="text"
        //         autoComplete="name"
        //         className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
        //         placeholder="Customer name"
        //         {...register("name", {
        //           required: true,
        //         })}
        //       />
        //     </div>
        //     <div className="text-rose-400">
        //       {errors.name?.type === "required" &&
        //         "Customer name is required."}
        //     </div>

        //     <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
        //       Email
        //     </span>
        //     <div className="flex items-center py-3">
        //       <input
        //         type="text"
        //         autoComplete="email"
        //         className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
        //         placeholder="email"
        //         {...register("email", {
        //           required: true,
        //         })}
        //       />
        //     </div>
        //     <div className="text-rose-400">
        //       {errors.email?.type === "required" && "Email is required."}
        //     </div>

        //     <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
        //       Phone
        //     </span>
        //     <div className="flex items-center py-3">
        //       <input
        //         type="text"
        //         autoComplete="phone"
        //         className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
        //         placeholder="phone"
        //         {...register("phone", {
        //           required: false,
        //         })}
        //       />
        //     </div>

        //     <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
        //       Address
        //     </span>
        //     <div className="flex items-center py-3">
        //       <input
        //         type="text"
        //         autoComplete="address"
        //         className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
        //         placeholder="Address"
        //         {...register("address", {
        //           required: false,
        //         })}
        //       />
        //     </div>

        //     <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
        //       City
        //     </span>
        //     <div className="flex items-center py-3">
        //       <input
        //         type="text"
        //         autoComplete="city"
        //         className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
        //         placeholder="city"
        //         {...register("city", {
        //           required: false,
        //         })}
        //       />
        //     </div>
        //     <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
        //       Country
        //     </span>
        //     <div className="flex items-center py-3">
        //       <input
        //         type="text"
        //         autoComplete="phone"
        //         className="px-2 py-4 ml-2 md:ml-0 outline-none border border-solid border-gray-700 rounded w-60 md:w-[500px]"
        //         placeholder="country"
        //         {...register("country", {
        //           required: false,
        //         })}
        //       />
        //     </div>

        //     <div className="mt-6 flex items-center justify-end gap-x-4">
        //       <button
        //         onClick={handleSubmit(onSubmit)}
        //         type="button"
        //         className="rounded-md bg-cyan-600 px-3 py-4 text-lg font-semibold 
        // text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 
        // focus-visible:outline-offset-2 focus-visible:outline-cyan-600  mb-4 w-full"
        //       >
        //         Save
        //       </button>
        //     </div>
        //   </form>
        // </div>
      )}
    </>
  );
};

export default AddEditCustomer;

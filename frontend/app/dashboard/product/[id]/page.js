"use client";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import Loading from "../loading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

import DateTimePicker from "react-datetime-picker";

const AddEditProduct = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const { id } = useParams() || 0;
  const [value, setValues] = useState(new Date());
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
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
      description: "",
      categoryId: 1,
      purchaseRate: "",
      SaleRate: "",
    },
  });

  const handleCancel = () => {
    router.push(`/dashboard/product`);
  };

  const onSubmit = async (data) => {
    const postData = {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      purchaseRate: data.purchaseRate,
      saleRate: data.saleRate,
      createAt: value,
    };
    // console.log(postData);

    var response = [];

    if (id != 0) {
      response = await fetch(`${url}/api/product/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    } else {
      response = await fetch(`${url}/api/product/${postData.categoryId}`, {
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
      router.push("/dashboard/product");
      return true;
    } else {
      toast.error("There are some errors to insert/update the record.");
      return false;
    }
  };
  const getCategory = async (token) => {
    const response = await fetch(`${url}/api/category`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();

    if (res) {
      setCategoryData(res);
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
        const getProduct = async (id) => {
          const response = await fetch(`${url}/api/product/${id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          const res = await response.json();
          if (res) {
            setProductData(res);
            setValue("categoryId", res.categoryId);
            setValue("name", res.name);
            setValue("description", res.description);
            setValue("purchaseRate", res.purchaseRate);
            setValue("saleRate", res.saleRate);
            setIsLoading(false);

            setValues(res.createAt);
          }
        };

        getProduct(id);
      } else {
        setIsLoading(false);
      }
      getCategory(user.accessToken);
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
              Product Information
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
              <span className="col-span-1 font-semibold">Category Name</span>
              <div className="col-span-4 py-1 md:py-2 lg:py-2">
                <select
                  className={
                    errors.categoryId?.type == "required"
                      ? "py-2 outline-none border border-rose-500 bg-white w-full  mt-2"
                      : "py-2 outline-none border bg-white w-full mt-2"
                  }
                  {...register("categoryId", {
                    required: "Category is required.",
                  })}
                >
                  {categoryData !== undefined &&
                    categoryData.map((x) => {
                      return (
                        <>
                          <option value={x.categoryId} key={x.categoryId}>
                            {x.name}
                          </option>
                        </>
                      );
                    })}
                </select>
              </div>
              <span className="col-span-1 font-semibold">Product Name</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="name"
                  className={errors.name?.type=="required"?"px-2 py-2  outline-none border border-rose-400 w-full":"px-2 py-2  outline-none border w-full"}
                  placeholder="product name"
                  {...register("name", {
                    required: true,
                  })}
                />
              </div>
              <span className="col-span-1 font-semibold">Description</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="description"
                  className={errors.description?.type=="required"?"px-2 py-2  outline-none border border-rose-400 w-full":"px-2 py-2  outline-none border w-full"}
                  placeholder="description"
                  {...register("description", {
                    required: true,
                  })}
                />
              </div>
              <span className="col-span-1 font-semibold">Purchase Rate</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="purchaseRate"
                  className="px-2 py-2  outline-none border w-full"
                  placeholder="purchaseRate"
                  {...register("purchaseRate", {
                    required: false,
                  })}
                />
              </div>

              <span className="col-span-1 font-semibold">Sale Rate</span>
              <div className="col-span-4">
                <input
                  type="text"
                  autoComplete="saleRate"
                  className="px-2 py-2  outline-none border w-full"
                  placeholder="saleRate"
                  {...register("saleRate", {
                    required: false,
                  })}
                />
              </div>
              <div className="col-span-2 mt-6 flex items-center justify-end gap-x-4">
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
      )}
    </>
  );
};

export default AddEditProduct;

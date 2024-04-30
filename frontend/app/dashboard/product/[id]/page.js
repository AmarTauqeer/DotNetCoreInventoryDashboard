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
              Product Information
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
              Category Name
            </span>
            <div className="flex items-center py-3">
              <select
                className={
                  errors.categoryId?.type == "required"
                    ? "px-1 py-4 outline-none border border-rose-500 bg-white w-full  mt-2"
                    : "px-1 py-4 outline-none border bg-white w-full mt-2"
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
            <div className="text-rose-400">
              {errors.categoryId?.type === "required" &&
                "Category name is required."}
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Product Name
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="name"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border w-60 md:w-[500px]"
                placeholder="product name"
                {...register("name", {
                  required: true,
                })}
              />
            </div>
            <div className="text-rose-400">
              {errors.name?.type === "required" && "Product name is required."}
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Description
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="description"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border w-60 md:w-[500px]"
                placeholder="description"
                {...register("description", {
                  required: true,
                })}
              />
            </div>
            <div className="text-rose-400">
              {errors.description?.type === "required" &&
                "Description is required."}
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Purchase Rate
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="purchaseRate"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border w-60 md:w-[500px]"
                placeholder="Purchase rate"
                {...register("purchaseRate", {
                  required: false,
                })}
              />
            </div>

            <span className="font-semibold px-2 py-2 md:px-0 md:my-0">
              Sale Rate
            </span>
            <div className="flex items-center py-3">
              <input
                type="text"
                autoComplete="saleRate"
                className="px-2 py-4 ml-2 md:ml-0 outline-none border w-60 md:w-[500px]"
                placeholder="Sale rate"
                {...register("saleRate", {
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

export default AddEditProduct;

"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "../loading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "sonner";
import DateTimePicker from "react-datetime-picker";

const AddEditDeaprtment = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const { id } = useParams() || 0;
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValues] = useState(new Date());
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      createAt: new Date(),
      departmentName: "",
    },
  });

  const handleCancel = () => {
    router.push(`/dashboard/department`);
  };

  const onSubmit = async (data) => {
    const postData = {
      createAt: value,
      departmentName: data.departmentName,
    };

    var response = [];
    console.log(accessToken);

    if (id != 0) {
      response = await fetch(`${url}/api/department/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
    } else {
      response = await fetch(`${url}/api/department`, {
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
      router.push("/dashboard/department");
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
    setAccessToken(user.accessToken);

    if (id != 0) {
      const getDepartment = async (id) => {
        const response = await fetch(`${url}/api/department/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        const res = await response.json();
        if (res) {
          setDepartmentData(res);
          setValue("departmentName", res.departmentName);
          setIsLoading(false);
          setValues(res.createAt);
        }
      };

      getDepartment(id);
    } else {
      setIsLoading(false);
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

          <div>
            <form className="flex flex-col mt-10" onSubmit={handleSubmit(onSubmit)}>
              <h1 className="font-semibold text-md flex items-center mt-5 mb-5 md:text-2xl">
                Department Information
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
                Department Name
              </span>
              <div className="flex items-center py-3">
                <input
                  type="text"
                  autoComplete="departmentName"
                  className="px-2 py-4 ml-2 md:ml-0 outline-none border w-60 md:w-[500px]"
                  placeholder="enter department name"
                  {...register("departmentName", {
                    required: true,
                  })}
                />
              </div>
              <div className="text-rose-400">
                {errors.departmentName?.type === "required" &&
                  "Department name is required."}
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
        </div>
      )}
    </>
  );
};

export default AddEditDeaprtment;

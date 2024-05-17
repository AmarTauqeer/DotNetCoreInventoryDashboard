"use client";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PurchaseDetail from "@/components/PurchaseDetail";

const Add = (props) => {
  const router = useRouter();
  const [supplierData, setSupplierData] = useState([]);
  const [valueDate, setValueDate] = useState(new Date());
  const [purchaseItems, setPurchaseItems] = useState([]);
  const url = process.env.NEXT_PUBLIC_URL;
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
      createAt: new Date(),
      purchaseAmount: 0,
      supplierId: 0,
    },
  });

  const onSubmit = async (data) => {
    // console.log(data);
    let dateISO = valueDate.toISOString();

    const postData = {
      createAt: valueDate,
      supplierId: parseInt(data.supplierId),
      purchaseAmount: parseInt(data.purchaseAmount),
    };

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(postData),
    };

    const response = await fetch(`${url}/api/purchaseMaster`, requestOptions);
    const result = await response.json();
    // console.log(result);
    if (result) {
      let id = result.purchaseMasterId;
      const addPurchaseDetail = async (id) => {
        if (purchaseItems.length > 0) {
          for (let index = 0; index < purchaseItems.length; index++) {
            const element = purchaseItems[index];
            let data = {
              purchaseMasterId: parseInt(id),
              productId: parseInt(element.productId),
              qty: element.qty,
              rate: element.rate,
              amountPerProduct: element.amountPerProduct,
            };
            console.log(data);

            const response = await fetch(`${url}/api/purchaseDetail/${id}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
            const res = await response.json();
            console.log(res)
            if (res) {
              console.log("purchase detail is saved");
            }
          }
        }
      };
      addPurchaseDetail(id);
    }
    toast.success("Record saved successfully.");
    router.push("/dashboard/purchase");
  };

  const getSupplier = async (token) => {
    const response = await fetch(`${url}/api/supplier`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setSupplierData(res);
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
      getSupplier(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  const detailData = (values) => {
    // console.log(values);
    let total = 0;
    let detail = [];
    values.map((x) => {
      let result = {
        purchaseMasterId: 1,
        productId: x.productId,
        qty: parseInt(x.qty),
        rate: parseInt(x.rate),
        amountPerProduct: x.qty * x.rate,
      };

      let amt = x.qty * x.rate;
      total += amt;
      detail.push(result);
    });

    setValue("purchaseAmount", total);
    setPurchaseItems(detail);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-center text-xl font-bold mt-24 mb-3">Purchase Invoice</h3>
      <form>
        <div className="flex flex-col m-2">
          <div className="flex items-center m-2 outline-none">
            <span className="w-24 md:w-48 lg:48 text-xs md:text-sm">Date</span>
            <DateTimePicker
              placeholder="Enter create date."
              onChange={setValueDate}
              value={valueDate}
              name="createAt"
              className="py-0 md:py-1 ml-2 md:ml-0 text-sm md:text-md w-24 md:w-full lg:w-full"
            />
          </div>

          <div className="flex items-center m-2">
            <span className="w-24 md:w-48 text-xs md:text-sm">Supplier</span>
            <select
              className="py-3 border border-solid border-gray-700 rounded-lg px-2 w-full outline-none text-md"
              {...register("supplierId", {
                required: "Supplier field can't be empty.",
              })}
            >
              <option value="">Select...</option>
              {supplierData !== undefined &&
                supplierData.map((x) => {
                  return (
                    <>
                      <option value={x.supplierId}>{x.name}</option>
                    </>
                  );
                })}
            </select>
          </div>
          <div className="flex items-center m-2">
            <span className="w-24 md:w-48 text-xs md:text-sm">Purchase Amount</span>

            <input
              readOnly
              className="w-48 md:w-full ml-2 md:ml-0 border border-solid border-gray-700 rounded-lg py-3 px-1 text-sm text-end font-semibold outline-none"
              {...register("purchaseAmount", {})}
            />
          </div>
          <div className="flex justify-center items-center m-2 mt-8">
            <button
              type="button"
              className="bg-slate-300 rounded py-2 px-3 mr-1 hover:bg-slate-800 hover:text-white cursor-pointer text-sm w-24"
              onClick={() => router.push("/dashboard/purchase")}
            >
              Close
            </button>
            <button
              className="bg-cyan-400 rounded py-2 px-4 hover:bg-cyan-800 hover:text-white cursor-pointer text-sm w-24"
              type="button"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </button>
          </div>
        </div>
      </form>
      <PurchaseDetail id={1} detailData={detailData} />
    </div>
  );
};

export default Add;

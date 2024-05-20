"use client";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PurchaseDetailUpdate from "@/components/PurchaseDetailUpdate";
import { useParams, useRouter } from "next/navigation";

const Edit = (props) => {
  const params = useParams();
  let id = "";
  if (params) {
    console.log(params.id);
    id = params.id;
  }
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_URL;
  const [supplierData, setSupplierData] = useState([]);
  const [valueDate, setValueDate] = useState(new Date());
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [purchaseDetailData, setPurchaseDetailData] = useState([]);
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
      createdAt: new Date(),
      purchaseAmount: 0,
      supplierId: 0,
    },
  });

  const onSubmit = async (data) => {
    let dateISO;
    if (valueDate.length === 27) {
      dateISO = valueDate;
    } else {
      dateISO = valueDate.toISOString();
    }

    const postData = {
      createAt: valueDate,
      supplierId: parseInt(data.supplierId),
      purchaseAmount: parseInt(data.purchaseAmount),
    };

    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(postData),
    };

    // console.log(requestOptions);

    const response = await fetch(`${url}/api/purchaseMaster/${id}`, requestOptions);
    const result = await response.json();
    // console.log(result);
    if (result) {
      // let id = result.saleMasterId;
      // delete from sale detail and insert

      const response = await fetch(`${url}/api/purchaseDetail`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const res = await response.json();
      // console.log(res.length);
      if (res.length >= 1) {
        const respDel = await fetch(`${url}/api/purchaseDetail/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(sale_array),
        });
        const resDelStatus = await respDel.status;
        console.log(resDelStatus);
      }

      const addPurchaseDetail = async (id) => {
        if (purchaseItems.length > 0) {
          // let sale_array = [];
          for (let index = 0; index < purchaseItems.length; index++) {
            const element = purchaseItems[index];
            let data = {
              purchaseMasterId: parseInt(id),
              productId: parseInt(element.productId),
              qty: element.qty,
              rate: parseInt(element.rate),
              amountPerProduct: parseInt(element.amountPerProduct),
            };
            // sale_array.push(data);

            // console.log(sale_array);
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
            console.log(res);
            if (res) {
              console.log("purchase detail is updated succesfully.");
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

  const getPurchase = async (token) => {
    const response = await fetch(`${url}/api/purchaseMaster`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      let filterPurchase = res.filter((r) => r.purchaseMasterId == id);
      filterPurchase = filterPurchase[0];
      // console.log(filterSale);
      setPurchaseData(filterPurchase);
      setValue("supplierId", filterPurchase.supplierId);
      setValue("createAt", filterPurchase.createAt);
      setValue("purchaseAmount", filterPurchase.purchaseAmount);
    }
  };

  const getPurchaseDetail = async (token) => {
    const response = await fetch(`${url}/api/purchaseDetail`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    let filterPurchase = [];
    if (res) {
      filterPurchase = res.filter((r) => r.purchaseMasterId == parseInt(id));
    }
    // console.log(filterSale);
    setPurchaseDetailData(filterPurchase);
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
      getPurchase(user.accessToken);
      getPurchaseDetail(user.accessToken);
    } else {
      redirect("/");
    }
  }, [id]);

  const detailData = (values) => {
    // console.log(values);
    let total = 0;
    let detail = [];
    values.map((x) => {
      // console.log("hi");
      let result = {
        purchaseMasterId: parseInt(id),
        productId: parseInt(x.productId),
        qty: parseInt(x.qty),
        rate: parseInt(x.rate),
        amountPerProduct: parseInt(x.qty * x.rate),
      };
      // console.log(result)

      let amt = parseInt(x.qty) * parseInt(x.rate);
      total += amt;
      // console.log(total);
      detail.push(result);
    });

    setValue("purchaseAmount", total);
    // console.log(detail);
    setPurchaseItems(detail);
  };
  // console.log(purchaseItems);
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-center text-xl font-bold mt-24 mb-3">
          Purchase Invoice Update
        </h3>
        <form>
          <div className="flex flex-col m-2">
            <div className="flex items-center m-2 outline-none">
              <span className="w-24 md:w-48 lg:48 text-xs md:text-sm md:font-semibold">
                Date
              </span>
              <DateTimePicker
                placeholder="Enter create date."
                onChange={setValueDate}
                value={valueDate}
                name="created_at"
                className="py-0 md:py-2 ml-2 md:ml-0 text-xs md:text-md w-24 md:w-full lg:w-full"
              />
            </div>

            <div className="flex items-center m-2">
              <span className="w-24 md:w-48 text-xs md:text-sm md:font-semibold">Supplier</span>
              <select
                className="py-3 border border-solid border-gray-700 rounded-lg px-2 w-full outline-none text-md"
                {...register("supplierId", {
                  required: "Supplier is required.",
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
              <span className="w-24 md:w-48 text-xs md:text-sm md:font-semibold">
                Purchase Amount
              </span>

              <input
                readOnly
                className="py-3 border border-solid border-gray-700 rounded-lg px-2 w-full outline-none text-md text-end font-semibold"
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
        {/* {console.log(purchaseDetailData)} */}
        <PurchaseDetailUpdate
          id={id}
          detailData={detailData}
          data={purchaseDetailData}
        />
      </div>
    </>
  );
};

export default Edit;

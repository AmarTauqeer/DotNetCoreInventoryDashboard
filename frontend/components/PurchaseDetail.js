import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

const PurchaseDetail = (props) => {
    const url = process.env.NEXT_PUBLIC_URL;
  const [productData, setProductData] = useState([]);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
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

//   const getStock = async () => {
//     const response = await fetch(`http://127.0.0.1:8000/sale/stock/`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });
//     const res = await response.json();
//     console.log(res);
//     if (res) {
//       setStock(res);
//     }
//   };

const getProduct = async (token) => {
    const response = await fetch(`${url}/api/Product`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setProductData(res);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getProduct(user.accessToken);
    //   getStock(user.accessToken);
    } else {
      redirect("/");
    }
  }, [props]);

  //   console.log(val, "data-");

  return (
    <div className="grid grid-cols-1 overflow-x-auto m-4">
      <div className="flex flex-col items-center justify-center mt-10 m-2">
        <div className="flex justify-start items-start text-xl font-bold w-full mb-3">
          Add Purchase Detail
        </div>
        <form>
          {fields.map(({ id }, index) => {
            return (
              <div key={id} className="flex m-2 justify-center items-center">
                <div>
                  <select
                    className="outline-none ml-1 text-sm flex rounded py-[13px] shadow-sm ring-1 ring-inset w-48 md:w-80 lg:w-80
                    ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                    {...register(`items[${index}].productId`, {
                      onChange: (e) => {
                        props.detailData(getValues().items);
                        {
                          let data = getValues().items;

                          for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            // console.log(element);

                            let filterProduct = productData.filter(
                              (p) => p.productId === parseInt(element.productId)
                            );
                            if (filterProduct.length>0) {
                              setValue(
                                `items[${index}].productId`,
                                parseInt(filterProduct[0].productId)
                              );
                            }
                          }
                        }
                      },
                    })}
                  >
                    <option value="">Select product</option>
                    {productData !== undefined &&
                      productData.map((x) => {
                        return (
                          <>
                            <option value={x.productId}>{x.name}</option>
                          </>
                        );
                      })}
                  </select>
                </div>
                <div>
                  <input
                    placeholder="qty"
                    className="w-[25px] md:w-24 lg:24 ml-1 border border-solid border-gray-700 rounded py-[10px] px-1 text-sm text-center outline-none"
                    {...register(`items[${index}].qty`, {
                      onChange: (e) => {
                        let amt = 0;
                        props.detailData(getValues().items);
                        {
                          let data = getValues().items;

                          for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            console.log(element);
                            amt = element.qty * element.rate;

                            // //check stock qty
                            // let filterStock = stock.filter(
                            //   (s) => s.productId === parseInt(element.productId)
                            // );
                            // if (
                            //   parseInt(element.qty) >
                            //   parseInt(filterStock[0].stock_qty)
                            // ) {
                            //   toast.error(
                            //     "Sale qty doesn't exceed with stock qty=" +
                            //       filterStock[0].stock_qty
                            //   );
                            //   return false;
                            // }
                          }
                        }
                        setValue(`items[${index}].amountPerProduct`, amt);
                      },
                    })}
                  />
                </div>
                <div>
                  <input
                    placeholder="rate"
                    className="w-[25px] md:w-24 lg:24 text-end ml-1 border border-solid border-gray-700 rounded py-[10px] px-1 text-sm outline-none"
                    {...register(`items[${index}].rate`, {
                      onChange: (e) => {
                        let amt = 0;
                        props.detailData(getValues().items);
                        {
                          let data = getValues().items;

                          for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            console.log(element);
                            amt = element.qty * element.rate;
                          }
                        }
                        setValue(`items[${index}].amountPerProduct`, amt);
                        // console.log(getValues().items);
                      },
                    })}
                  />
                </div>
                <div>
                  <input
                    className="w-[45px] md:w-48 lg:w-48 text-end font-bold ml-1 border border-solid border-gray-700 rounded py-[10px] px-1 text-sm outline-none"
                    {...register(`items[${index}].amountPerProduct`, {
                      onChange: (e) => {
                        props.detailData(getValues().items);
                        // console.log(getValues().items);
                      },
                      disabled: true,
                    })}
                  />
                </div>
                <div>
                  <button
                    className="flex justify-center items-center bg-rose-400 rounded py-[10px] px-4 hover:bg-rose-800 hover:text-white 
            cursor-pointer text-sm w-[50px] ml-1"
                    type="button"
                    onClick={() => {
                      remove(index);
                      {
                        props.detailData(getValues().items);
                        // console.log(getValues().items);
                      }
                    }}
                  >
                    Del
                  </button>
                </div>
              </div>
            );
          })}
          <div>
            <button
              className="flex justify-center items-center bg-cyan-400 rounded py-[8px] px-4 hover:bg-cyan-800 hover:text-white 
            cursor-pointer text-sm w-[120px] ml-1 mt-2"
              type="button"
              onClick={() => {
                append({});
                {
                  props.detailData(getValues().items);
                  // console.log(getValues().items);
                }
              }}
            >
              Add new row
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseDetail;
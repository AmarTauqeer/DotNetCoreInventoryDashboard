'use client'
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FiSearch } from "react-icons/fi";
import GeneratePDF from "@/components/GeneratePDF";
import CustomStyles from "@/components/CustomStyles";
// const CustomStyle = {
//   hieght: "100%",
//   rows: {
//     style: {
//       fontSize: "15px",
//       paddingBottom: "10px",
//       paddingTop: "10px",
//       backgroundColor: "#f4f4f5",
//       "&:hover": {
//         backgroundColor: "#a5f3fc",
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: "15px",
//       fontWeight: "bold",
//       paddingBottom: "20px",
//       paddingTop: "20px",
//       backgroundColor: "#22d3ee",
//       color: "#ffffff",
//     },
//   },
// };

const Stock = () => {
  const [filterProduct, setFilterProduct] = useState([]);
  const [stock, setStock] = useState([]);
  const url = process.env.NEXT_PUBLIC_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  const columns = [
    {
      name: "ID#",
      selector: (row) => row.productId,
      sortable: true,
      width: "200px",
    },
    {
      name: "Name",
      selector: (row) => {
        if (row.stockQty < 5) {
          return <div className="text-rose-500">{row.productName}</div>;
        }
        return <div className="font-semibold">{row.productName}</div>;
      },
      sortable: true,
      width: "550px",
    },
    {
      name: "Qty",
      selector: (row) => {
        if (row.stockQty < 5) {
          return <div className="text-rose-500">{row.stockQty}</div>;
        }
        return <div>{row.stockQty}</div>;
      },
      sortable: true,
      width: "300px",
    },
  ];

  const getStock = async (token) => {
    const response = await fetch(`${url}/api/stock/GetAll`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res)

    if (res) {
      setStock(res);
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

  const handleChange = (e) => {
    const filtered = stock.filter((x) => {
      return x.productName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilterProduct(filtered);
  };

  useEffect(() => {
    checkExpiration();
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      setAccessToken(user.accessToken);
      getStock(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
    {expire && redirect("/")}
    <div className="flex flex-col items-center justify-center">
        <div className="container">
          <h3 className="font-semibold text-2xl mb-6 mt-6">Stock</h3>
          <div className="flex mb-2 justify-between">
            <div
              className="flex items-center bg-white w-80 md:w-[600px] lg:w-[600px]  
  m-2 md:m-0 lg:m-0"
            >
              <input
                type="text"
                className="py-4 border rounded-lg px-2 w-full outline-none text-lg"
                placeholder="Search here."
                // value={search}
                onChange={handleChange}
              />
              {/* <span>
                <FiSearch size={30} />
              </span> */}
            </div>
            <div className="flex items-center justify-between">
              
              <div className="py-4">
                <GeneratePDF data={stock} id="stock" />
              </div>
            </div>
          </div>

          {stock.length > 0 ? (
                <div className="border">
                  <DataTable
                    columns={columns}
                    data={
                      filterProduct.length >= 1
                        ? filterProduct
                        : stock
                    }
                    
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
        </div>
      </div>
    </>
  );
};

export default Stock;
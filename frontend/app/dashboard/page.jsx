"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FiSearch, FiUsers } from "react-icons/fi";
import GeneratePDF from "@/components/GeneratePDF";
import CustomStyles from "@/components/CustomStyles";
import { BiSolidShow } from "react-icons/bi";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { PiUsersThree } from "react-icons/pi";
import { LiaFileInvoiceDollarSolid, LiaUsersSolid } from "react-icons/lia";
import { FaFileInvoiceDollar, FaProductHunt } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { FcDepartment } from "react-icons/fc";
import Loading from "../loading";

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Sale And Purhase Month Wise (2024)",
      font: {
        size: 18,
      },
    },
  },
};

const Dashboard = () => {
  const url = process.env.NEXT_PUBLIC_URL;
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalproducts, setTotalproducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [monthWiseTotalSale, setMonthWiseTotalSale] = useState([]);
  const [monthWiseTotalPurchase, setMonthWiseTotalPurchase] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalStocks, setTotalStocks] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [lastSalePurchase, setLastSalePurchase] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [expire, setExpire] = useState(false);

  ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
  );

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "PURCHASE",
        data: monthWiseTotalPurchase.map((m) => m.totalAmount),
        backgroundColor: "#dc2626",
      },
      {
        label: "SALE",
        data: monthWiseTotalSale.map((m) => m.totalAmount),
        backgroundColor: "#059669",
      },
    ],
  };

  const columns = [
    // {
    //   name: "ID#",
    //   selector: (row) => row.id,
    //   sortable: true,
    //   width: "10%",
    // },
    {
      name: "DATE",
      selector: (row) => {
        const event = new Date(row.date);
        return event.toDateString();
      },
      sortable: true,
      width: "28%",
    },
    {
      name: "TYPE",
      selector: (row) => <div className="font-bold">{row.type}</div>,
      sortable: true,
      width: "17%",
    },
    {
      name: "CUSTOMER/SUPPLIER",
      selector: (row) => <div className="font-bold">{row.name}</div>,
      sortable: true,
      width: "25%",
    },
    {
      name: "AMOUNT",
      selector: (row) => (
        <div className="font-bold text-end">
          {row.type == "sale" ? (
            <div className="text-green-500">€ {row.amount}</div>
          ) : (
            <div className="text-red-500">€ {row.amount}</div>
          )}
        </div>
      ),
      sortable: true,
      width: "15%",
    },
    {
      name: "DETAIL",
      selector: (row) => {
        if (row.type == "sale") {
          return (
            <div
              className="text-blue-400 underline cursor-pointer hover:text-blue-800"
              onClick={() => router.push(`/dashboard/sale/detail/${row.id}`)}
            >
              <BiSolidShow size={30} />
            </div>
          );
        } else {
          return (
            <div
              className="text-blue-400 underline cursor-pointer hover:text-blue-800"
              onClick={() =>
                router.push(`/dashboard/purchase/detail/${row.id}`)
              }
            >
              <BiSolidShow size={30} />
            </div>
          );
        }
      },
      width: "15%",
    },
  ];

  const getLastSalePurchase = async (token) => {
    const response = await fetch(`${url}/api/stock/lastSalePurchase`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setLastSalePurchase(res);
    }
  };

  const totalCustomer = async (token) => {
    const response = await fetch(`${url}/api/customer`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setTotalCustomers(res.length);
    }
  };

  const totalSale = async (token) => {
    const response = await fetch(`${url}/api/saleMaster`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    let total_amount = 0;
    if (res) {
      setTotalSales(res.length);
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        console.log(element.saleAmount);
        total_amount =
          (parseInt(total_amount) * 100 + parseInt(element.saleAmount) * 100) /
          100;
      }
      setTotalSaleAmount(parseInt(total_amount));
    }
  };

  const totalStock = async (token) => {
    const response = await fetch(`${url}/api/stock/GetAll`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setTotalStocks(res.length);
    }
  };

  const totalPurchase = async (token) => {
    const response = await fetch(`${url}/api/purchaseMaster`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    let total_amount = 0;
    total_amount = parseInt(total_amount);
    if (res) {
      setTotalPurchases(res.length);
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        console.log(element.purchaseAmount);
        total_amount =
          (parseInt(total_amount) * 100 +
            parseInt(element.purchaseAmount) * 100) /
          100;
      }
      setTotalPurchaseAmount(parseInt(total_amount));
    }
  };

  const totalSupplier = async (token) => {
    const response = await fetch(`${url}/api/supplier`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setTotalSuppliers(res.length);
    }
  };

  const totalProduct = async (token) => {
    const response = await fetch(`${url}/api/product`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setTotalproducts(res.length);
    }
  };
  const totalDepartment = async (token) => {
    const response = await fetch(`${url}/api/department/GetAll`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setTotalDepartments(res.length);
    }
  };
  const totalEmployee = async (token) => {
    const response = await fetch(`${url}/api/employee`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setTotalEmployees(res.length);
    }
  };

  const totalSaleMonthWise = async (token) => {
    const response = await fetch(`${url}/api/stock/monthWiseTotalSale`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    console.log(res);
    if (res) {
      setMonthWiseTotalSale(res);
    }
  };

  const totalPurchaseMonthWise = async (token) => {
    const response = await fetch(`${url}/api/stock/monthWiseTotalPurchase`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await response.json();
    // console.log(res);
    if (res) {
      setMonthWiseTotalPurchase(res);
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
      getLastSalePurchase(user.accessToken);
      totalCustomer(user.accessToken);
      totalSale(user.accessToken);
      totalSupplier(user.accessToken);
      totalPurchase(user.accessToken);
      totalStock(user.accessToken);
      totalProduct(user.accessToken);
      totalSaleMonthWise(user.accessToken);
      totalPurchaseMonthWise(user.accessToken);
      totalDepartment(user.accessToken);
      totalEmployee(user.accessToken);
    } else {
      redirect("/");
    }
  }, []);

  return (
    <>
      {expire && redirect("/")}
      {/* <div className="grid grid-cols-1 overflow-x-auto"> */}
      {/* <div className="flex flex-col w-full items-center justify-center  m-2 md:m-0 lg:m-0"> */}
      <div className="container">
        <div>
          <h1 className="font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-4 gap-4 pt-5">
          <div
            onClick={() => router.push("/dashboard/customer")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-cyan-500 cursor-pointer"
          >
            <div className="font-bold">
              <PiUsersThree size={80} />
            </div>
            <div>
              Customers{" "}
              {totalCustomers ? (
                <span>[{totalCustomers}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/supplier")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-stone-400 cursor-pointer"
          >
            <div className="font-bold">
              <LiaUsersSolid size={80} />
            </div>
            <div>
              Supplier{" "}
              {totalSuppliers ? (
                <span>[{totalSuppliers}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/product")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-red-600 cursor-pointer"
          >
            <div className="font-bold">
              <FaProductHunt size={80} />
            </div>
            <div>
              Products{" "}
              {totalproducts ? (
                <span>[{totalproducts}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/stock")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-slate-500 cursor-pointer"
          >
            <div className="font-bold">
              <MdInventory size={80} />
            </div>
            <div>
              Stock{" "}
              {totalStocks ? (
                <span>[{totalStocks}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/department")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-green-600 cursor-pointer"
          >
            <div className="font-bold">
              <FcDepartment size={80} />
            </div>
            <div>
              Departments{" "}
              {totalDepartments ? (
                <span>[{totalDepartments}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/employee")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-blue-600 cursor-pointer"
          >
            <div className="font-bold">
              <FiUsers size={80} />
            </div>
            <div>
              Employees{" "}
              {totalEmployees ? (
                <span>[{totalEmployees}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/sale")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-fuchsia-600 cursor-pointer"
          >
            <div className="font-bold">
              <FaFileInvoiceDollar size={80} />
            </div>
            <div>
              Sale{" "}
              {totalSales ? (
                <span>[{totalSales}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
            <div>
              Sale Amount{" "}
              {totalSaleAmount ? (
                <span>[{totalSaleAmount}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/purchase")}
            className="flex flex-col justify-center items-center w-[300px] h-64 border rounded-3xl text-xl font-bold text-white bg-orange-600 cursor-pointer"
          >
            <div className="font-bold">
              <LiaFileInvoiceDollarSolid size={80} />
            </div>
            <div>
              Purchase{" "}
              {totalPurchases ? (
                <span>[{totalPurchases}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
            <div>
              Purchase Amount{" "}
              {totalPurchaseAmount ? (
                <span>[{totalPurchaseAmount}]</span>
              ) : (
                <span>
                  <Loading />
                </span>
              )}
            </div>
          </div>
        </div>
        

        <br />
        <br />
        {monthWiseTotalSale.length > 0 ? (
          <div className="grid lg:grid-cols-1 md:grid-cols-1 m-auto p-4 border rounded-lg bg-white mb-6 mt-10 overflow-x-auto">
            <Bar options={options} data={data} />
          </div>
        ) : (
          <span><Loading /></span>
        )}
        <br />
        <br />
        <hr />
        <div>
          <h3 className="font-bold text-2xl mt-6">Recent Sale And Purchase</h3>
        </div>
        <div className="container mt-4 border">
          {lastSalePurchase.length > 0 ? (
            <DataTable
              columns={columns}
              data={lastSalePurchase}
              customStyles={CustomStyles}
              pagination
            />
          ) : (
            "There are no records to display"
          )}
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default Dashboard;

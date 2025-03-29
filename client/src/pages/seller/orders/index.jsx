// import { useStateProvider } from "../../../context/StateContext";
// import { GET_SELLER_ORDERS_ROUTE } from "../../../utils/constants";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// function SellerOrders() {
//   const [orders, setOrders] = useState([]);
//   const [{ userInfo }] = useStateProvider();

//   useEffect(() => {
//     const getOrders = async () => {
//       try {
//         const { data } = await axios.get(GET_SELLER_ORDERS_ROUTE, { withCredentials: true });
//         setOrders(data.orders);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     if (userInfo) getOrders();
//   }, [userInfo]);

//   return (
//     <div className="min-h-[80vh] my-10 mt-0 px-32">
//       <h3 className="m-5 text-2xl font-semibold">Your Received Orders</h3>
//       <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//               <th scope="col" className="px-6 py-3">Order Id</th>
//               <th scope="col" className="px-6 py-3">Buyer</th>
//               <th scope="col" className="px-6 py-3">Gig</th>
//               <th scope="col" className="px-6 py-3">Price</th>
//               <th scope="col" className="px-6 py-3">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50" key={order.id}>
//                 <th scope="row" className="px-6 py-4">{order.id}</th>
//                 <td className="px-6 py-4">{order.buyer.fullName || order.buyer.username}</td>
//                 <td className="px-6 py-4">{order.gig.title}</td>
//                 <td className="px-6 py-4">${order.price}</td>
//                 <td className="px-6 py-4 font-semibold">
//                   {order.isApproved ? "Approved ✅" : "Pending ⏳"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default SellerOrders;

import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await axios.get(GET_SELLER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">Your Received Orders</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Order Id</th>
              <th scope="col" className="px-6 py-3">Buyer</th>
              <th scope="col" className="px-6 py-3">Gig</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Send Message</th> {/* ✅ New Column */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50" key={order.id}>
                <th scope="row" className="px-6 py-4">{order.id}</th>
                <td className="px-6 py-4">{order.buyer.fullName || order.buyer.username}</td>
                <td className="px-6 py-4">{order.gig.title}</td>
                <td className="px-6 py-4">${order.price}</td>
                <td className="px-6 py-4 font-semibold">
                  {order.isApproved ? "Approved ✅" : "Pending ⏳"}
                </td>
                {/* ✅ Send Message Link */}
                <td className="px-6 py-4">
                  <Link
                    href={`/seller/orders/messages/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Send
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellerOrders;

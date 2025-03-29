// import { useStateProvider } from "../../../context/StateContext";
// import { GET_BUYER_ORDERS_ROUTE, APPROVE_ORDER_ROUTE } from "../../../utils/constants";
// import axios from "axios";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [{ userInfo }] = useStateProvider();

//   useEffect(() => {
//     const getOrders = async () => {
//       try {
//         const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true });
//         setOrders(data.orders);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     if (userInfo) getOrders();
//   }, [userInfo]);

//   const approveOrder = async (orderId) => {
//     try {
//       await axios.post(APPROVE_ORDER_ROUTE, { orderId }, { withCredentials: true });
//       setOrders(orders.map(order => order.id === orderId ? { ...order, isApproved: true } : order));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] my-10 mt-0 px-32">
//       <h3 className="m-5 text-2xl font-semibold">All your Orders</h3>
//       <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//         <table className="w-full text-sm text-left text-gray-500">
//           <thead>
//             <tr>
//               <th>Order Id</th>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Price</th>
//               <th>Delivery Time</th>
//               <th>Order Date</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id}>
//                 <td>{order.id}</td>
//                 <td>{order.gig.title}</td>
//                 <td>{order.gig.category}</td>
//                 <td>${order.price}</td>
//                 <td>{order.gig.deliveryTime} days</td>
//                 <td>{order.createdAt.split("T")[0]}</td>
//                 <td>{order.isApproved ? "Success" : "Pending"}</td>
//                 <td>
//                   {!order.isApproved && (
//                     <button onClick={() => approveOrder(order.id)} className="px-4 py-2 bg-blue-500 text-white rounded">
//                       Approve
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Orders;

import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE, APPROVE_ORDER_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  const approveOrder = async (orderId) => {
    try {
      await axios.post(APPROVE_ORDER_ROUTE, { orderId }, { withCredentials: true });
      setOrders(orders.map(order => order.id === orderId ? { ...order, isApproved: true } : order));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Orders</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Delivery Time</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Send Message</th> {/* ✅ New Column */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.gig.title}</td>
                <td>{order.gig.category}</td>
                <td>${order.price}</td>
                <td>{order.gig.deliveryTime} days</td>
                <td>{order.createdAt.split("T")[0]}</td>
                <td>{order.isApproved ? "Success ✅" : "Pending ⏳"}</td>
                <td>
                  {!order.isApproved && (
                    <button onClick={() => approveOrder(order.id)} className="px-4 py-2 bg-blue-500 text-white rounded">
                      Approve
                    </button>
                  )}
                </td>
                {/* ✅ Send Message Link */}
                <td>
                  <Link
                    href={`/buyer/orders/messages/${order.id}`}
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

export default Orders;

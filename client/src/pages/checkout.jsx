// // @ts-nocheck
// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";
// import { CREATE_ORDER } from "../utils/constants";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "../components/CheckoutForm";
// import { useRouter } from "next/router";

// const stripePromise = loadStripe("pk_test_51QryUpIScDZJpzaOOEz2Uuvt9XBFRv4wWd1l7wrefzhgbNFH33rc9h984steKMHaqYmIqLtq5RMizUOZDCEWnk0o00UeeQfe3p");

// function Checkout() {
//   const [clientSecret, setClientSecret] = useState("");
//   const [error, setError] = useState(null); // Added error state
//   const router = useRouter();
//   const { gigId } = router.query;

//   useEffect(() => {
//     const createOrderIntent = async () => {
//       try {
//         if (!gigId) return; // Ensure gigId is available

//         const { data } = await axios.post(
//           CREATE_ORDER,
//           { gigId },
//           { withCredentials: true }
//         );
        
//         if (data.clientSecret) {
//           setClientSecret(data.clientSecret);
//         } else {
//           throw new Error("Client secret not returned from backend.");
//         }
//       } catch (err) {
//         console.error("Error creating order:", err);
//         setError("Failed to create order. Please try again.");
//       }
//     };

//     createOrderIntent();
//   }, [gigId]);

//   const appearance = {
//     theme: "stripe",
//   };
//   const options = {
//     clientSecret,
//     appearance,
//   };

//   return (
//     <div className="min-h-[80vh] max-w-full mx-20 flex flex-col gap-10 items-center">
//       <h1 className="text-3xl">Please complete the payment to place the order.</h1>

//       {error && <p className="text-red-500">{error}</p>} {/* Show error message */}
      
//       {clientSecret ? (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm />
//         </Elements>
//       ) : (
//         !error && <p>Loading payment details...</p>
//       )}
//     </div>
//   );
// }

// export default Checkout;

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { CREATE_ORDER } from "../utils/constants";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useRouter } from "next/router";

const stripePromise = loadStripe("pk_test_51QryUpIScDZJpzaOOEz2Uuvt9XBFRv4wWd1l7wrefzhgbNFH33rc9h984steKMHaqYmIqLtq5RMizUOZDCEWnk0o00UeeQfe3p");

function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Prevent duplicate calls
  const [error, setError] = useState(null);
  const router = useRouter();
  const { gigId } = router.query;

  useEffect(() => {
    let isMounted = true; // ✅ Prevents multiple executions

    const createOrderIntent = async () => {
      try {
        if (!gigId || loading) return; // ✅ Prevent multiple requests
        setLoading(true);

        const { data } = await axios.post(
          CREATE_ORDER,
          { gigId },
          { withCredentials: true }
        );

        if (isMounted) {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error("Client secret not returned from backend.");
          }
        }
      } catch (err) {
        console.error("Error creating order:", err);
        setError("Failed to create order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createOrderIntent();

    return () => {
      isMounted = false; // ✅ Cleanup to avoid multiple requests
    };
  }, [gigId]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-[80vh] max-w-full mx-20 flex flex-col gap-10 items-center">
      <h1 className="text-3xl">Please complete the payment to place the order.</h1>

      {error && <p className="text-red-500">{error}</p>} 

      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        !error && <p>Loading payment details...</p>
      )}
    </div>
  );
}

export default Checkout;

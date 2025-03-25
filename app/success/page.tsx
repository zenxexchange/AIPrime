"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      console.log("✅ Payment successful! Session ID:", session_id);
      setLoading(false);
    }
  }, [session_id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">✅ Payment Successful!</h1>
      {loading ? <p>Processing your order...</p> : <p>Thank you for your purchase!</p>}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push("/")}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default SuccessPage;
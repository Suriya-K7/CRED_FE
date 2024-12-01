"use client";
import React, { useState, useEffect } from "react";
import { Skeleton, Snackbar, Alert, Button } from "@mui/material";
import axios from "axios";
import Link from "next/link";

// Define the TypeScript type for UserData
interface UserData {
  id: number;
  UEN: string;
  company: string;
  name: string;
  email: string;
  position: string;
  mobile: string;
  file?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function User() {
  const [userData, setUserData] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "info" | "error"
  >("success");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setToastMessage("fetching user data");
      setToastSeverity("info");
      setToastOpen(true);

      const response = await axios.get(`${apiUrl}/users`);
      setToastMessage("User data fetched successfully.");
      setToastSeverity("success");
      setUserData(response.data);

      console.log(response.data);
    } catch (error) {
      setToastMessage("Failed to connect to server");
      setToastSeverity("error");
      console.log(error);
    } finally {
      setToastOpen(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold mb-4">User Data</h1>
          <Link href={"/"}>
            <Button variant="contained">Add New</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  UEN
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Company
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Email
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Position
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Mobile
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        <Skeleton animation="wave" width={80} />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Skeleton animation="wave" width={100} />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Skeleton animation="wave" width={90} />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Skeleton animation="wave" width={120} />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Skeleton animation="wave" width={70} />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Skeleton animation="wave" width={100} />
                      </td>
                    </tr>
                  ))
                : userData?.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {data.UEN}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {data.company}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {data.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {data.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {data.position}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {data.mobile}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snackbar for Toast Messages */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

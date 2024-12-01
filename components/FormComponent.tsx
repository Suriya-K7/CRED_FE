"use client";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import InputField from "./InputField";
import InputSection from "./InputSection";
import { useEffect, useState } from "react";
import { Check } from "@mui/icons-material";
import DropZone from "./DropBox";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter

const TERMS_CONDITION = [
  "I confirm that I am the authorized person to upload bank statements on behalf of my company",
  "I assure you that uploaded bank statements and provided company information match and are of the same company, if there is a mismatch then my report will not be generated",
  "I understand that this is a general report based on the bank statements and Credilinq is not providing a solution or guiding me for my business growth",
  "I have read and understand the Terms & Conditions",
];

const PDF_DESCRIPTION = [
  "PDFs (not scanned copies) of company's operating bank current account(s) statements for the past 6 months. Example: If today is 01 Dec 24, then please upload bank statements from Jun 24 to Nov 24 (both months inclusive).",
  "If your company is multi-banked, then please upload 6 months bank statements for each bank account.",
  "If your file is password protected, we request you to remove the password and upload the file to avoid submission failure.",
  "In case you are facing any issues while uploading bank statements, please contact us at support@credilinq.ai.",
];

interface FormData {
  companyUEN: string;
  companyName: string;
  fullName: string;
  position: string;
  email: string;
  confirmEmail: string;
  mobileNo: string;
  file: any;
}

export default function FormComponent() {
  const [checked, setChecked] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter(); // Initialize useRouter

  const [toastSeverity, setToastSeverity] = useState<
    "success" | "info" | "error"
  >("info");

  const [flag, setFlag] = useState({
    company: false,
    user: false,
    file: false,
  });

  const handleFileAccepted = (files: any) => {
    console.log("Accepted files:", files);
  };

  const validationSchema = Yup.object({
    companyUEN: Yup.string()
      .matches(/^[A-Za-z0-9]{9,10}$/, "Invalid Company UEN")
      .required("Company UEN is required"),
    companyName: Yup.string().required("Company Name is required"),
    fullName: Yup.string().required("Full Name is required"),
    position: Yup.string().required("Position is required"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email Address is required"),
    confirmEmail: Yup.string()
      .oneOf([Yup.ref("email"), null], "Emails must match")
      .required("Re-enter Email Address is required"),
    mobileNo: Yup.string()
      .matches(/^[0-9]{8,10}$/, "Invalid Mobile Number")
      .required("Mobile Number is required"),
    file: Yup.mixed().required("File upload is required"),
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const userData = {
        UEN: String(data.companyUEN),
        company: data.companyName,
        name: data.fullName,
        email: data.email,
        position: data.position,
        mobile: String(data.mobileNo),
        file: data.file.name,
      };

      const response = await axios.post(`${apiUrl}/users`, userData);

      console.log(response);

      setToastSeverity("success");
      setToastMessage("User data saved!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.log(error);
      setToastMessage("Failed to saved data");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      companyUEN: "",
      companyName: "",
      fullName: "",
      position: "",
      email: "",
      confirmEmail: "",
      mobileNo: "",
      file: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      handleSubmit(values);
    },
  });

  const serverConnect = async () => {
    setToastMessage("Waiting for server connection...");
    setToastSeverity("info");
    setToastOpen(true);

    try {
      if (apiUrl) await axios.get(apiUrl);
      setToastSeverity("success");
      setToastMessage("Connected to server");
    } catch (error) {
      setToastMessage("Failed to connect to server");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  useEffect(() => {
    setFlag({
      company:
        formik.values.companyUEN !== "" && formik.values.companyName !== "",
      user:
        formik.values.fullName !== "" &&
        formik.values.position !== "" &&
        formik.values.email !== "" &&
        formik.values.confirmEmail !== "" &&
        formik.values.mobileNo !== "",
      file: formik.values.file !== null,
    });
  }, [formik.values]);

  useEffect(() => {
    serverConnect();
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-10">
        {/* Company Information Section */}
        <div>
          <InputSection
            no={1}
            title="Company Information"
            flag={flag.company}
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-9 py-7 pl-7 ml-9 border-l-2">
            <InputField
              label={"Company UEN"}
              name="companyUEN"
              value={formik.values.companyUEN}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.companyUEN && Boolean(formik.errors.companyUEN)
              }
              helperText={formik.touched.companyUEN && formik.errors.companyUEN}
            />
            <InputField
              label={"Company Name"}
              name="companyName"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.companyName && Boolean(formik.errors.companyName)
              }
              helperText={
                formik.touched.companyName && formik.errors.companyName
              }
            />
          </div>
        </div>

        {/* Applicant Information Section */}
        <div>
          <InputSection no={2} title="Applicant Information" flag={flag.user} />
          <div className="flex-col flex gap-9 py-7 pl-7 ml-9 border-l-2">
            <div className="flex flex-col sm:flex-row flex-1 gap-9">
              <InputField
                label={"Full Name"}
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              <InputField
                label={"Position Within Company"}
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.position && Boolean(formik.errors.position)
                }
                helperText={formik.touched.position && formik.errors.position}
              />
            </div>
            <div className="flex flex-col sm:flex-row flex-1 gap-9">
              <InputField
                label={"Email Address"}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <InputField
                label={"Re-enter Email Address"}
                name="confirmEmail"
                value={formik.values.confirmEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmEmail &&
                  Boolean(formik.errors.confirmEmail)
                }
                helperText={
                  formik.touched.confirmEmail && formik.errors.confirmEmail
                }
              />
            </div>
            <div className="flex flex-col sm:w-1/2 sm:flex-row gap-9">
              <InputField
                label={"Mobile No"}
                name="mobileNo"
                value={formik.values.mobileNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.mobileNo && Boolean(formik.errors.mobileNo)
                }
                helperText={formik.touched.mobileNo && formik.errors.mobileNo}
              />
            </div>
          </div>
        </div>

        {/* Upload Documents Section */}
        <div>
          <InputSection no={3} title="Upload Documents" flag={flag.file} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-9 py-7 pl-7 ml-9 border-l-2">
            <DropZone
              onFileAccepted={(files) => {
                formik.setFieldValue("file", files[0]);
                handleFileAccepted(files);
              }}
              error={formik.touched.file ? formik.errors.file : null} // Pass Formik error
              touched={Boolean(formik.touched.file)} // Pass Formik touched state
            />
            <div className="sm:w-1/2 text-gray-500 flex flex-col gap-4 pl-6">
              {PDF_DESCRIPTION.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <Check />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <div>
          <InputSection no={4} title="Terms & Conditions" flag={checked} />
          <div className="flex flex-col gap-7 py-7 pl-7 ml-9 border-l-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
              }
              label="By ticking, you are confirming that you have understood and are agreeing to the details mentioned:"
            />
            <div
              className={`${
                !checked ? "opacity-30" : "opacity-100"
              } flex flex-col gap-4 pl-6`}
            >
              {TERMS_CONDITION.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <Check />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="outlined"
            color="secondary"
            disabled={!checked}
          >
            Submit
          </Button>
        </div>
      </form>

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

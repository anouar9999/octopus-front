"use client";

import NormalRepeater from "@/components/partials/froms/NormalRepeater";
import Repeater from "@/components/partials/froms/Repeater";

import HomeBredCurbs from "@/components/partials/HomeBredCurbs";
import { useForm } from "react-hook-form";
const campaigns = [
  {
    name: "Channel",
    value: "roi",
  },
  {
    name: "Email",
    value: "40%",
  },
  {
    name: "Website",
    value: "28%",
  },
  {
    name: "Facebook",
    value: "34%",
  },
  {
    name: "Offline",
    value: "17%",
  },
];

const CrmPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  return (
    <div>
      <HomeBredCurbs title="....." />
      <div className="space-y-5">
     
      <div className="my-6">
            <NormalRepeater />
          </div>
      </div>
    </div>
  );
};

export default CrmPage;

import { decription, title } from "@/constant/data";

export const metadata = {
  title: title,
  description: decription ,
}

const layout = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default layout;
import React from "react";
import { useFormStatus } from "react-dom";

interface props {
  title: string;
}

const SubmitButtonMainForm: React.FC<props> = ({ title }) => {
  const { pending } = useFormStatus();
  return (
    <div>
      {!pending && (
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {title}
        </button>
      )}

      {pending && <p>Loading...</p>}
    </div>
  );
};

export default SubmitButtonMainForm;

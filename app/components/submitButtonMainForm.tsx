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
        <button type="submit" className="btn w-full btn-accent">
          {title}
        </button>
      )}

      {pending && <p>Loading...</p>}
    </div>
  );
};

export default SubmitButtonMainForm;

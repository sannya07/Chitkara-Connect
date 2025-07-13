import React, { useEffect, useState } from "react";

const Temporary = () => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("studentData"));
    setStudentData(data);
  }, []);

  if (!studentData) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Welcome, {studentData.name}</h1>
    </div>
  );
};

export default Temporary;

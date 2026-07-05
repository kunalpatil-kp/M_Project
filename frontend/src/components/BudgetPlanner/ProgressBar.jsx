import React from "react";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-wrapper">

      <div className="progress-info">
        <span>Budget Used</span>
        <span>{percentage}%</span>
      </div>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        ></div>

      </div>

    </div>
  );
};

export default ProgressBar;
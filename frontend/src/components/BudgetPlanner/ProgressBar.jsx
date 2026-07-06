import React from "react";

const ProgressBar = ({ percentage }) => {
  // Determine color based on usage percentage
  let barColor = "linear-gradient(90deg, #a8e063, #56ab2f)"; // Default (0-50%): Green
  
  if (percentage > 90) {
    barColor = "linear-gradient(90deg, #ff416c, #ff4b2b)"; // > 90%: Red
  } else if (percentage > 70) {
    barColor = "linear-gradient(90deg, #f7b733, #fc4a1a)"; // 70-90%: Orange
  } else if (percentage > 50) {
    barColor = "linear-gradient(90deg, #4facfe, #00f2fe)"; // 50-70%: Blue
  }

  // Cap percentage at 100 for display
  const displayPercentage = Math.min(percentage, 100);

  return (
    <div className="progress-wrapper">
      <div className="progress-info">
        <span style={{ fontWeight: 600 }}>Budget Used</span>
        <span style={{ fontWeight: 600 }}>{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill animated-bar"
          style={{
            width: `${displayPercentage}%`,
            background: barColor,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
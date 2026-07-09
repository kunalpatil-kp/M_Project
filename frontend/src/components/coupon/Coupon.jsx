import "./Coupon.css";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

/**
 * Standalone Coupon component.
 * Can be dropped anywhere; reads/writes coupon state via StoreContext.
 *
 * Props:
 *   subtotal  – current cart subtotal (number)
 */
const Coupon = ({ subtotal }) => {
  const { url, couponCode, setCouponCode, appliedCoupon, setAppliedCoupon, discount, setDiscount } =
    useContext(StoreContext);

  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/coupon/verify`, {
        couponCode: couponCode.trim(),
        amount: subtotal,
      });

      if (response.data.success) {
        setDiscount(response.data.discount);
        setAppliedCoupon(couponCode.trim().toUpperCase());
        toast.success(`Coupon applied! You saved ₹${response.data.discount}`);
      } else {
        setDiscount(0);
        setAppliedCoupon("");
        toast.error(response.data.message || "Invalid coupon");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-box">
      <h3>Apply Coupon</h3>

      <div className="coupon-input">
        <input
          type="text"
          placeholder="Enter Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          disabled={!!appliedCoupon}
        />

        {/* Button is disabled after a coupon is successfully applied */}
        <button onClick={applyCoupon} disabled={!!appliedCoupon || loading}>
          {loading ? "..." : appliedCoupon ? "Applied ✓" : "Apply"}
        </button>
      </div>

      {/* Applied badge */}
      {appliedCoupon && (
        <p className="coupon-success">
          ✅ <strong>{appliedCoupon}</strong> applied — you saved ₹{discount}!
        </p>
      )}

      {/* Available coupons hint */}
      <div className="coupon-list">
        <p><b>Available Coupons</b></p>
        <p>🎉 WELCOME10 → 10% OFF</p>
        <p>💰 SAVE50 → Flat ₹50 OFF</p>
      </div>
    </div>
  );
};

export default Coupon;

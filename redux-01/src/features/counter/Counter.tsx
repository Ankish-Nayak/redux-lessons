import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  decrement,
  increment,
  incrementByAmount,
  decrementByAmount,
} from "./couterSlice";
import { useState } from "react";

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<number>(0);

  const handleOnClick = (buttonName: string) => {
    switch (buttonName) {
      case "increment": {
        dispatch(increment());
        break;
      }
      case "decrement": {
        dispatch(decrement());
        break;
      }
      case "incrementByAmount": {
        dispatch(incrementByAmount(amount));
        break;
      }
      case "decrementByAmount": {
        dispatch(decrementByAmount(amount));
        break;
      }
      default:
        console.log("wrong name passed");
    }
    setAmount(0);
  };
  return (
    <section
      style={{
        fontSize: "35px",
      }}
    >
      <p>{count}</p>
      <input
        type="number"
        onChange={(e) => {
          const value = e.target.value;
          try {
            const v = parseInt(value);
            if (typeof v === "number") {
              setAmount(v);
            } else {
              setAmount(0);
            }
          } catch (e) {
            setAmount(0);
          }
        }}
        placeholder="Enter the amount by which you want to decrement/increment"
        value={amount.toString()}
      />
      <div>
        <button
          type={"button"}
          onClick={() => {
            handleOnClick("increment");
          }}
        >
          +
        </button>
        <button type={"button"} onClick={() => handleOnClick("decrement")}>
          -
        </button>
        <div>
          <button
            type={"button"}
            onClick={() => handleOnClick("incrementByAmount")}
          >
            incrementByAmount
          </button>
          <button
            type={"button"}
            onClick={() => handleOnClick("decrementByAmount")}
          >
            decrementByAmount
          </button>
        </div>
      </div>
    </section>
  );
};

export default Counter;

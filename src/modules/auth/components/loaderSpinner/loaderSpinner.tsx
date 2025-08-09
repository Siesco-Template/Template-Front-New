import { FC } from "react";
import styles from "./spinner.module.css";
import { IColorType } from "../../types";

type ISpinnerSize = "sm" | "md" | "lg";

interface ISpinner {
  size?: ISpinnerSize;
  color?: IColorType;
}

const sizeStyles: Record<ISpinnerSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const Spinner: FC<ISpinner> = ({ color = "primary", size = "md" }) => {
  return (
    <div
      className={[styles.spinner, sizeStyles[size], styles[color]].join(" ")}
    />
  );
};

export default Spinner;

import styles from "./Button.module.css";

interface Props {
  text: string;
  type: "submit" | "reset" | "button";
}
const Button = ({ text, type = "submit" }: Props) => {
  return (
    <button
      type={type}
      className={`${styles.btnEffect} bg-orange-600 hover:bg-orange-500 transition-all duration-500 hover:opacity-95 py-1`}
    >
      {text}
    </button>
  );
};

export default Button;

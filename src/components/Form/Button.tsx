import styles from "./Button.module.css";

interface Props {
  text: string;
}
const Button = ({ text }: Props) => {
  return (
    <button
      className={`${styles.btnEffect} hover:bg-orange-500 transition-all duration-500 hover:opacity-90 `}
    >
      {text}
    </button>
  );
};

export default Button;

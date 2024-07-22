const Button = ({ disabled, styles, handleClick, title }) => {
  return (
    <button
      className={`btn ${styles}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default Button;

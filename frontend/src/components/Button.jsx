import PropTypes from "prop-types";

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

Button.propTypes = {
  disabled: PropTypes.bool,
  styles: PropTypes.string,
  handleClick: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default Button;

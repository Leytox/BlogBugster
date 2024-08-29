import PropTypes from "prop-types";

const FeatureCard = ({image, title, icon, description, styles}) => {
  return (
      <div
          id={"feature-card"}
          className={`flex flex-col gap-8 w-[500px] h-[550px] rounded-lg gradient text-center text-white p-4
       hover:cursor-help max-sm:w-[300px] max-sm:h-[550px] shadow-2xl drop-shadow-2xl ${styles}`}
      >
        <div>
          <img src={image} alt={title}/>
        </div>
        <div>
          <h1 className={"text-4xl"}>
            {title} {icon}
          </h1>
          <p>{description}</p>
        </div>
      </div>
  );
};

FeatureCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  description: PropTypes.string.isRequired,
  styles: PropTypes.string,
};

export default FeatureCard;

const FeatureCard = ({ image, title, icon, description, styles }) => {
  return (
    <div
      id={"feature-card"}
      className={`flex flex-col gap-8 w-[500px] h-[700px] rounded-lg gradient text-center text-white p-4
       hover:cursor-help max-sm:w-[300px] max-sm:h-[550px] ${styles}`}
      style={{ boxShadow: "6px 6px 0px black" }}
    >
      <div>
        <img src={image} alt={title} />
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

export default FeatureCard;

const FeatureCard = ({ image, title, icon, description, styles }) => {
  return (
    <div
      id={"feature-card"}
      className={`flex flex-col gap-8 w-[500px] h-[700px] gradient text-center text-white p-4 hover:cursor-help ${styles}`}
      style={{ boxShadow: "5px 0 0px black" }}
    >
      <div>
        <img src={image} alt="" />
      </div>
      <div>
        <h1 className={"text-4xl "}>
          {title} {icon}
        </h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;

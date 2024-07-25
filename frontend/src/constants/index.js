import author from "/author.jpg";
import community from "/community.jpg";
import expert from "/expert.jpg";

const features = [
  {
    icon: "📝",
    title: "Expert Analysis",
    description:
      "Our platform hosts detailed write-ups on various bugs, offering step-by-step solutions and best practices to resolve them, written by industry experts and passionate amateurs alike.",
    image: expert,
  },
  {
    icon: "👥",
    title: "Community-Driven",
    description:
      "Join the conversation with our community of developers, tech enthusiasts, and bug-hunters. Share your experiences, ask questions, and learn from others in the field.",
    image: community,
  },
  {
    icon: "✍️",
    title: "Become an Author",
    description:
      "Have a knack for writing? Share your knowledge with the world by contributing to our blog. Submit your articles and get featured on our platform.",
    image: author,
  },
];

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }, { direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export { features, modules };

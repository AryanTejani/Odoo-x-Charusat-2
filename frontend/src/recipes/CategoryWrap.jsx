import React from "react";
import { Link } from "react-router-dom";

function Categoryitem({ name, href, backgroundColor, color }) {
  const style = {
    backgroundColor: backgroundColor,
    color: color,
    borderColor: color,
  };
  return (
    <div>
      <Link to={href} className="rounded-full">
        <div className="uppercase px-6 py-2 text-center rounded-full" style={style}>{name}</div>
      </Link>
    </div>
  );
}

function CategoryList() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Categoryitem
        name="entrees"
        href="/categories/entrees"
        backgroundColor="#f0f5c4"
        color="#59871f"
      />
      <Categoryitem
        name="brekfast"
        href="/categories/breakfast"
        backgroundColor="#efedfa"
        color="#3c3a8f"
      />
      <Categoryitem
        name="lunch"
        href="/categories/lunch"
        backgroundColor="#e5f7f3"
        color="#1f8787"
      />
      <Categoryitem
        name="desserts"
        href="/categories/desserts"
        backgroundColor="#e8f5fa"
        color="#397a9e"
      />
      <Categoryitem
        name="sides"
        href="/categories/sides"
        backgroundColor="#feefc9"
        color="#d16400"
      />
      <Categoryitem
        name="drinks"
        href="/categories/drinks"
        backgroundColor="#ffeae3"
        color="#f0493e"
      />
    </div>
  );
}

const CategoryWapper = () => {
  return (
    <div className="">
      <CategoryList />
    </div>
  );
};

export default CategoryWapper;

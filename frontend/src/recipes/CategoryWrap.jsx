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
        name="Appetizer"
        href="/categories/appetizer"
        backgroundColor="#f0f5c4"
        color="#59871f"
      />
      <Categoryitem
        name="Main Course"
        href="/categories/maincourse"
        backgroundColor="#efedfa"
        color="#3c3a8f"
      />
      <Categoryitem
        name="Breakfast"
        href="/categories/breakfast"
        backgroundColor="#e5f7f3"
        color="#1f8787"
      />
      <Categoryitem
        name="Salad"
        href="/categories/salad"
        backgroundColor="#e8f5fa"
        color="#397a9e"
      />
      <Categoryitem
        name="Drink"
        href="/categories/drink"
        backgroundColor="#feefc9"
        color="#d16400"
      />
      <Categoryitem
        name="Snack"
        href="/categories/snack"
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

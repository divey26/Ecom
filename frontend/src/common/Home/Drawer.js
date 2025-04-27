import React, { useState } from "react";
import { Drawer } from "antd";
import { Link } from "react-router-dom";

const DrawerNavigation = ({ visible, onClose }) => {
  const [showSubcategories, setShowSubcategories] = useState(false);

  const categories = [
    { name: "All Products", path: "/wat" },
    {
      name: "Category Eg",
      children: [
        { name: "Furniture", path: "/wat/furniture" },
        { name: "Food", path: "/wat/food" },
        { name: "Electronics", path: "/wat/electronics" },
      ],
    },
    { name: "Category 2", path: "/category2" },
    { name: "Category 3", path: "/category3" },
    { name: "Category 4", path: "/category4" },
  ];

  const toggleSubcategories = () => {
    setShowSubcategories((prev) => !prev);
  };

  return (
    <Drawer
      title="Navigation"
      placement="left"
      onClose={onClose}
      open={visible}
      width={400}
    >
      {categories.map((category, index) => (
        <div key={index}>
          <p>
            <Link
              to={category.path}
              onClick={() => {
                if (category.children) toggleSubcategories();
                else onClose();
              }}
            >
              {category.name}
            </Link>
          </p>
          {category.children && showSubcategories && (
            <div style={{ paddingLeft: "20px" }}>
              {category.children.map((child, idx) => (
                <p key={idx}>
                  <Link to={child.path} onClick={onClose}>
                    {child.name}
                  </Link>
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </Drawer>
  );
};

export default DrawerNavigation;

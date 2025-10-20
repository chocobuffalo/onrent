import React from "react";
import UserIcon from "../customIcons/UserIcon";
import "./AddOperator.scss";

export default function AddOperator({
  func,
  active,
}: {
  func: () => void;
  active: boolean;
}) {
  const activeClass = active ? "active" : "";

  return (
    <div className="header-account">
      <div className="flat-bt-top addOperator">
        <button
          className={`sc-button d-flex align-center ${activeClass}`}
          onClick={func}
        >
          <UserIcon color="#ff7101" />
          <span className={active ? "text-white" : "text-secondary"}>
            Añadir Operador
          </span>
        </button>
      </div>
    </div>
  );
}

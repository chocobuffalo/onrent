/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export default function SecretInput(props: any) {
  const [isSecret, setSecret] = useState(true);
  const toggleSecret = () => {
    setSecret(!isSecret);
  };
  const inputType = isSecret ? "password" : "text";
  return (
    <div className={`form-group relative ${props.classWrapper}`}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className="relative">
        <input
          ref={props.register(props.id).ref}
          onChange={props.register(props.id).onChange}
          onBlur={props.register(props.id).onBlur}
          name={props.id}
          type={inputType}
          className={`form-control appearance-none ${props.inputClass}`}
          id={props.id}
          placeholder={props.placeHolder}
        />
        <span
          className="toggle-password absolute right-1 top-0 p-2"
          onClick={toggleSecret}
        >
          {isSecret ? (
            <FaRegEyeSlash fontSize={30} />
          ) : (
            <FaRegEye fontSize={30} />
          )}
        </span>
      </div>
      {props.errors[props.id] && (
        <p className="text-red-500 mt-1 text-danger">
          {props.errors[`${props.id}`].message}
        </p>
      )}
    </div>
  );
}

import { ReactNode } from "react";

export default function MainBox(props: {
  children: ReactNode;
  className?: string;
  title?: string;
  style?: any;
}) {
  return (
    <div
      className={`main-box ${props.className ? props.className : ""}`}
      style={props.style}
    >
      <div className="main-box-content">
        {props.title && <h1>{props.title}</h1>}
        {props.children}
      </div>
    </div>
  );
}

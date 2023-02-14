import { ReactNode } from "react";

export default function MiniBox(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mini-box ${props.className ? props.className : ""}`}>
      <div className="mini-box-content">{props.children}</div>
    </div>
  );
}

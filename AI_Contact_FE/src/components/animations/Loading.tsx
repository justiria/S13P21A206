import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import "../../styles/Loading.css";

export default function Loading() {
  return (
    <div className="loading" style={{}} aria-label="로딩중">
      <TailChase size="100" speed="1.75" color="#735ae1" />
    </div>
  );
}

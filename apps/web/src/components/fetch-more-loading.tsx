import clsx from "clsx";
import BoxLoading from "./box-loading";

export default function FetchMoreLoading({ className }: { className?: string }) {
  return (
    <div className={clsx("grid place-content-center scale-50", className)}>
      <BoxLoading />
    </div>
  )
}
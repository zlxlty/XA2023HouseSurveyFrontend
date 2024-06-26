import { useTitle as _useTitle } from "react-use";

export function useTitle(...titleComponents: string[]) {
  const components = [
    ...(titleComponents || []),
    "Mirro AI 镜"
  ]
  const title = components.join(" | ");
  _useTitle(title, {
    restoreOnUnmount:true
  })
}

import { ModeToggle } from "../toggle-mode";
import Menu from "./menu";

export function NavComponent() {
  return (
    <div className="flex justify-end gap-5 menu-section basis-4/5">
      <ModeToggle />
      <Menu />
    </div>
  );
}

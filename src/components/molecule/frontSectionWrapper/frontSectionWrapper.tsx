// import { CustomMetadata } from "@/types";

export default function FrontSectionWrapper({
  children,
  identicator,
  extraClass,
}: {
  children: React.ReactNode;
  identicator: string;
  extraClass?: string;
}) {
  const classes = extraClass ? ` ${extraClass}` : "";
  return (
    <section id={identicator} className={`px-3.5 w-full${classes}`}>
      <div className="container mx-auto">{children}</div>
    </section>
  );
}

import LayoutWithHeaderAndFooter from "@/src/components/layouts/layoutWithHeaderFooter";

export default function BridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <LayoutWithHeaderAndFooter>{children}</LayoutWithHeaderAndFooter>
    </section>
  );
}

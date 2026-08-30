import Link from "next/link";

interface Props {
  className: string;
  label?: string;
  title?: string;
}

export default function AdPlaceholderTile({
  className,
  label = "Promote Your Business",
  title = "Advertise Here",
}: Props) {
  return (
    <Link className={className} href="/advertise" title="Advertise on Events4Singles">
      <span aria-hidden="true">+</span>
      <strong>{title}</strong>
      <em>{label}</em>
    </Link>
  );
}

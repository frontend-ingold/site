export function PrimaryButton({ label, variant = "primary", href = "#" }) {
  return (
    <a className={`button button-${variant}`} href={href}>
      {label}
    </a>
  );
}

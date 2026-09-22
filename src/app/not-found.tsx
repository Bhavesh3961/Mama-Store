import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <div className="shell empty">
        <h1>Page not found</h1>
        <p className="muted" style={{ margin: "8px 0 16px" }}>
          That link is not part of the shop.
        </p>
        <Link className="btn" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}

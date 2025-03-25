export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>Account</h1>
      <ul>
        <li>
          <a href="/account/profile">Profile</a>
        </li>
        <li>
          <a href="/account/orders">Orders</a>
        </li>
      </ul>
      <div>{children}</div>
    </div>
  );
}

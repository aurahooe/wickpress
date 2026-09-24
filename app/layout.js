import "./globals.css";

export const metadata = {
  title: "Wick — a press that turns hourly",
  description: "Write a note. Keep it private or pin it to the public wall. Every hour the edition changes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="shell">
          <header className="top">
            <a className="mark" href="/">
              Wick
              <small>Hourly press</small>
            </a>
            <nav>
              <a href="/">The hour</a>
              <a href="/wall">The wall</a>
              <a href="/desk">Desk</a>
              <a href="/login">Sign in</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

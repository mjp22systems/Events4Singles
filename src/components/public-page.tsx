type PublicMainProps = {
  children: React.ReactNode;
  className?: string;
  shell?: boolean;
};

type PublicPageFootProps = {
  children: React.ReactNode;
  className?: string;
  shell?: boolean;
};

type InfoPageProps = {
  children: React.ReactNode;
  className?: string;
};

type IndexPageProps = {
  children: React.ReactNode;
  className?: string;
};

function classes(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

export function PublicMain({ children, className, shell = false }: PublicMainProps) {
  return (
    <main className={classes(shell && "e4s-shell", className)} id="site-content">
      {children}
    </main>
  );
}

export function PublicPageFoot({ children, className, shell = true }: PublicPageFootProps) {
  return (
    <div className={classes(shell && "e4s-shell", "e4s-page-foot", className)}>
      {children}
    </div>
  );
}

export function InfoPage({ children, className }: InfoPageProps) {
  return (
    <PublicMain className={classes("e4s-info-page", className)} shell>
      {children}
    </PublicMain>
  );
}

export function IndexPage({ children, className }: IndexPageProps) {
  return (
    <PublicMain className={classes("e4s-index-page", className)}>
      {children}
    </PublicMain>
  );
}

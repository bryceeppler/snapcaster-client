
interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actionButton?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  className,
  actionButton
}: PageHeaderProps) {
  return (
    <header className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight md:text-3xl"
          id="page-title"
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actionButton && (
        <div className="flex items-center space-x-2">{actionButton}</div>
      )}
    </header>
  );
}

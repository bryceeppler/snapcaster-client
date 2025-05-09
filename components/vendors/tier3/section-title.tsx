const SectionTitle = ({
  subtitle,
  title,
  paragraph,
  width = '635px',
  center,
  variant = 'light'
}: {
  subtitle?: string;
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  variant?: 'light' | 'dark';
}) => {
  return (
    <div className="-mx-4 flex flex-wrap">
      <div
        className={`wow fadeInUp w-full px-4 ${
          center ? 'mx-auto text-center' : ''
        }`}
        data-wow-delay=".1s"
        style={{ maxWidth: width }}
      >
        {subtitle && (
          <span
            className={`mb-2 block text-lg font-semibold ${
              variant === 'light' ? 'text-primary' : 'text-[#ffcc5d]'
            }`}
          >
            {subtitle}
          </span>
        )}
        <h2
          className={`mb-4 text-3xl font-bold ${
            variant === 'light' ? 'text-black' : 'text-white'
          } sm:text-4xl md:text-[40px] md:leading-[1.2]`}
        >
          {title}
        </h2>
        <p
          className={`text-base leading-relaxed ${
            variant === 'light' ? 'text-black' : 'text-white'
          } sm:leading-relaxed`}
        >
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SectionTitle;

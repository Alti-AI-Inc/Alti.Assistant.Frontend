export const AppContainer = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
) => {
  return (
    <div
      {...props}
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export function Container({ className = "", id = "", children }) {
  return (
    <div className={className} id={id}>
      {children}
    </div>
  );
}

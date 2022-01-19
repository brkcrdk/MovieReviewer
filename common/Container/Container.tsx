export function Container({ className = "", id = "", children, style = {} }) {
  return (
    <div className={className} id={id} style={style}>
      {children}
    </div>
  );
}

export default function FieldLabel({ htmlFor, required, children }) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required ? (
        <abbr className="req" title="Required">
          *
        </abbr>
      ) : null}
    </label>
  );
}

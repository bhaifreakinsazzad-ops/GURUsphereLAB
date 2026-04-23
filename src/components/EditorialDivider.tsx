interface Props {
  className?: string;
}

/** Thin gold rule + diamond — separates editorial sections. */
const EditorialDivider = ({ className = "" }: Props) => (
  <div className={`editorial-divider section-padding ${className}`} aria-hidden="true">
    <span className="diamond" />
  </div>
);

export default EditorialDivider;

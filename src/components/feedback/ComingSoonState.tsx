import "./states.css";
/** Standard placeholder for features that exist structurally but aren't built yet. */
export function ComingSoonState({ feature }: { feature: string }) {
  return (
    <div className="fk-state">
      <h3 className="fk-state__title">{feature}</h3>
      <p className="fk-state__msg">This feature isn't available yet. Its place in the app is reserved and will be filled in a later stage.</p>
    </div>
  );
}

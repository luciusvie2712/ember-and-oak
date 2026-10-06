import type { PublicContactInformation, PublicRestaurantLocation } from "@ember-and-oak/types";

type Props = Readonly<{
  location: PublicRestaurantLocation;
  contact: PublicContactInformation;
  showName?: boolean;
}>;

export function ContactInformation({ location, contact, showName = true }: Props) {
  const address = [
    location.addressLine1,
    location.addressLine2,
    location.wardOrDistrict,
    location.city,
    location.region,
    location.postalCode,
  ].filter(Boolean);

  return (
    <address className="operational-contact">
      {showName ? <strong>{location.name}</strong> : null}
      <p>{address.join(", ")}</p>
      <a href={`mailto:${contact.email}`}>{contact.email}</a>
      <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
      {location.directionsUrl ? (
        <a href={location.directionsUrl} rel="noreferrer" target="_blank">
          Get Directions <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </address>
  );
}

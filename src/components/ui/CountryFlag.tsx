import Image from "next/image";

import { getCountryFlagSrc } from "@/lib/ui/countryFlag";

type CountryFlagProps = {
  isoA2: string;
  className?: string;
};

/** Country flag image sized to match adjacent text (`height: 1em` via CSS). */
export function CountryFlag({ isoA2, className }: CountryFlagProps) {
  const src = getCountryFlagSrc(isoA2);
  if (!src) {
    return null;
  }

  return <Image src={src} alt="" width={30} height={20} className={className} draggable={false} />;
}

import { siteConfig } from "@/lib/site-config";
import Image from "next/image";
interface CoFounderBrandingProps {
  text?: string;
  className?: string;
}
const CoFounderBranding = ({
  text = siteConfig.branding.text,
  className = "",
}: CoFounderBrandingProps) => {
  return (
    <div className={`flex items-center justify-center gap-2 py-4 ${className}`}>
      <div className="flex -space-x-2">
        <div className="w-10 h-10 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center overflow-hidden">
          <Image
            src={"/CoFounder.ico"}
            alt="Co-Founder BD"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
        {text}
      </p>
    </div>
  );
};
export default CoFounderBranding;

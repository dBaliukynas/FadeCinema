import * as React from "react";
import LogoIcon from "./svgs/LogoIcon";
import LogoText from "./svgs/LogoText";

type LogoProps = {
    className: string
};
const Logo = ({ className }: LogoProps) => (
    <div className={className}>
        <LogoIcon /> <LogoText />
    </div>
);
export default Logo;

import React from "react";
import CircleIcon from "./svgs/CircleIcon";

type Props = {
    text: string[],
    steps: number,
};

const Stepper = ({ text, steps }: Props) => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            {Array.from({ length: steps }).map((_, i) => (
                <React.Fragment key={i}>
                    <div className="stepper-item">
                        <span className="position-absolute text-light">{i + 1}</span>
                        <span className="stepper-text">{text[i]}</span>
                        <CircleIcon fill={true} />
                    </div>
                    {i != steps - 1 && <hr style={{ "width": `${(0.25 * (1-(0.1*steps)))*100}%`, "height": "3px" }} />}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Stepper;

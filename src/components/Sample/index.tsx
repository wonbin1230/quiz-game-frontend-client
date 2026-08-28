import React from "react";
import { ComponentSample } from "./style";

interface IProps {
    text?: string,
}

const Sample = ({ text }: IProps) => {
	return (
		<>
      <ComponentSample>{text}</ComponentSample>
		</>
	);
};

export default Sample;
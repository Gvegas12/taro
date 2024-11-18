import { FC } from "react";

import clsx from "clsx";

import s from "./Template.module.scss";

interface TemplateProps {
	className?: string;
}

export const Template: FC<TemplateProps> = ({ className }) => {
	return <div className={clsx(s.Template, className)}>Template</div>;
};

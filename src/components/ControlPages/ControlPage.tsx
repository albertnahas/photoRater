import React, { FC } from 'react';
import { Container } from '@mui/material';

export var ControlPage: FC<Props> = function ({ children }) {
    return <Container sx={{ p: 6, flexGrow: 1 }}>{children}</Container>;
};
interface Props {
    children: JSX.Element;
}

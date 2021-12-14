import React, { FC } from 'react';
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup
} from '@mui/material';

export var SortBySelect: FC<Props> = function (props) {
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">{props.label}</FormLabel>
            <RadioGroup
                row
                aria-label={props.name}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            >
                <FormControlLabel
                    value="uploadedAt"
                    control={<Radio size="small" />}
                    label="Date"
                />
                <FormControlLabel
                    value="rate"
                    control={<Radio size="small" />}
                    label="Rate"
                />
                <FormControlLabel
                    value="votesCount"
                    control={<Radio size="small" />}
                    label="Votes Count"
                />
            </RadioGroup>
        </FormControl>
    );
};

interface Props {
    label: string;
    value?: string;
    name: string;
    onChange: (event: any, value: string) => void;
}

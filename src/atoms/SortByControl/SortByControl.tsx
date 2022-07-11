import { ButtonGroup, IconButton, Tooltip } from '@mui/material';
import React, { FC } from 'react';
import EventIcon from '@mui/icons-material/Event';
import GradeIcon from '@mui/icons-material/Grade';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { sort } from '../../hooks/useUserPhotos';

export var SortByControl: FC<Props> = function (props) {
    return (
        <ButtonGroup
            sx={{ boxShadow: '1px 1px 10px 0px #efefef' }}
            color="secondary"
            variant="outlined"
        >
            <Tooltip title="Sort by date">
                <IconButton
                    aria-label="add"
                    size="large"
                    color={
                        props.value === 'uploadedAt' ? 'primary' : 'secondary'
                    }
                    onClick={() => {
                        props.onChange('uploadedAt');
                    }}
                >
                    <EventIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Sort by rate">
                <IconButton
                    aria-label="add"
                    size="large"
                    color={props.value === 'rate' ? 'primary' : 'secondary'}
                    onClick={() => {
                        props.onChange('rate');
                    }}
                >
                    <GradeIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Sort by votes count">
                <IconButton
                    aria-label="add"
                    size="large"
                    color={
                        props.value === 'votesCount' ? 'primary' : 'secondary'
                    }
                    onClick={() => {
                        props.onChange('votesCount');
                    }}
                >
                    <GroupAddIcon />
                </IconButton>
            </Tooltip>
        </ButtonGroup>
    );
};

interface Props {
    value?: sort;
    onChange: (value: sort) => void;
}

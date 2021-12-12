import React from 'react';
import { FC } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

export var TabsNav: FC<Props> = function ({ tabId, setTabId }) {
    return (
        <Box>
            <BottomNavigation
                showLabels
                value={tabId}
                onChange={(event, newValue) => {
                    setTabId(newValue);
                }}
            >
                <BottomNavigationAction
                    label="My Photos"
                    icon={<PhotoLibraryIcon />}
                />
                <BottomNavigationAction label="Rate" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
            </BottomNavigation>
        </Box>
    );
};

export interface Props {
    tabId: any;
    setTabId: any;
}

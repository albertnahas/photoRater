import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Bell as BellIcon } from '../../icons/bell';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { alpha, useTheme } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import { Logo } from '../../icons/logo';
import { useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StyledMenu = styled((props: any) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[0],
}));

export const TopBar = (props: any) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme()
    const user = useSelector((state: any) => state.user.value)

    const open = Boolean(anchorEl);

    const handleNotificationsClick = (event: any) => {
        if (user.newVotes > 0) {
            setAnchorEl(event.currentTarget);
        }
    };
    const handleNotificationsClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <DashboardNavbarRoot
                sx={{

                }}
                theme={theme}
                position="sticky"
            >
                <Toolbar
                    sx={{
                        minHeight: 64,
                        left: 0,
                        px: 2
                    }}
                >
                    {user && <>
                        <Tooltip title="Logout">
                            <IconButton onClick={props.signOut} sx={{ ml: 1 }}>
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Box sx={{ flexGrow: 1 }} />
                        <Tooltip title="Notifications">
                            <IconButton sx={{ ml: 1 }} onClick={handleNotificationsClick}>
                                <Badge
                                    badgeContent={user.newVotes || 0}
                                    color="primary"
                                    variant="dot"
                                >
                                    <BellIcon fontSize="small" />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Avatar
                            sx={{
                                height: 40,
                                width: 40,
                                ml: 1
                            }}
                            src={user.photoURL}
                        >
                            <UserCircleIcon fontSize="small" />
                        </Avatar>
                        <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleNotificationsClose}
                        >
                            <MenuItem onClick={handleNotificationsClose}>
                                <FavoriteBorderIcon style={{ fill: theme.palette.error.main }} color="error" />
                                You have {user.newVotes} new votes</MenuItem>
                        </StyledMenu>
                    </>}
                    {!user && <>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography color="primary" sx={{ mr: 1 }}>Photo Rater</Typography>
                        <Logo sx={{ width: 32, height: 32 }} />
                    </>
                    }
                </Toolbar>

            </DashboardNavbarRoot>
        </>
    );
};

TopBar.propTypes = {
    signOut: PropTypes.func
};
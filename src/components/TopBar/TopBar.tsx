import React, { FC, MouseEvent } from 'react';
import styled from '@emotion/styled';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Theme,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { alpha, useTheme } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Logo } from '../../icons/logo';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { Bell as BellIcon } from '../../icons/bell';
import { State } from '../../types/state';
import { useNavigate, Link } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';

const StyledMenu = styled((props: any) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light'
                ? 'rgb(55, 65, 81)'
                : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5)
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                )
            }
        }
    }
}));

const DashboardNavbarRoot = styled(AppBar)(({ theme }: any) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[0]
}));

export var TopBar: FC<Props> = function (props) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const theme = useTheme();
    const user = useSelector((state: State) => state.user.value);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleNotificationsClick = (event: MouseEvent) => {
        if ((user?.newVotes || 0) > 0) {
            setAnchorEl(event.currentTarget);
        }
    };
    const handleNotificationsClose = () => {
        setAnchorEl(null);
    };
    return (
        <DashboardNavbarRoot sx={{}} theme={theme} position="sticky">
            <Toolbar
                sx={{
                    minHeight: 64,
                    left: 0,
                    px: 2
                }}
            >
                {user ? (
                    <>
                        <Tooltip title="Logout">
                            <IconButton onClick={props.signOut} sx={{ ml: 1 }}>
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Box sx={{ flexGrow: 1 }} />
                        {props.deferredPrompt && (
                            <Tooltip title="Install the app">
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={props.handleInstallClick}
                                    sx={{ ml: 1 }}
                                >
                                    Install
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip title="Notifications">
                            <IconButton
                                sx={{ ml: 1 }}
                                onClick={handleNotificationsClick}
                            >
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
                            alt="profile photo"
                        >
                            <UserCircleIcon fontSize="small" />
                        </Avatar>
                        <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button'
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleNotificationsClose}
                        >
                            <MenuItem onClick={handleNotificationsClose}>
                                <FavoriteBorderIcon
                                    style={{
                                        fill: theme.palette.error.main
                                    }}
                                    color="error"
                                />
                                You have {user.newVotes} new votes
                            </MenuItem>
                        </StyledMenu>
                    </>
                ) : (
                    <>
                        <Tooltip title="Login">
                            <IconButton
                                onClick={() => navigate('/login')}
                                sx={{ ml: 1 }}
                            >
                                <UserCircleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography color="primary" sx={{ mr: 1 }}>
                            Photo Rater
                        </Typography>
                        <Link to="/">
                            <Logo sx={{ width: 32, height: 32 }} />
                        </Link>
                    </>
                )}
            </Toolbar>
        </DashboardNavbarRoot>
    );
};

interface Props {
    signOut: () => void;
    handleInstallClick: () => void;
    deferredPrompt: any;
}

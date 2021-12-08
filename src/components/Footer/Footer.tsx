import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    Link,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemButton
} from "@mui/material";
import Info from "@mui/icons-material/InfoRounded";
import Security from "@mui/icons-material/SecurityRounded";
import { Logo } from "../../icons/logo";
import { useNavigate } from "react-router-dom";

export const Footer = (props: any) => {
    const navigate = useNavigate()

    return (
        <>
            <AppBar position="static" elevation={0} component="footer" color="default">
                <Grid container sx={{ minHeight: "212px", justifyContent: 'center' }}>
                    <Grid container item md={10} sx={{ justifyContent: 'space-between' }}>
                        <Grid item md={4} xs={12} sx={{display:'flex', alignItems: 'center'}}>
                            <Logo sx={{ width: 60, height: 60, ml: 'auto', mr: 'auto' }} />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <List sx={{mt:4}} dense={true}>
                                <ListItem>
                                    <ListItemButton onClick={() => navigate("/")}>
                                        <ListItemText
                                            primary="Home"
                                            color="text.secondary"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton onClick={() => navigate("/about")}>
                                        <ListItemText
                                            primary="About"
                                            color="text.secondary"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton onClick={() => navigate("/terms")}>
                                        <ListItemText
                                            primary="Terms and Conditions"
                                            color="text.secondary"
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton onClick={() => navigate("/privacy")}>
                                        <ListItemText
                                            primary="Privacy Policy"
                                            color="text.secondary"
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Grid>

                <Toolbar style={{ justifyContent: "center" }}>
                    <Typography variant="caption">©2021</Typography>
                </Toolbar>
            </AppBar>
        </>
    )
}

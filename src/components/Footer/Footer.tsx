import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Logo } from '../../icons/logo'
import InstagramIcon from '@mui/icons-material/Instagram'

export var Footer = function () {
  return (
    <AppBar position="static" elevation={0} component="footer" color="default">
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid container item md={10} sx={{ justifyContent: 'space-between' }}>
          <Grid
            item
            md={4}
            xs={12}
            sx={{
              minHeight: 100,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Logo
              sx={{
                width: 60,
                height: 60,
                ml: 'auto',
                mr: 'auto'
              }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <List sx={{ mt: 4 }} dense>
              <ListItem button component={Link} to="/">
                <ListItemText primary="Home" color="text.secondary" />
              </ListItem>
              <ListItem button component={Link} to="/about">
                <ListItemText primary="About" color="text.secondary" />
              </ListItem>
              <ListItem button component={Link} to="/terms">
                <ListItemText
                  primary="Terms and Conditions"
                  color="text.secondary"
                />
              </ListItem>
              <ListItem button component={Link} to="/privacy">
                <ListItemText primary="Privacy Policy" color="text.secondary" />
              </ListItem>
              <ListItem button component={Link} to="/contact">
                <ListItemText primary="Contact us" color="text.secondary" />
              </ListItem>
              <ListItem
                button
                component="a"
                target="_blank"
                href="https://www.instagram.com/photoraterapp"
              >
                <ListItemIcon>
                  <InstagramIcon />
                </ListItemIcon>
              </ListItem>
              <ListItem>
                <div
                  className="fb-like"
                  data-href="https://www.facebook.com/photoraterapp/"
                  data-width=""
                  data-layout="standard"
                  data-action="like"
                  data-size="small"
                  data-share="true"
                ></div>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>

      <Toolbar style={{ justifyContent: 'center' }}>
        <Typography variant="caption">©2021</Typography>
      </Toolbar>
    </AppBar>
  )
}

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import StyledBadge from '../../components/UI/AvatarOnline/AvatarStyledBadge'
import { Typography } from '@material-ui/core';

const LeftUser = (props) => {
    const { user, onClick } = props;
    return (
        <div>
            <ListItem button onClick={() => onClick(user)}>
                <ListItemIcon>
                    <StyledBadge className={user.isOnline ? 'online' : 'offline'}>
                        <Avatar alt={user.userName} src={user.file} />
                    </StyledBadge>
                </ListItemIcon>
                <ListItemText primary={user.userName}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                Last message ...
                            </Typography>
                        </React.Fragment>
                    }
                />

                {/* <ListItemText secondary={user.isOnline ? "online" : "offline"} align="right"></ListItemText> */}
            </ListItem>
        </div>
    )
}
export default LeftUser;
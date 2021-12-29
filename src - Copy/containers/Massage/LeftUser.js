import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import StyledBadge from '../../components/UI/AvatarOnline/AvatarStyledBadge'

const LeftUser = (props) => {
    const { user, onClick } = props;
    return (
        <div>
            <ListItem button onClick={() => onClick(user)}>
                <ListItemIcon>
                    <StyledBadge>
                        <Avatar alt={user.userName} src={user.file} />
                    </StyledBadge>
                </ListItemIcon>
                <ListItemText primary={user.userName}>{user.userNAme}</ListItemText>
                <ListItemText secondary={user.isOnline ? "online" : "offline"} align="right"></ListItemText>
            </ListItem>
        </div>
    )
}
export default LeftUser;
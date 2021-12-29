import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '&.offline .MuiBadge-badge': {
        backgroundColor: 'red',
        color: 'red',
    },
    '&.online .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
    },
    '& .MuiBadge-badge': {
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },

    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const BadgeAvatars = ({ children }) => {
    return (
        <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            variant="dot"
            className="offline"
        >
            {children}
        </StyledBadge>
    );
}

export default BadgeAvatars;
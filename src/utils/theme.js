import React, { } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { purple } from '@material-ui/core/colors';
import { pink } from '@material-ui/core/colors';
// import { blue } from '@material-ui/core/colors';
// import { orange } from '@material-ui/core/colors';


const LightTheme = createTheme({
    palette: {
        type: "light",
        primary: {
            main: pink[500],
        },

        secondary: {
            main: green[500],
        },
    },
});
// const DarkTheme = createTheme({
//     palette: {
//         type: "dark",
//         primary: {
//             main: purple[500],
//         },

//         secondary: {
//             main: green[500],
//         },
//     },
// });



const Theme = ({ children }) => {
    return (
        <ThemeProvider theme={LightTheme}>{children}</ThemeProvider>
    )
};
export default Theme;


// const theme = {
//     colors: {
//         main: '#003459',
//         mainDark: '#21283e',
//         mainLight: '#2c3247',
//         mainLighter: '#2f82b8',
//         textColor: '#333',
//         whiteColor: '#fff',
//         errorRed: '#ff5757',
//         shadow: 'rgba(0,0,0,.2)',
//         mainBhautik: 'red',
//     },

//     mediaQueries: {
//         smallest: `only screen and (max-width: 567px)`,
//         small: `only screen and (max-width: 767px)`,
//         medium: `only screen and (max-width: 991px)`,
//         large: `only screen and (max-width: 1199px)`,
//         largest: `only screen and (max-width: 1400px)`,
//     },
// };  
// export default theme;

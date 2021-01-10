// tslint:disable-next-line:cyclomatic-complexity
const Reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'isMobile':
            return {
                ...state,
                isMobile: action.payload,
            };
        case 'isReactNative':
            return {
                ...state,
                isReactNative: action.payload,
            };
        case 'isLoading':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'showSnackbar':
            return {
                ...state,
                snackbarIsVisible: true,
                snackbar: action.payload,
            };
        case 'hideSnackbar':
            return {
                ...state,
                snackbarIsVisible: false,
                snackbar: {},
            };
        case 'isDark':
            return {
                ...state,
                isDark: action.payload,
            };
        default:
            return state;
    }
};

export default Reducer;

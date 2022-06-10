//https://github.com/dev-seb/react-native-tv-demo/blob/b0e3099953340aaf904c48ce5a6d9bd42780bc30/src/components/focusable/FocusableHighlight.js#L1

import React, { useState, useRef, forwardRef } from 'react';
import { TouchableHighlight, View } from 'react-native';


const FocusableHighlight = forwardRef((props, ref) => {
    const [focused, setFocused] = useState(false);
    const [pressed, setPressed] = useState(false);

    return (
        <TouchableHighlight
            {...props}
            ref={ref}
            onPress={(event) => {
                setPressed(true);
                props.onPress(event);
                // if (event.eventKeyAction !== undefined) {
                //     setPressed(parseInt(event.eventKeyAction) === 0);
                //     if (props.onPress) {
                //         props.onPress(event);
                //     }
                // }
            }}
            onFocus={(event) => {
                console.log('focus: ' + props.nativeID);
                setFocused(true);
                if (props.onFocus) {
                    props.onFocus(event);
                }
            }}
            onBlur={(event) => {
                setFocused(false);
                if (props.onBlur) {
                    props.onBlur(event);
                }
            }}
            style={[
                props.style,
                focused && props.styleFocused,
                pressed && props.stylePressed,
            ]}>
            {props.children || <View />}
        </TouchableHighlight>
    );
});

export default FocusableHighlight;
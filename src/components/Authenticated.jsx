import React from "react";

export default function Authenticated({isAuthenticated, children}) {
    return <>{isAuthenticated? children[0] : children[1]}</>
}
import { ComponentType, PropsWithChildren } from "react";
/**
 * Wrapper lifecycle events
 */
export declare enum WrapperLifecycle {
    /**
     * An event to request the wrapper. It is sent by Element to get the wrapper provided by the module if any.
     */
    Wrapper = "wrapper"
}
/**
 * Opts object that is populated with a Wrapper.
 */
export declare type WrapperOpts = {
    /**
     * A Wrapper React Component to be rendered around the Matrix Chat.
     */
    Wrapper: ComponentType<PropsWithChildren<{}>>;
};
/**
 * Helper type that documents how to implement a wrapper listener.
 */
export declare type WrapperListener = (opts: WrapperOpts) => void;

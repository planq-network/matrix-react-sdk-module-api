import React from "react";
import { PlainSubstitution, TranslationStringsObject } from "./types/translations";
import { DialogContent, DialogProps } from "./components/DialogContent";
import { AccountAuthInfo } from "./types/AccountAuthInfo";
import { ModuleUiDialogOptions } from "./types/ModuleUiDialogOptions";
import { App } from "./types/App";
import { Container } from "./types/Container";
/**
 * A module API surface for the react-sdk. Provides a stable API for modules to
 * interact with the internals of the react-sdk without having to update themselves
 * for refactorings or code changes within the react-sdk.
 *
 * An instance of a ModuleApi is provided to all modules at runtime.
 */
export interface ModuleApi {
    /**
     * Register strings with the translation engine. This supports overriding strings which
     * the system is already aware of.
     * @param translations The translations to load.
     */
    registerTranslations(translations: TranslationStringsObject): void;
    /**
     * Runs a string through the translation engine. If variables are needed, use %(varName)s
     * as a placeholder for varName in the variables object.
     * @param s The string. Should already be known to the engine.
     * @param variables The variables to replace, if any.
     * @returns The translated string.
     */
    translateString(s: string, variables?: Record<string, PlainSubstitution>): string;
    /**
     * Opens a dialog in the client.
     * @param initialTitleOrOptions Initial options for the dialog. Can be the title of the dialog, or a
     *                              configuration object. Note that the dialog implementation may later
     *                              modify its own options via the {@link DialogProps.setOptions} callback.
     * @param body The function which creates a body component for the dialog.
     * @param props Optional props to provide to {@link body}, in addition to the common set in {@link DialogProps}.
     * @returns Whether the user submitted the dialog or closed it, and the model returned by the
     * dialog component if submitted.
     */
    openDialog<M extends object, P extends DialogProps = DialogProps, C extends DialogContent<P> = DialogContent<P>>(initialTitleOrOptions: string | ModuleUiDialogOptions, body: (props: P, ref: React.RefObject<C>) => React.ReactNode, props?: Omit<P, keyof DialogProps>): Promise<{
        didOkOrSubmit: boolean;
        model: M;
    }>;
    /**
     * Registers for an account on the currently connected homeserver. This requires that the homeserver
     * offer a password-only flow without other flows. This means it is not traditionally compatible with
     * homeservers like matrix.org which also generally require a combination of reCAPTCHA, email address,
     * terms of service acceptance, etc.
     * @param username The username to register.
     * @param password The password to register.
     * @param displayName Optional display name to set.
     * @returns Resolves to the authentication info for the created account.
     */
    registerSimpleAccount(username: string, password: string, displayName?: string): Promise<AccountAuthInfo>;
    /**
     * Switches the user's currently logged-in account to the one specified. The user will not
     * be warned.
     * @param accountAuthInfo The authentication info to log in with.
     * @returns Resolves when complete.
     */
    overwriteAccountAuth(accountAuthInfo: AccountAuthInfo): Promise<void>;
    /**
     * Switches the user's current view to look at the given permalink. If the permalink is
     * a room, it can optionally be joined automatically if required.
     *
     * Permalink must be a matrix.to permalink at this time.
     * @param uri The URI to navigate to.
     * @param andJoin True to also join the room if needed. Does nothing if the link isn't to
     * a room.
     * @returns Resolves when complete.
     */
    navigatePermalink(uri: string, andJoin?: boolean): Promise<void>;
    /**
     * Gets a value verbatim from the config. The returned value will be of the type specified
     * by the user - it is not verified against a schema. If the value does not exist in the
     * config then this will return undefined;
     *
     * The caller should provide a namespace which it owns to retrieve settings from. During
     * read, the `key` will be treated as a sub-key of the namespace on the overall configuration
     * object. For example:
     *
     * ```json
     * {
     *     "inaccessible_root_level_config": "hello world",
     *     "org.example.my_module_namespace": {
     *         "my_key": 42
     *     }
     * }
     * ```
     *
     * The caller would use `getConfigValue<number>("org.example.my_module_namespace", "my_key")`
     * to get the targeted config value.
     *
     * There is no root namespace, thus root-level config values cannot be read.
     * @param namespace The module's namespace.
     * @param key The key to look up.
     * @returns The config value verbatim.
     */
    getConfigValue<T>(namespace: string, key: string): T | undefined;
    /**
     * Gets the apps for a given room.
     *
     * @param roomId The room ID to get the apps for.
     * @returns The apps for the given room.
     */
    getApps(roomId: string): Array<App>;
    /**
     * Gets the avatar URL for an app.
     *
     * @param app The app to get the avatar URL for.
     * @param width The width of the avatar.
     * @param height The height of the avatar.
     * @param resizeMethod The resize method to use, either "crop" or "scale".
     */
    getAppAvatarUrl(app: App, width?: number, height?: number, resizeMethod?: string): string | null;
    /**
     * Checks if an app is in a container for a given room.
     *
     * @param app The app to check.
     * @param container The container to check.
     * @param roomId The room ID to check.
     */
    isAppInContainer(app: App, container: Container, roomId: string): boolean;
    /**
     * Moves apps to containers for a given room.
     *
     * @param app The app to move.
     * @param container The container to move the app to.
     * @param roomId The room ID to move the app in.
     */
    moveAppToContainer(app: App, container: Container, roomId: string): void;
}

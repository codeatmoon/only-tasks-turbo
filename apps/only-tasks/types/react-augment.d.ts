// Workaround for React 19 ReactNode mismatch in Next.js app directory type checks
// Ensures JSX children union matches React.ReactNode used by DOM props
// Note: This is a softening workaround; revisit after React/Next type updates
export { }
declare global {
    namespace JSX {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type Element = any
    }
}
